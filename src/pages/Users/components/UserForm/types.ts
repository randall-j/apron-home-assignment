import { User } from '@/types';

export interface FormData extends Omit<User, 'id'> {}
