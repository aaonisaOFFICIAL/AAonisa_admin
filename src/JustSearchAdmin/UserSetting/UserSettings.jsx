// src/components/UserSettings.js
import React from 'react';
import { Box, Heading, Input, Stack, Button } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "Config";

const UserSettings = ({ settings }) => {
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'settings', 'user');
      await updateDoc(docRef, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update 'settings' state or object with user settings data
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>User Settings</Heading>
      <Stack spacing={3}>
        {/* Example fields for user settings */}
        <Input
          name="roles"
          value={settings.roles}
          onChange={handleChange}
          placeholder="User Roles"
        />
        <Input
          name="permissions"
          value={settings.permissions}
          onChange={handleChange}
          placeholder="User Permissions"
        />
        <Button colorScheme="blue" onClick={handleSave}>Save Settings</Button>
      </Stack>
    </Box>
  );
};

export default UserSettings;
