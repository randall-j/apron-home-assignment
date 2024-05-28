import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver } from 'react-hook-form';
import * as yup from 'yup';

import { Gender } from '@/types';
import { trimSpaces } from '@/utils';

import { FormData } from '../types';

const schema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required('Please enter a first name')
      .matches(
        /^[A-Za-z-' ]+$/,
        'Please remove any special characters or numbers'
      )
      .min(5, 'First name must be at least 5 characters')
      .max(20, 'First name must be 20 characters or less'),
    lastName: yup
      .string()
      .trim()
      .required('Please enter a last name')
      .matches(
        /^[A-Za-z-' ]+$/,
        'Please remove any special characters or numbers'
      )
      .min(5, 'Last name must be at least 5 characters')
      .max(20, 'Last name must be 20 characters or less'),
    gender: yup
      .string()
      .required('Please select a gender')
      .oneOf(Object.values(Gender), 'Please select a gender'),
    age: yup
      .number()
      .positive('Age must be a positive number')
      .integer('Age must be an integer')
      .when('gender', {
        is: (gender: Gender) => gender === Gender.Female,
        then: (schema) => schema.max(117, 'Age must be 117 or less'),
        otherwise: (schema) => schema.max(112, 'Age must be 112 or less'),
      })
      .min(18, 'Age must be 18 or more')
      .typeError('Age must be a number')
      .required('Please enter an age'),
  })
  .required();

export const formResolver: Resolver<FormData> = (values, context, options) => {
  const modifiedValues: FormData = {
    ...values,
    firstName: trimSpaces(values.firstName),
    lastName: trimSpaces(values.lastName),
  };

  return yupResolver(schema)(modifiedValues, context, options);
};
