import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coachAPI } from './coach.api';
import { showToast } from '../../utils/toast';

export const useCoachCoursePrograms = (params?: {
  page?: number;
  limit?: number;
  accessLevel?: string;
}) => {
  return useQuery({
    queryKey: ['coach-course-programs', params],
    queryFn: () => coachAPI.getCoachCoursePrograms(params),
  });
};

export const useUpdateCoachCourseProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, accessLevel }: { id: string; accessLevel: string }) =>
      coachAPI.updateCoachCourseProgram(id, accessLevel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-course-programs'] });
      showToast('موفق', 'سطح دسترسی برنامه با موفقیت بروزرسانی شد', 'success');
    },
    onError: () => {
      showToast('خطا', 'خطا در بروزرسانی سطح دسترسی برنامه', 'error');
    },
  });
};