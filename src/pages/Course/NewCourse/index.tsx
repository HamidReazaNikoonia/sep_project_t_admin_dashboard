import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2 as Grid,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateCourse, useCourseCategories } from '../../../API/Course/course.hook';
import StyledPaper from '../../../components/StyledPaper';
import { showToast } from '../../../utils/toast';
import ImageUploader from 'react-images-upload';

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
  educational_level: yup.number().required('سطح آموزشی الزامی است'),
  is_have_licence: yup.boolean().default(false),
  coach_id: yup.string().required('انتخاب مدرس الزامی است'),
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

const NewCourse = () => {
  const navigate = useNavigate();
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const { data: categories = [] } = useCourseCategories();
  const createCourse = useCreateCourse();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      is_have_licence: false,
      course_status: true,
      sample_media: [{ media_type: '', media_title: '', url_address: '' }],
      course_objects: [],
    },
  });

  const { fields: sampleMediaFields, append: appendSampleMedia, remove: removeSampleMedia } =
    useFieldArray({
      control,
      name: "sample_media"
    });

  const { fields: courseObjectFields, append: appendCourseObject, remove: removeCourseObject } =
    useFieldArray({
      control,
      name: "course_objects"
    });

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:9000/v1/admin/setting/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.uploadedFile?._id;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let thumbnailId;
      if (thumbnailImage) {
        thumbnailId = await uploadFile(thumbnailImage);
      }

      // Upload sample media files if any
      const sampleMediaWithFiles = await Promise.all(
        data.sample_media.map(async (media) => {
          if (media.file instanceof File) {
            const fileId = await uploadFile(media.file);
            return { ...media, file: fileId };
          }
          return media;
        })
      );

      // Upload course object files if any
      const courseObjectsWithFiles = await Promise.all(
        data.course_objects.map(async (object) => {
          if (object.files instanceof File) {
            const fileId = await uploadFile(object.files);
            return { ...object, files: fileId };
          }
          return object;
        })
      );

      await createCourse.mutateAsync({
        ...data,
        tumbnail_image: thumbnailId,
        sample_media: sampleMediaWithFiles,
        course_objects: courseObjectsWithFiles,
      });

      showToast('موفق', 'دوره با موفقیت ایجاد شد', 'success');
      navigate('/courses');
    } catch (error) {
      showToast('خطا', 'خطا در ایجاد دوره', 'error');
    }
  };

  return (
    <Box dir="rtl" p={3}>
      <Typography variant="h4" gutterBottom>
        ایجاد دوره جدید
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                اطلاعات اصلی
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="عنوان دوره"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="sub_title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="زیرعنوان"
                        error={!!errors.sub_title}
                        helperText={errors.sub_title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="course_type"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="نوع دوره"
                        error={!!errors.course_type}
                        helperText={errors.course_type?.message}
                      >
                        <MenuItem value="HOZORI">حضوری</MenuItem>
                        <MenuItem value="OFFLINE">آفلاین</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="course_category"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="دسته‌بندی"
                        error={!!errors.course_category}
                        helperText={errors.course_category?.message}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="قیمت دوره (تومان)"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                      />
                    )}
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
                  <Controller
                    name="max_member_accept"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="حداکثر ظرفیت"
                        error={!!errors.max_member_accept}
                        helperText={errors.max_member_accept?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name="course_duration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="مدت دوره (ساعت)"
                        error={!!errors.course_duration}
                        helperText={errors.course_duration?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name="course_language"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="زبان دوره"
                        error={!!errors.course_language}
                        helperText={errors.course_language?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name="is_have_licence"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...field}
                            checked={field.value}
                          />
                        }
                        label="دارای گواهینامه"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Thumbnail Image */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                تصویر شاخص
              </Typography>
              <ImageUploader
                withIcon={true}
                buttonText="انتخاب تصویر شاخص"
                onChange={(files) => setThumbnailImage(files[0])}
                imgExtension={['.jpg', '.jpeg', '.png']}
                maxFileSize={5242880}
                singleImage={true}
                withPreview={true}
              />
            </StyledPaper>
          </Grid>

          {/* Uploader Sample Media */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">نمونه‌های آموزشی</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => appendSampleMedia({
                    media_type: '',
                    media_title: '',
                    url_address: ''
                  })}
                >
                  افزودن نمونه
                </Button>
              </Box>

              {sampleMediaFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`sample_media.${index}.media_title`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="عنوان"
                            error={!!errors.sample_media?.[index]?.media_title}
                            helperText={errors.sample_media?.[index]?.media_title?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`sample_media.${index}.media_type`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="نوع رسانه"
                            error={!!errors.sample_media?.[index]?.media_type}
                            helperText={errors.sample_media?.[index]?.media_type?.message}
                          >
                            <MenuItem value="VIDEO">ویدیو</MenuItem>
                            <MenuItem value="AUDIO">صوت</MenuItem>
                            <MenuItem value="PDF">PDF</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name={`sample_media.${index}.url_address`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="آدرس URL"
                            error={!!errors.sample_media?.[index]?.url_address}
                            helperText={errors.sample_media?.[index]?.url_address?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name={`sample_media.${index}.file`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Box sx={{ mt: 2 }}>
                            <input
                              type="file"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              style={{ display: 'none' }}
                              id={`sample-media-file-${index}`}
                            />
                            <label htmlFor={`sample-media-file-${index}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                              >
                                انتخاب فایل
                              </Button>
                            </label>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid size={12} display="flex" justifyContent="flex-end">
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeSampleMedia(index)}
                      >
                        حذف
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </StyledPaper>
          </Grid>

          {/* Course Objects Section */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">سرفصل‌های دوره</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => appendCourseObject({
                    subject_title: '',
                    status: 'PRIVATE',
                    duration: 0,
                  })}
                >
                  افزودن سرفصل
                </Button>
              </Box>

              {courseObjectFields.map((field, index) => (
                <Box key={field.id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Controller
                        name={`course_objects.${index}.subject_title`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="عنوان سرفصل"
                            error={!!errors.course_objects?.[index]?.subject_title}
                            helperText={errors.course_objects?.[index]?.subject_title?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Controller
                        name={`course_objects.${index}.duration`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="number"
                            label="مدت زمان (دقیقه)"
                            error={!!errors.course_objects?.[index]?.duration}
                            helperText={errors.course_objects?.[index]?.duration?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Controller
                        name={`course_objects.${index}.status`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            fullWidth
                            label="وضعیت"
                            error={!!errors.course_objects?.[index]?.status}
                            helperText={errors.course_objects?.[index]?.status?.message}
                          >
                            <MenuItem value="PUBLIC">عمومی</MenuItem>
                            <MenuItem value="PRIVATE">خصوصی</MenuItem>
                          </TextField>
                        )}
                      />
                    </Grid>

                    <Grid size={12}>
                      <Controller
                        name={`course_objects.${index}.files`}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <Box sx={{ mt: 2 }}>
                            <input
                              type="file"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              style={{ display: 'none' }}
                              id={`course-object-file-${index}`}
                            />
                            <label htmlFor={`course-object-file-${index}`}>
                              <Button
                                variant="outlined"
                                component="span"
                                fullWidth
                              >
                                انتخاب فایل سرفصل
                              </Button>
                            </label>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid size={12} display="flex" justifyContent="flex-end">
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeCourseObject(index)}
                      >
                        حذف سرفصل
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </StyledPaper>
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={createCourse.isPending}
            >
              ایجاد دوره
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default NewCourse;