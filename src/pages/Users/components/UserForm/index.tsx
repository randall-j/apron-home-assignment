import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import request from '@/api/request';
import { User, Gender } from '@/types';

import { Form } from './styles';
import { FormData } from './types';
import { formResolver } from './utils';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null;
}

const UserForm = ({
  isOpen,
  onClose,
  onSuccess,
  user = null,
}: UserFormProps) => {
  const { formState, handleSubmit, register } = useForm<FormData>({
    resolver: formResolver,
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      gender: user?.gender,
      age: user?.age,
    },
  });

  const {
    mutate: onSubmit,
    isError: hasSubmitError,
    isPending,
    error: submitError,
  } = useMutation({
    mutationKey: ['deleteUser', user?.id],
    mutationFn: async (userData: FormData) => {
      if (user) {
        await request<null>(`/api/users/${user.id}`, {
          method: 'PATCH',
          body: JSON.stringify(userData),
        });
      } else {
        await request<null>('/api/users', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      }

      onSuccess();
    },
  });

  const { errors, isSubmitting } = formState;
  const isFormSubmitting = isSubmitting || isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{user ? 'Edit' : 'Create'} User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {hasSubmitError && (
            <Alert status="error" marginBottom={2}>
              <AlertIcon />
              {submitError.message}
            </Alert>
          )}
          <Form id="userForm" onSubmit={handleSubmit((data) => onSubmit(data))}>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel>First name</FormLabel>
              <Input placeholder="First name" {...register('firstName')} />
              <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel>Last name</FormLabel>
              <Input placeholder="Last name" {...register('lastName')} />
              <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.gender}>
              <FormLabel>Gender</FormLabel>
              <Select placeholder="Select" {...register('gender')}>
                {Object.values(Gender).map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.age}>
              <FormLabel>Age</FormLabel>
              <NumberInput min={0}>
                <NumberInputField placeholder="Age" {...register('age')} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{errors.age?.message}</FormErrorMessage>
            </FormControl>
          </Form>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              colorScheme="blue"
              form="userForm"
              isDisabled={isFormSubmitting}
              isLoading={isFormSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
