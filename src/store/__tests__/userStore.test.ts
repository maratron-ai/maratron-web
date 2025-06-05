import { useUserStore } from '../userStore';

interface User { id: string; name: string; email: string; }

const sampleUser: User = { id: '1', name: 'Test', email: 't@test.com' } as any;

describe('useUserStore', () => {
  afterEach(() => {
    useUserStore.setState({ user: null });
  });

  it('sets and retrieves user', () => {
    useUserStore.getState().setUser(sampleUser as any);
    expect(useUserStore.getState().user).toEqual(sampleUser);
  });

  it('updates user fields', () => {
    useUserStore.getState().setUser(sampleUser as any);
    useUserStore.getState().updateUser({ name: 'New' });
    expect(useUserStore.getState().user?.name).toBe('New');
  });

  it('clears user', () => {
    useUserStore.getState().setUser(sampleUser as any);
    useUserStore.getState().clearUser();
    expect(useUserStore.getState().user).toBeNull();
  });
});
