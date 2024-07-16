// src/components/BusinessSettings.js
import React from 'react';
import { Box, Heading, Input, Stack, Button } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "Config";

const BusinessSettings = ({ settings }) => {
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'settings', 'business');
      await updateDoc(docRef, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update 'settings' state or object with business settings data
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Business Settings</Heading>
      <Stack spacing={3}>
        {/* Example fields for business settings */}
        <Input
          name="categories"
          value={settings.categories}
          onChange={handleChange}
          placeholder="Business Categories"
        />
        {/* Add more fields as needed */}
        <Button colorScheme="blue" onClick={handleSave}>Save Settings</Button>
      </Stack>
    </Box>
  );
};

export default BusinessSettings;
