// src/components/CreateNotification.js
import React, { useState } from 'react';
import { Box, Heading, Input, Stack, Button, Select, Textarea } from "@chakra-ui/react";
import { collection, addDoc ,Timestamp} from "firebase/firestore";
import { JSdb } from "JSConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreateNotification = ({ onNotificationCreated }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');


  const handleSave = async () => {
    try {
      if (!message) {
        toast.dismiss()
        toast.dismiss()
        toast.error("Please enter a message before creating the notification.", {
          // position: "top-right",
          title: "Message Required",
   
            status: "warning",
            duration: 5000,
            isClosable: true,
        });
        return; // Prevent further execution if message is empty
      }

      const scheduleTimestamp = scheduleDate ? Timestamp.fromDate(new Date(scheduleDate)) : null;
      const newNotification = {
        title,
        message,
        targetAudience,
        scheduleDate: scheduleTimestamp,
        status: scheduleTimestamp ? 'scheduled' : 'sent',
        createdAt: Timestamp.now()
      };
      await addDoc(collection(JSdb, 'notifications'), newNotification);
      toast.dismiss()
      toast.success("Your notification has been successfully added.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTitle('');
      setMessage('');
      setTargetAudience('');
      setScheduleDate('');
      onNotificationCreated();
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification. Please try again.');
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
            <ToastContainer />
      <Heading mb={5}>Create Notification</Heading>
      <Stack spacing={3}>
        <Input
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Select
          placeholder="Select Target Audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
        >
          <option value="users">Users</option>
          <option value="businessOwners">Business Owners</option>
        </Select>
        <Input
          type="datetime-local"
          placeholder="Schedule Date"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSave}>Create Notification</Button>
      </Stack>
    </Box>
  );
};

export default CreateNotification;
