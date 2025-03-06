import { useParams } from 'react-router';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useUserById } from '../../../API/Users/users.hook';

const UserSpecific = () => {
  const { user_id } = useParams<{ user_id: string }>();
  
  const {
    data: user,
    isLoading,
    isError,
    error
  } = useUserById(user_id!);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={3}>
        <Typography color="error">
          Error loading user details: {error?.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Typography>این کاربر یافت نشد</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" p={3}>
      <Typography variant="h4" gutterBottom>
        جزئیات کاربر
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              نام
            </Typography>
            <Typography>{user.first_name}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
                نام خانوادگی
            </Typography>
            <Typography>{user.last_name}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
                ایمیل
            </Typography>
            <Typography>{user.email}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
                شماره تلفن
            </Typography>
            <Typography>{user.mobile || 'N/A'}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Role
            </Typography>
            <Typography>{user.role}</Typography>
          </Box>
          
          {/* Add more user details as needed */}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserSpecific;
