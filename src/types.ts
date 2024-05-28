export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
}

export interface User {
  age: number;
  firstName: string;
  gender: Gender;
  id: number;
  lastName: string;
}
