export class User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  isBanned: boolean;
  isEmailConfirmed: boolean;
}
