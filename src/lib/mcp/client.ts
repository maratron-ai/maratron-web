/**
 * MCP Client Service for connecting to the Maratron AI server
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { MCPToolCall, MCPToolResult, MCPServerConfig, UserContext } from './types';

export class MaratronMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  constructor(private config: MCPServerConfig) {}

  /**
   * Connect to the MCP server with connection pooling
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._establishConnection();
    return this.connectionPromise;
  }

  private async _establishConnection(): Promise<void> {
    try {
      // Create transport for communication with the MCP server
      this.transport = new StdioClientTransport({
        command: this.config.command || 'python',
        args: this.config.args || ['/Users/jacksonthetford/Desktop/maratron/maratron-ai/run_server.py'],
        env: {
          ...process.env,
          ...this.config.env
        }
      });

      // Create and connect the client
      this.client = new Client(
        {
          name: 'maratron-web-client',
          version: '1.0.0'
        },
        {
          capabilities: {
            tools: {}
          }
        }
      );

      await this.client.connect(this.transport);
      this.isConnected = true;

      console.log('Successfully connected to Maratron MCP server');
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.connectionPromise = null;
      throw new Error(`MCP connection failed: ${error}`);
    }
  }

  /**
   * Set user context in the MCP server
   */
  async setUserContext(userId: string): Promise<void> {
    await this.connect();
    
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      await this.client.callTool({
        name: 'set_current_user_tool',
        arguments: { user_id: userId }
      });
    } catch (error) {
      console.error('Failed to set user context:', error);
      throw new Error(`Failed to set user context: ${error}`);
    }
  }

  /**
   * Get user context from the MCP server
   */
  async getUserContext(): Promise<UserContext | null> {
    await this.connect();
    
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: 'get_current_user_tool',
        arguments: {}
      });

      if (result.content && result.content.length > 0) {
        const content = result.content[0];
        if (content.type === 'text') {
          try {
            return JSON.parse(content.text);
          } catch (parseError) {
            console.error('Failed to parse user context JSON:', content.text);
            return null;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get user context:', error);
      return null;
    }
  }

  /**
   * Execute a tool call on the MCP server
   */
  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    await this.connect();
    
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.callTool({
        name: toolCall.name,
        arguments: toolCall.arguments
      });

      return {
        content: result.content,
        isError: false
      };
    } catch (error) {
      console.error(`Failed to call tool ${toolCall.name}:`, error);
      return {
        content: [{
          type: 'text',
          text: `Error calling tool ${toolCall.name}: ${error}`
        }],
        isError: true
      };
    }
  }

  /**
   * List available tools from the MCP server
   */
  async listTools(): Promise<string[]> {
    await this.connect();
    
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.listTools();
      return result.tools.map(tool => tool.name);
    } catch (error) {
      console.error('Failed to list tools:', error);
      return [];
    }
  }

  /**
   * Get database summary using MCP server
   */
  async getDatabaseSummary(): Promise<string> {
    try {
      const result = await this.callTool({
        name: 'db_summary',
        arguments: {}
      });

      if (result.content && result.content.length > 0) {
        return result.content[0].text;
      }
      return 'No data available';
    } catch (error) {
      console.error('Failed to get database summary:', error);
      return 'Error retrieving database summary';
    }
  }

  /**
   * Get user's recent runs
   */
  async getUserRuns(userId: string, limit: number = 5): Promise<string> {
    try {
      await this.setUserContext(userId);
      
      const result = await this.callTool({
        name: 'list_runs_for_user',
        arguments: { user_id: userId, limit }
      });

      if (result.content && result.content.length > 0) {
        return result.content[0].text;
      }
      return 'No runs found';
    } catch (error) {
      console.error('Failed to get user runs:', error);
      return 'Error retrieving runs';
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (this.client && this.transport) {
      try {
        await this.client.close();
        this.client = null;
        this.transport = null;
        this.isConnected = false;
        this.connectionPromise = null;
        console.log('Disconnected from MCP server');
      } catch (error) {
        console.error('Error disconnecting from MCP server:', error);
      }
    }
  }
}

// Singleton instance with connection pooling
let mcpClientInstance: MaratronMCPClient | null = null;

export function getMCPClient(): MaratronMCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new MaratronMCPClient({
      host: 'localhost',
      port: 3001, // This will be updated based on your MCP server configuration
      command: 'python',
      args: ['/Users/jacksonthetford/Desktop/maratron/maratron-ai/run_server.py']
    });
  }
  return mcpClientInstance;
}

// Cleanup function for graceful shutdown
export async function closeMCPClient(): Promise<void> {
  if (mcpClientInstance) {
    await mcpClientInstance.disconnect();
    mcpClientInstance = null;
  }
}