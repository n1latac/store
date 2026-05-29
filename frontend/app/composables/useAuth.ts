import { computed } from 'vue';

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  const username = useCookie<string | null>('auth_username', {
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  const isAuthenticated = computed(() => !!token.value);

  const login = async (userStr: string, passStr: string) => {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;

    try {
      const data = await $fetch<{ token: string }>(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { username: userStr, password: passStr },
      });

      token.value = data.token;
      username.value = userStr;
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    username.value = null;
  };

  return {
    token,
    username,
    isAuthenticated,
    login,
    logout,
  };
};
