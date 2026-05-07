import { z } from 'zod';

import { ERROR_MESSAGES } from '@/constants/ERROR_MESSAGES';
import { AUTH_FORM_VALIDATION_RULES } from '@/constants/VALIDATION';

const passwordSchema = z
  .string()
  .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
  .min(
    AUTH_FORM_VALIDATION_RULES.USER_PASSWORD_MIN_LENGTH,
    ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
  )
  .regex(
    AUTH_FORM_VALIDATION_RULES.USER_PASSWORD_ALLOWED_CHARACTERS_REGEX,
    ERROR_MESSAGES.PASSWORD_ALLOWED_CHARS,
  )
  .regex(
    AUTH_FORM_VALIDATION_RULES.USER_PASSWORD_REQUIRED_COMBINATION_REGEX,
    ERROR_MESSAGES.PASSWORD_REQUIRED_COMBINATION,
  );

export const signUpFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
      .pipe(z.email(ERROR_MESSAGES.EMAIL_INVALID)),
    nickname: z
      .string()
      .trim()
      .min(1, ERROR_MESSAGES.NAME_REQUIRED)
      .max(
        AUTH_FORM_VALIDATION_RULES.USER_NAME_MAX_LENGTH,
        ERROR_MESSAGES.NAME_MAX_LENGTH,
      ),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ['passwordConfirmation'],
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
    .pipe(z.email(ERROR_MESSAGES.EMAIL_INVALID)),
  password: z
    .string()
    .min(1, ERROR_MESSAGES.PASSWORD_REQUIRED)
    .min(
      AUTH_FORM_VALIDATION_RULES.USER_PASSWORD_MIN_LENGTH,
      ERROR_MESSAGES.PASSWORD_MIN_LENGTH,
    ),
});

export const forgotPasswordFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ERROR_MESSAGES.EMAIL_REQUIRED)
    .pipe(z.email(ERROR_MESSAGES.EMAIL_INVALID)),
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, ERROR_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ['passwordConfirmation'],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
