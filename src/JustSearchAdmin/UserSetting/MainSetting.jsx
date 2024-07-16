// src/App.js
import React from 'react';
import { ChakraProvider, Box, Heading, Grid, GridItem } from "@chakra-ui/react";
import GeneralSettings from './GeneralSettings';
import UserSettings from './UserSettings';
import BusinessSettings from './BusinessSettings';
import { useState } from 'react';

function MainSetting() {
  // Example state for settings, you can replace this with actual data fetching and state management
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      logo: '',
      contact: ''
    },
    user: {
      roles: '',
      permissions: ''
    },
    business: {
      categories: ''
    }
  });

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Settings</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <GeneralSettings settings={settings.general} />
          </GridItem>
          <GridItem colSpan={1}>
            <UserSettings settings={settings.user} />
          </GridItem>
          <GridItem colSpan={1}>
            <BusinessSettings settings={settings.business} />
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default MainSetting;
