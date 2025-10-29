import { z } from 'zod';

export type SignupState =
  | {
      message?: string;
      errors?: { name?: string[]; email?: string[]; password?: string[] };
      defaultValues?: { name?: string; email?: string; password?: string };
    }
  | undefined;


