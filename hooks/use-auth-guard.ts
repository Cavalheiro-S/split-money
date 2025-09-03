'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/user-context';
import { useSession } from '@/hooks/use-session';

export function useAuthGuard(redirectTo: string = '/sign-in') {
  const { user, loading } = useUser();
  const { session, isSessionValid } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Se não há usuário e não há sessão válida, redireciona
    if (!user && !isSessionValid()) {
      router.push(redirectTo);
    }
  }, [user, loading, session, isSessionValid, router, redirectTo]);

  return { user, loading, isAuthenticated: !!user || isSessionValid() };
}
