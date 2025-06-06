import axios from 'axios';
import { createRun, updateRun, getRun, deleteRun, listRuns } from '../run';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('run api helpers', () => {
  afterEach(() => jest.clearAllMocks());

  it('createRun posts data', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: '1' } });
    const data = { distance: 5 };
    const result = await createRun(data);
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/runs', data);
    expect(result).toEqual({ id: '1' });
  });

  it('updateRun puts data', async () => {
    mockedAxios.put.mockResolvedValue({ data: { id: '1', distance: 10 } });
    const result = await updateRun('1', { distance: 10 });
    expect(mockedAxios.put).toHaveBeenCalledWith('/api/runs/1', { distance: 10 });
    expect(result).toEqual({ id: '1', distance: 10 });
  });

  it('getRun fetches data', async () => {
    const apiRun = {
      id: '1',
      date: '2024-01-01T00:00:00.000Z',
      duration: '00:30:00',
      distance: 5,
      distanceUnit: 'miles',
      pace: '06:00',
      paceUnit: 'miles',
      userId: 'user1',
    };
    mockedAxios.get.mockResolvedValue({ data: apiRun });
    const result = await getRun('1');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/runs/1');
    expect(result).toEqual({
      id: '1',
      date: new Date(apiRun.date),
      duration: '00:30:00',
      distance: 5,
      distanceUnit: 'miles',
      pace: { pace: '06:00', unit: 'miles' },
      userId: 'user1',
    });
  });

  it('deleteRun deletes data', async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });
    const result = await deleteRun('1');
    expect(mockedAxios.delete).toHaveBeenCalledWith('/api/runs/1');
    expect(result).toEqual({});
  });

  it('listRuns gets all runs', async () => {
    const apiRun = {
      id: '1',
      date: '2024-01-01T00:00:00.000Z',
      duration: '00:30:00',
      distance: 5,
      distanceUnit: 'miles',
      pace: '06:00',
      paceUnit: 'miles',
      userId: 'user1',
    };
    mockedAxios.get.mockResolvedValue({ data: [apiRun] });
    const result = await listRuns();
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/runs');
    expect(result).toEqual([
      {
        id: '1',
        date: new Date(apiRun.date),
        duration: '00:30:00',
        distance: 5,
        distanceUnit: 'miles',
        pace: { pace: '06:00', unit: 'miles' },
        userId: 'user1',
      },
    ]);
  });
});
