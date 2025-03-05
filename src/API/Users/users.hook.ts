import { useQuery } from '@tanstack/react-query';
import { usersApi } from './users.api';
import type { UserListResponse } from './types';

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: {
    page?: number;
    limit?: number;
    search?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    mobile?: string;
    sortBy?: string;
  }) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...usersKeys.details(), id] as const,
};

// Get all users
export const useUsers = (filters: {
  page?: number;
  limit?: number;
  search?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  mobile?: string;
  sortBy?: string;
}) => {
  return useQuery<UserListResponse>({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersApi.getUsers(filters),
  });
};