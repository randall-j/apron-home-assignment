import { useRef } from 'react';
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import request from '@/api/request';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  userId: number;
}

const DeleteUserDialog = ({
  isOpen,
  onSuccess,
  onClose,
  userId,
}: DeleteUserDialogProps) => {
  const {
    mutate: onDeleteUser,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ['deleteUser', userId],
    mutationFn: async () => {
      // await userApi.deleteUser(userId);
      await request(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      onSuccess();
    },
  });
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      // leastDestructiveRef is used to make sure that the cancel button is focused when the dialog opens
      // This is important for accessibility
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete User
          </AlertDialogHeader>

          <AlertDialogBody>
            {isError && (
              <Alert status="error" marginBottom={2}>
                <AlertIcon />
                {error.message}
              </Alert>
            )}
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <ButtonGroup>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isDisabled={isPending}
                isLoading={isPending}
                onClick={() => onDeleteUser()}
              >
                Delete
              </Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
