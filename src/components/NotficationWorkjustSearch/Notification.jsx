// Example usage in your AdminPanel.jsx
import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import NotificationCreateForm from './ NotificationCreateForm';
import NotificationHistory from './NotificationHistory';

const Notification = () => {
  return (
    <Box p={4}>
      <Heading size="lg">Admin Panel</Heading>
      <Stack spacing={8} mt={8}>
        <NotificationCreateForm />
        <NotificationHistory />
        {/* Other sections like User Management, Business Management, Reports, etc. */}
      </Stack>
    </Box>
  );
};

export default Notification;
