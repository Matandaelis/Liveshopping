import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  email: string;
  name?: string;
  id?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Decode mock token
        try {
          const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
          setUser({
            email: decoded.email,
            id: decoded.sub,
          });
        } catch {
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth check failed');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/');
  };

  return { user, isLoading, error, logout };
}
