import { useAuthStore } from '../stores/authStore';

describe('useAuthStore', () => {
  it('should have initial null state', () => {
    const { user, accessToken } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(accessToken).toBeNull();
  });

  it('should update state on setAuth', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test' };
    useAuthStore.getState().setAuth(user, 'token123');
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe('token123');
  });

  it('should reset state on logout', () => {
    useAuthStore.getState().logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });
});
