export const USERNAME_REGEX = /^[a-zA-Z0-9._-]{6,20}$/;
export const USERNAME_VALIDATION_MESSAGE =
  'Username should be at least 6 characters long and 20 characters max and contain only letters, numbers and some characters like . _ - @.';

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
export const PASSWORD_VALIDATION_MESSAGE =
  'Password should be at least 6 characters long and 20 characters max and contain at least one uppercase letter, one lowercase letter, and one number.';
