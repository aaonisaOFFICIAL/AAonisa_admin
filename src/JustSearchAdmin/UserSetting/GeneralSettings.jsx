// src/components/GeneralSettings.js
import React from 'react';
import { Box, Heading, Input, Stack, Button } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "Config";

const GeneralSettings = ({ settings }) => {
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      await updateDoc(docRef, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Assuming 'settings' is an object where we update individual fields
    // Example: const [settings, setSettings] = useState({ siteName: '', logo: '', contact: '' });
    // setSettings({ ...settings, [name]: value });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>General Settings</Heading>
      <Stack spacing={3}>
        <Input
          name="siteName"
          value={settings.siteName}
          onChange={handleChange}
          placeholder="Site Name"
        />
        <Input
          name="logo"
          value={settings.logo}
          onChange={handleChange}
          placeholder="Logo URL"
        />
        <Input
          name="contact"
          value={settings.contact}
          onChange={handleChange}
          placeholder="Contact Information"
        />
        <Button colorScheme="blue" onClick={handleSave}>Save Settings</Button>
      </Stack>
    </Box>
  );
};

export default GeneralSettings;
