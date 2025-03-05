export interface User {
    id: string;
    first_name: string;
    last_name: string;
    mobile: string;
    role: string;
  }
  
  export interface UserListResponse {
    results: User[];
    totalResults: number;
    page: number;
    limit: number;
  }
  
  export interface UserResponse {
    user: User;
  }