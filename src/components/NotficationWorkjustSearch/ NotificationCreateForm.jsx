// NotificationCreateForm.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Select, Stack } from '@chakra-ui/react';

const NotificationCreateForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle submission logic (e.g., send notification to Firebase)
    console.log(data);
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={errors.title}>
            <FormLabel htmlFor="title">Notification Title</FormLabel>
            <Input id="title" placeholder="Enter notification title" {...register('title', { required: 'Title is required' })} />
            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.message}>
            <FormLabel htmlFor="message">Notification Message</FormLabel>
            <Input id="message" placeholder="Enter notification message" {...register('message', { required: 'Message is required' })} />
            <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.targetAudience}>
            <FormLabel htmlFor="targetAudience">Target Audience</FormLabel>
            <Select id="targetAudience" placeholder="Select target audience" {...register('targetAudience', { required: 'Target audience is required' })}>
              <option value="users">Users</option>
              <option value="businessOwners">Business Owners</option>
            </Select>
            <FormErrorMessage>{errors.targetAudience && errors.targetAudience.message}</FormErrorMessage>
          </FormControl>

          {/* Additional fields for scheduling options can be added here */}

          <Button type="submit" colorScheme="blue" mt={4}>Create Notification</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default NotificationCreateForm;
