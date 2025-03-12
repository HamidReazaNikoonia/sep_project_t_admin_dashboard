import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2 as Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateCourse, useCourse, useCourseCategories } from '../../../API/Course/course.hook';
import StyledPaper from '../../../components/StyledPaper';
import { showToast } from '../../../utils/toast';


// Validation schema
const schema = yup.object({
    title: yup.string().required('عنوان دوره الزامی است'),
    sub_title: yup.string().required('زیرعنوان دوره الزامی است'),
    price: yup
      .number()
      .required('قیمت دوره الزامی است')
      .min(10000, 'حداقل قیمت ۱۰,۰۰۰ تومان است'),
    course_type: yup.string().required('نوع دوره الزامی است'),
    course_category: yup.string().required('دسته‌بندی دوره الزامی است'),
    max_member_accept: yup
      .number()
      .required('حداکثر ظرفیت الزامی است')
      .min(1, 'حداقل ظرفیت ۱ نفر است')
      .integer('ظرفیت باید عدد صحیح باشد'),
    course_language: yup.string().required('زبان دوره الزامی است'),
    course_duration: yup.number().required('مدت دوره الزامی است'),
    slug: yup.string(),
    // educational_level: yup.number().required('سطح آموزشی الزامی است'),
    is_have_licence: yup.boolean().default(false),
    // coach_id: yup.string().required('انتخاب مدرس الزامی است'),
    course_status: yup.boolean().default(true),
    sample_media: yup.array().of(
      yup.object({
        media_type: yup.string().required('نوع رسانه الزامی است'),
        media_title: yup.string().required('عنوان رسانه الزامی است'),
        url_address: yup.string(),
        file: yup.mixed(),
      })
    ).min(1, 'حداقل یک نمونه رسانه الزامی است'),
    course_objects: yup.array().of(
      yup.object({
        subject_title: yup.string().required('عنوان سرفصل الزامی است'),
        status: yup.string().oneOf(['PUBLIC', 'PRIVATE']).default('PRIVATE'),
        duration: yup.number().required('مدت زمان الزامی است'),
        files: yup.mixed(),
      })
    ),
  });
  

type FormData = yup.InferType<typeof schema>;

const EditCourse = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const { data: courseData, isLoading: isLoadingCourse } = useCourse(course_id!);
  const { data: categories = [] } = useCourseCategories();
  const updateCourse = useUpdateCourse(course_id!);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      is_have_licence: false,
      course_status: true,
      course_type: '',
      sample_media: [],
      course_objects: [],
    },
  });

  const { fields: sampleMediaFields, append: appendSampleMedia, remove: removeSampleMedia } = 
    useFieldArray({
      name: 'sample_media',
      control,
    });

  const { fields: courseObjectFields, append: appendCourseObject, remove: removeCourseObject } = 
    useFieldArray({
      name: 'course_objects',
      control,
    });

  // Set form default values when course data is loaded
  useEffect(() => {
    if (courseData) {
      const course = courseData;
      console.log('Course Data:', course);
      reset({
        title: course.title,
        sub_title: course.sub_title,
        price: course.price,
        course_type: course.course_type,
        course_category: course.course_category?._id,
        max_member_accept: course.max_member_accept,
        course_language: course.course_language,
        course_duration: course.course_duration,
        educational_level: course.educational_level,
        is_have_licence: course.is_have_licence,
        coach_id: course.coach_id?._id,
        course_status: course.course_status,
        sample_media: course.sample_media,
        course_objects: course.course_objects,
        slug: course.slug,
      });
    }
  }, [courseData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateCourse.mutateAsync(data);
      showToast('موفق', 'دوره با موفقیت بروزرسانی شد', 'success');
      navigate('/courses');
    } catch (error) {
      showToast('خطا', 'خطا در بروزرسانی دوره', 'error');
      console.error('Error updating course:', error);
    }
  };

  if (isLoadingCourse) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box dir="rtl" p={3}>
      <Typography variant="h4" gutterBottom>
        ویرایش دوره
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                اطلاعات پایه
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('title')}
                    fullWidth
                    label="عنوان دوره"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('sub_title')}
                    fullWidth
                    label="زیرعنوان"
                    error={!!errors.sub_title}
                    helperText={errors.sub_title?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('course_type')}
                    select
                    fullWidth
                    label="نوع دوره"
                    error={!!errors.course_type}
                    helperText={errors.course_type?.message}
                    defaultValue={courseData?.course_type}
                  >
                    <MenuItem value="HOZORI">حضوری</MenuItem>
                    <MenuItem value="OFFLINE">آفلاین</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('course_category')}
                    select
                    fullWidth
                    label="دسته‌بندی"
                    error={!!errors.course_category}
                    helperText={errors.course_category?.message}
                    defaultValue={courseData?.course_category?._id}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('price')}
                    fullWidth
                    type="number"
                    label="قیمت دوره (تومان)"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Course Details */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                جزئیات دوره
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    {...register('max_member_accept')}
                    fullWidth
                    type="number"
                    label="حداکثر ظرفیت"
                    error={!!errors.max_member_accept}
                    helperText={errors.max_member_accept?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    {...register('course_duration')}
                    fullWidth
                    type="number"
                    label="مدت دوره (ساعت)"
                    error={!!errors.course_duration}
                    helperText={errors.course_duration?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    {...register('course_language')}
                    fullWidth
                    label="زبان دوره"
                    error={!!errors.course_language}
                    helperText={errors.course_language?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        {...register('is_have_licence')}
                        defaultChecked={courseData?.is_have_licence}
                      />
                    }
                    label="دارای گواهینامه"
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Submit Button */}
          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={updateCourse.isPending}
              sx={{ mt: 3 }}
            >
              {updateCourse.isPending ? 'در حال بروزرسانی...' : 'بروزرسانی دوره'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditCourse; 