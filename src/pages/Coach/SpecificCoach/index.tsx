import { useParams } from 'react-router';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useGetCoachById } from '../../../API/Coach/coach.hook';

import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledTableCell,
} from '../../../components/StyledTableContainer';


const SpecificCoachPage = () => {
  const { id } = useParams();

  const { data: coach, isLoading, error } = useGetCoachById(id);

  if (isLoading) {
      return (
        <div className='w-full flex justify-center items-center'>
          <CircularProgress />
        </div>
      )
  }

  if (error) {
    return (
      <div className='w-full flex justify-center items-center'>
        <Alert severity="error">
              مشکلی پیش آمده
        </Alert>
      </div>
    )
  } 


  if (!coach) {
    return (
      <div className='w-full flex justify-center items-center'>
        <Alert severity="error">
          مربی یافت نشده
        </Alert>
      </div>
    )
  }

  return (
    <div className='p-3' dir='rtl'>
      {/* Coach Information Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography sx={{margin: '20px 0'}} className='mb-12' fontWeight={600} variant="h5" gutterBottom>
            اطلاعات مربی
          </Typography>
          <StyledTableContainer>
            <StyledTable>
              <StyledTableBody>
              <StyledTableRow>
                  <StyledTableCell sx={{fontWeight: 800}} component="th" scope="row">ID</StyledTableCell>
                  <StyledTableCell  sx={{fontWeight: 800}}>{coach.id}</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell sx={{fontWeight: 800}} component="th" scope="row">شماره موبایل</StyledTableCell>
                  <StyledTableCell>{coach.mobile}</StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell  sx={{fontWeight: 800}} component="th" scope="row">نقش</StyledTableCell>
                  <StyledTableCell>
                    <Chip 
                      label={coach.role === 'coach' ? 'مربی' : 'کاربر'} 
                      color={coach.role === 'coach' ? 'success' : 'default'}
                    />
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell  sx={{fontWeight: 800}} component="th" scope="row">سطح فعال</StyledTableCell>
                  <StyledTableCell>
                    <Chip 
                      label={coach.access_level === 'none' ? 'بدون دسترسی' : coach.access_level}
                      color={coach.access_level === 'none' ? 'error' : 'success'}
                    />
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell  sx={{fontWeight: 800}} component="th" scope="row">سطح درخواستی</StyledTableCell>
                  <StyledTableCell>
                    <Chip 
                      label={coach.access_level_request === 'none' ? 'بدون درخواست' : coach.access_level_request}
                      color={coach.access_level_request === 'none' ? 'default' : 'info'}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              </StyledTableBody>
            </StyledTable>
          </StyledTableContainer>
        </CardContent>
      </Card>

      {/* Enrolled Courses Card */}
      <Card sx={{py: '30px'}}>
        <CardContent>
          <Typography sx={{mb: '30px'}} variant="h5" fontWeight={600} gutterBottom>
            دوره‌های ثبت‌نام شده
          </Typography>
          {coach.enrolledCourses.map((course, index) => (
            <Accordion key={course._id}>
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography  sx={{fontWeight: 800}} >{course.coach_course_program_id.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    تاریخ شروع دوره: {new Date(course.enrolled_at).toLocaleDateString('fa-IR')}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    وضعیت دوره: 
                    <Chip 
                      label={course.is_active ? 'فعال' : 'غیرفعال'} 
                      color={course.is_active ? 'success' : 'error'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  </Typography>
                </Box>

                <StyledTableContainer>
                  <StyledTable size="small">
                    <StyledTableHead>
                      <StyledTableRow>
                        <StyledTableCell>ترتیب</StyledTableCell>
                        <StyledTableCell>وضعیت تکمیل</StyledTableCell>
                        <StyledTableCell>تاریخ انقضا</StyledTableCell>
                        <StyledTableCell>نمره آزمون</StyledTableCell>
                      </StyledTableRow>
                    </StyledTableHead>
                    <StyledTableBody>
                      {course.completedSubjects.map((subject) => (
                        <StyledTableRow key={subject._id}>
                          <StyledTableCell>{subject.order}</StyledTableCell>
                          <StyledTableCell>
                            <Chip 
                              label={subject.isCompleted ? 'تکمیل شده' : 'تکمیل نشده'} 
                              color={subject.isCompleted ? 'success' : 'warning'}
                              size="small"
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            {new Date(subject.expireDate).toLocaleDateString('fa-IR')}
                          </StyledTableCell>
                          <StyledTableCell>
                            {subject.examScore !== undefined ? subject.examScore : '-'}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </StyledTableBody>
                  </StyledTable>
                </StyledTableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecificCoachPage;