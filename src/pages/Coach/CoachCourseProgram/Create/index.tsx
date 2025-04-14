import React, { memo, Suspense, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2 as Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import StyledPaper from '../../../../components/StyledPaper';


import Spinner from '../../../../components/Spinner'

// import styles from './index.module.css'

import { Link } from 'react-router'

interface Props { }



// Validation schema
const schema = yup.object({
  title: yup.string().required('عنوان الزامی است'),
  description: yup.string().required('توضیحات الزامی است'),
  amount: yup
    .number()
    .required('مبلغ الزامی است')
    .min(0, 'مبلغ باید بزرگتر از صفر باشد'),
  course_subject_count: yup
    .number()
    .required('تعداد سرفصل‌ها الزامی است')
    .min(1, 'تعداد سرفصل‌ها باید حداقل 1 باشد'),
  is_have_penalty: yup.boolean().default(false),
  penalty_fee: yup.mixed().when('is_have_penalty', {
    is: true,
    then: (schema) => schema
      .test('is-number', 'مبلغ جریمه باید عدد باشد', (value) => !isNaN(value))
      .test('is-positive', 'مبلغ جریمه باید بزرگتر از صفر باشد', (value) => value > 0)
      .required('مبلغ جریمه الزامی است'),
    otherwise: (schema) => schema.nullable().optional(),
  }),
});
  
  type FormData = yup.InferType<typeof schema>;
  

const CreateCoachCoursePage: React.FC<Props> = memo(() => {

    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
      } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
          is_have_penalty: false,
          course_subject_count: 1,
          amount: 0,
        },
      });
    
      const isHavePenalty = watch('is_have_penalty');
    
      const onSubmit = (data: FormData) => {
        console.log(data);
        setStep(2); // Move to next step
      };

      

  return (
    <>
      <div className='flex justify-start pb-8 px-4 md:px-8' >
        <div className='flex '>
          <Link to="/coach/coach-course-program">
            <Button variant="outlined">
              بازگشت
            </Button>
          </Link>
        </div>

      </div>

      <div dir="rtl" className='px-4 md:px-8'>
        <Suspense fallback={<Spinner size="xl" />}>
        {step === 1 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <StyledPaper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  اطلاعات اصلی
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      {...register('title')}
                      fullWidth
                      label="عنوان"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...register('description')}
                      fullWidth
                      multiline
                      rows={4}
                      label="توضیحات"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('amount')}
                      fullWidth
                      type="number"
                      label="مبلغ"
                      error={!!errors.amount}
                      helperText={errors.amount?.message}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      {...register('course_subject_count')}
                      fullWidth
                      type="number"
                      label="تعداد سرفصل‌ها"
                      error={!!errors.course_subject_count}
                      helperText={errors.course_subject_count?.message}
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          {...register('is_have_penalty')}
                        />
                      }
                      label="دارای جریمه"
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...register('penalty_fee')}
                      fullWidth
                      type="number"
                      label="مبلغ جریمه"
                      disabled={!isHavePenalty}
                      error={!!errors.penalty_fee}
                      helperText={errors.penalty_fee?.message}
                    />
                  </Grid>
                </Grid>
              </StyledPaper>
            </Grid>

            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
              >
                مرحله بعد
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {step === 2 && (
        <Typography>Step 2 content will go here</Typography>
      )}
        </Suspense>
      </div>
    </>
  )
})
CreateCoachCoursePage.displayName = 'CreateCoachCoursePage'

export default CreateCoachCoursePage
