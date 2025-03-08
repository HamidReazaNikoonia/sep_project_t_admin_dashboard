import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  TextField,
  Switch,
  Button,
  Typography,
  Grid2 as Grid,
  MenuItem,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  useUpdateProduct, 
  useCategories, 
  useProduct 
} from '../../../API/Products/products.hook';
import StyledPaper from '../../../components/StyledPaper';
import { showToast } from '../../../utils/toast';
import ImageUploader from 'react-images-upload';

// Same validation schema as NewProduct
const schema = yup.object({
    title: yup.string().required('عنوان الزامی است'),
    subtitle: yup.string().required('زیرعنوان الزامی است'),
    description: yup
      .string()
      .required('توضیحات الزامی است')
      .min(30, 'توضیحات باید حداقل ۳۰ کاراکتر باشد'),
    slug: yup.string().required('اسلاگ الزامی است'),
    brand: yup.string(),
    category: yup.string().required('دسته‌بندی الزامی است'),
    countInStock: yup.number().min(0).default(0),
    price: yup.number().required('قیمت الزامی است').min(0, 'قیمت باید بزرگتر از صفر باشد'),
    discountable: yup.object().shape({
      status: yup.boolean().default(false),
      percent: yup.number().when('status', {
        is: true,
        then: (schema) => schema.required('درصد تخفیف الزامی است').min(0).max(100),
        otherwise: (schema) => schema.nullable(),
      }),
    }),
  });

type FormData = yup.InferType<typeof schema>;

const EditProduct = () => {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  
  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct } = useProduct(product_id!);
  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct(product_id!);

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      countInStock: 0,
      discountable: {
        status: false,
        percent: 0,
      },
    },
  });

  // Set form default values when product data is loaded
  useEffect(() => {
    if (productData?.data?.products[0]) {
      const product = productData.data.products[0];
      reset({
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        slug: product.slug,
        brand: product.brand,
        category: product.category._id,
        countInStock: product.countInStock,
        price: product.price,
        discountable: {
          status: product.discountable.status,
          percent: product.discountable.percent,
        },
      });
    }
  }, [productData, reset]);

  const discountableStatus = watch('discountable.status');

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:9000/v1/admin/setting/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!data.uploadedFile) {
        showToast('خطا', 'خطا در اپلود تصویر', 'error');
        return false;
      } else if (!data.uploadedFile?._id) {
        showToast('خطا', 'خطا در اپلود تصویر', 'error');
        return false;
      }
      return data.uploadedFile._id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
        const imageArr = [];
        let imageIds = [];
        let getImageFromProduct = productData?.data?.products[0].images || [];

      for (const image of getImageFromProduct) {
        imageArr.push(image._id);
      }
      
      // Upload new images if any
      if (images.length > 0) {
        const newImageIds = await Promise.all(images.map(uploadImage));
        imageIds = [...imageArr, ...newImageIds];
      } else {
        imageIds = [...imageArr];
      }

      // @ts-ignore
      await updateProduct.mutateAsync({
        ...data,
        ...(imageIds.length > 0 && { images: imageIds }),
        ...(imageIds.length > 0 && { thumbnail: imageIds[0] }),
      });

      showToast('موفق', 'محصول با موفقیت ویرایش شد', 'success');
      navigate('/products');
    } catch (error) {
      showToast('خطا', 'خطا در ویرایش محصول', 'error');
    }
  };

  if (isLoadingProduct) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Rest of the JSX remains the same as NewProduct component
  return (
    <Box dir="rtl" p={3}>
      <Typography variant="h4" gutterBottom>
        ویرایش محصول
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography className='pb-4' variant="h6" gutterBottom>اطلاعات اصلی</Typography>
              <Grid dir="rtl" container spacing={2}>
                <Grid size={{xs: 12, md: 4}}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="عنوان"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 4}}>
                  <Controller
                    name="subtitle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="زیرعنوان"
                        error={!!errors.subtitle}
                        helperText={errors.subtitle?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 4}}>
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="عنوان کلیدی"
                        error={!!errors.slug}
                        helperText={errors.slug?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 4}}>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="برند"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 4}}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="دسته‌بندی"
                        error={!!errors.category}
                        helperText={errors.category?.message}
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

                <Grid  size={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="توضیحات"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Price and Stock */}
          <Grid  size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>قیمت و موجودی</Typography>
              <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 3}}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="قیمت"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 3}}>
                  <Controller
                    name="countInStock"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="موجودی"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{xs: 12, md: 2}}>
                  <Controller
                    name="discountable.status"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="تخفیف دارد"
                      />
                    )}
                  />
                </Grid>

                {discountableStatus && (
                  <Grid justifyContent="center" size={{xs: 12, md: 3}}>
                    <Controller
                      name="discountable.percent"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="درصد تخفیف"
                          error={!!errors.discountable?.percent}
                          helperText={errors.discountable?.percent?.message}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </StyledPaper>
          </Grid>

          {/* Images */}
          <Grid size={12}>
            <StyledPaper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>تصاویر</Typography>
              <ImageUploader
                withIcon={true}
                buttonText="انتخاب تصاویر"
                onChange={(files) => setImages(files)}
                imgExtension={['.jpg', '.jpeg', '.png']}
                maxFileSize={5242880}
                withPreview={true}
              />
            </StyledPaper>
          </Grid>

          <Grid  size={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={updateProduct.isPending}
            >
                ثبت تغییرات
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditProduct;