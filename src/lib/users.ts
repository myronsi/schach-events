import dotenv from 'dotenv';

dotenv.config();

export type HardcodedUser = {
  username: string;
  password: string;
};

const USERS: HardcodedUser[] = process.env.USERS
  ? JSON.parse(process.env.USERS)
  : [];

export function validateCredentials(username: string, password: string): boolean {
  return USERS.some(u => u.username === username && u.password === password);
}

export function getUsernames(): string[] {
  return USERS.map(u => u.username);
}

export function getUsers(): HardcodedUser[] {
  return USERS;
}
