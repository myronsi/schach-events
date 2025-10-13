export type HardcodedUser = {
  username: string;
  password: string;
};

export const USERS: HardcodedUser[] = [
  { username: '', password: '' }
];

export function validateCredentials(username: string, password: string): boolean {
  return USERS.some(u => u.username === username && u.password === password);
}

export function getUsernames(): string[] {
  return USERS.map(u => u.username);
}

export function getUsers(): HardcodedUser[] {
  return USERS;
}
