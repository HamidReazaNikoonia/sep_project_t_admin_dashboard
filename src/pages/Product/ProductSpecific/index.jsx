import {
  Box,
  Typography,
  Grid2 as Grid,
  CircularProgress,
  Switch,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import {
  useProduct,
  useUpdateProduct,
} from '../../../API/Products/products.hook'
import StyledPaper from '../../../components/StyledPaper'
import { showToast } from '../../../utils/toast'

const label = { inputProps: { 'aria-label': 'SwitchProduct Status' } }

const ProductSpecific = () => {
  const [checked, setChecked] = useState(false)

  const { product_id } = useParams()

  const {
    data,
    isLoading,
    isError,
    error,
    // eslint-disable-next-line prettier/prettier
  } = useProduct(product_id);

  // Initialize the mutation hook
  // eslint-disable-next-line prettier/prettier
  const updateProduct = useUpdateProduct(product_id);

  const handleChange = async (event) => {
    const newStatus = event.target.checked
    setChecked(newStatus)

    try {
      await updateProduct.mutateAsync({
        status: newStatus ? 'publish' : 'draft',
      })

      showToast('بروزرسانی موفق', 'وضعیت محصول با موفقیت تغییر کرد', 'success')
    } catch (error) {
      setChecked(!newStatus)

      showToast('خطا', 'خطا در بروزرسانی وضعیت محصول', 'error')
      console.error('Error updating product status:', error)
    }
  }

  useEffect(() => {
    if (data?.data?.products[0]) {
      setChecked(data?.data?.products[0].status === 'publish')
    }
  }, [data])

  const product = data?.data?.products[0]

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p={3}>
        <Typography color="error">
          Error loading product details: {error?.message || 'Unknown error'}
        </Typography>
      </Box>
    )
  }

  if (!product) {
    return (
      <Box p={3}>
        <Typography>محصول یافت نشد</Typography>
      </Box>
    )
  }

  return (
    <Box dir="rtl" p={3}>
      <Typography className="text-right pb-4" variant="h4" gutterBottom>
        جزئیات محصول
      </Typography>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <StyledPaper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              اطلاعات اصلی
            </Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    عنوان
                  </Typography>
                  <Typography>{product.title}</Typography>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    زیرعنوان
                  </Typography>
                  <Typography>{product.subtitle}</Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    برند
                  </Typography>
                  <Typography>{product.brand}</Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    دسته‌بندی
                  </Typography>
                  <Typography>
                    {product?.category?.name && product.category.name}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Price and Discount */}
        <Grid item size={{ xs: 12, md: 3 }}>
          <StyledPaper sx={{ p: 3, minHeight: { xs: 'auto', md: '256px' } }}>
            <Typography variant="h6" gutterBottom>
              قیمت و تخفیف
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle2" color="textSecondary">
                قیمت
              </Typography>
              <Typography>{product.price.toLocaleString()} تومان</Typography>
            </Box>
            {product.discountable.status && (
              <Box mt={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  تخفیف
                </Typography>
                <Typography>{product.discountable.percent}%</Typography>
                <Typography variant="subtitle2" color="textSecondary" mt={1}>
                  قیمت با تخفیف
                </Typography>
                <Typography>
                  {(
                    product.price *
                    (1 - product.discountable.percent / 100)
                  ).toLocaleString()}{' '}
                  تومان
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* QR Code */}
        <Grid size={{ xs: 12, md: 3 }}>
          <StyledPaper sx={{ p: 3, minHeight: { xs: 'auto', md: '256px' } }}>
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="h6" gutterBottom>
                  موجودی
                </Typography>
                <Typography color="gray" fontWeight={800}>
                  {product.countInStock || 'موجودی موجود نیست'}
                </Typography>
              </div>

              {/* Status */}
              <div className="flex justify-between gap-2">
                <Typography variant="h6" gutterBottom>
                  وضعیت
                </Typography>
                <div className="flex items-center gap-2">
                  <div className="text-sm">{checked ? 'فعال' : 'غیر فعال'}</div>
                  <Switch
                    {...label}
                    size="large"
                    color="warning"
                    checked={checked}
                    onChange={handleChange}
                    disabled={updateProduct.isPending}
                  />
                </div>
              </div>
            </div>
          </StyledPaper>
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <StyledPaper minHeight="256px" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              توضیحات
            </Typography>
            <Typography style={{ whiteSpace: 'pre-wrap' }}>
              {product.description}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Images */}
        <Grid item xs={12}>
          <StyledPaper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              تصاویر
            </Typography>
            <Grid container spacing={2}>
              {product.images.map((imageId, index) => (
                <Grid item key={imageId} xs={12} sm={6} md={4} lg={3}>
                  <Box
                    component="img"
                    src={`/api/images/${imageId}`} // Adjust the image URL according to your API
                    alt={`Product image ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductSpecific
