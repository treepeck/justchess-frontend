import { z } from 'zod';

export type SignupState =
  | {
      message?: string;
      errors?: { name?: string[]; email?: string[]; password?: string[] };
      defaultValues?: { name?: string; email?: string; password?: string };
    }
  | undefined;

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Must be at least 2 characters long')
    .max(60, 'Must not exceed 60 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Can only contain letters and numbers'),
  email: z.email(),
  password: z
    .string()
    .min(2, 'Must be at least 5 characters long')
    .max(71, 'Must not exceed 71 characters'),
});

/*
 	nameEx  (`^[a-zA-Z0-9]{2,60}$`)
	emailEx (`^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z0-9._]+$`)
	pwdEx   (`^[a-zA-Z0-9!@#$%^&*()_+-/.<>]{5,71}$`)
*/
