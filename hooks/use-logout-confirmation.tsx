'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UseLogoutConfirmationReturn {
  ConfirmationDialog: React.ComponentType;
  confirmLogout: () => Promise<boolean>;
}

export function useLogoutConfirmation(): UseLogoutConfirmationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  const confirmLogout = (): Promise<boolean> => {
    return new Promise((res) => {
      setResolve(() => res);
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolve?.(true);
    setResolve(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolve?.(false);
    setResolve(null);
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sair da aplicação</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja sair da aplicação? Você precisará fazer login novamente para acessar sua conta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Sair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    ConfirmationDialog,
    confirmLogout,
  };
}
