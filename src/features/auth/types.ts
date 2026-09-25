export enum AppState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  CREATING = 'CREATING',
  TAKING_QUIZ = 'TAKING_QUIZ',
  VIEWING_RESULTS = 'VIEWING_RESULTS'
}

export interface User {
  id?: number;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  register: (email: string) => Promise<boolean>;
  logout: () => void;
}
