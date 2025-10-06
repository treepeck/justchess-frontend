import { z } from 'zod';

export const SignupFormSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});
