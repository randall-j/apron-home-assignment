import { useState } from 'react';
import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

import request from '@/api/request';
import { User } from '@/types';

import UserForm from './components/UserForm';
import DeleteUserDialog from './components/DeleteUserDialog';
import { BorderedTableContainer, Header, Wrap } from './styles';

enum ToastType {
  Create = 'create',
  Edit = 'edit',
  Delete = 'delete',
}

const getToastTitle = (type: ToastType) => {
  switch (type) {
    case ToastType.Create:
      return 'User created successfully';
    case ToastType.Edit:
      return 'User updated successfully';
    case ToastType.Delete:
      return 'User deleted successfully';
  }
};

interface UserFormModalState {
  isOpen: boolean;
  user: User | null;
}

// TODO: Nice to haves: Add pagination, sorting, and filtering

const Users = () => {
  const [userFormModalState, setUserFormModalState] =
    useState<UserFormModalState>({
      isOpen: false,
      user: null,
    });
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const toast = useToast();

  const {
    data: users,
    error,
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const response = await request<{ users: User[] }>('/api/users');

      return response.users;
    },
    refetchOnWindowFocus: false,
  });

  const openUserFormModal = (user: UserFormModalState['user'] = null) => {
    setUserFormModalState({
      isOpen: true,
      user,
    });
  };

  const closeUserFormModal = () => {
    setUserFormModalState({
      isOpen: false,
      user: null,
    });
  };

  const onUserFormSuccess = () => {
    refetch();
    closeUserFormModal();
    showToastMessage(
      userFormModalState.user ? ToastType.Edit : ToastType.Create
    );
  };

  const closeDeleteUserDialog = () => {
    setDeleteUserId(null);
  };

  const onDeleteUserSuccess = () => {
    refetch();
    closeDeleteUserDialog();
    showToastMessage(ToastType.Delete);
  };

  // Just for fun
  const showToastMessage = (type: ToastType) => {
    toast({
      title: getToastTitle(type),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isPending) {
    return (
      <Wrap>
        <Spinner alignSelf="center" />
      </Wrap>
    );
  }

  if (isError) {
    return (
      <Wrap>
        <Alert status="error" marginBottom={2}>
          <AlertIcon />
          {error.message}
        </Alert>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Header>
        <Heading as="h1">Users</Heading>
        <Button colorScheme="blue" onClick={() => openUserFormModal()}>
          Create user
        </Button>
      </Header>
      <BorderedTableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>First name</Th>
              <Th>Last name</Th>
              <Th>Gender</Th>
              <Th isNumeric>Age</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          {users.length > 0 && (
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.firstName}</Td>
                  <Td>{user.lastName}</Td>
                  <Td>{user.gender}</Td>
                  <Td isNumeric>{user.age}</Td>
                  <Td>
                    <ButtonGroup>
                      <Button
                        colorScheme="blue"
                        onClick={() => openUserFormModal(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
        {users.length === 0 && (
          <Text align="center" marginTop={2}>
            No users found.
          </Text>
        )}
      </BorderedTableContainer>
      {userFormModalState.isOpen && (
        <UserForm
          isOpen
          onClose={closeUserFormModal}
          onSuccess={onUserFormSuccess}
          user={userFormModalState.user}
        />
      )}
      {deleteUserId !== null && (
        <DeleteUserDialog
          isOpen
          onClose={closeDeleteUserDialog}
          onSuccess={onDeleteUserSuccess}
          userId={deleteUserId}
        />
      )}
    </Wrap>
  );
};

export default Users;
