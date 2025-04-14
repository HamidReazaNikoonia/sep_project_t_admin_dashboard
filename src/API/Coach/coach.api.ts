import  axios from '../axios';
import { CoachCourseProgram, CoachCourseProgramResponse } from './types';

export const coachAPI = {
  getCoachCoursePrograms: async (params?: {
    page?: number;
    limit?: number;
    accessLevel?: string;
  }): Promise<CoachCourseProgramResponse> => {
    const { data } = await axios.get('/admin/setting/set/coach-course-program/set-access-level', { params });
    return data;
  },

  updateCoachCourseProgram: async (id: string, accessLevel: string): Promise<{ program: CoachCourseProgram }> => {
    const { data } = await axios.patch(`/admin/setting/set/coach-course-program/${id}/access-level`, { accessLevel });
    return data;
  },
};