export interface CoachCourseProgram {
    _id: string;
    name: string;
    description?: string;
    accessLevel: 'free' | 'premium' | 'vip';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CoachCourseProgramResponse {
    programs: CoachCourseProgram[];
    total: number;
    page: number;
    limit: number;
  }