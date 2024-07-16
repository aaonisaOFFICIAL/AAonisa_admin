// src/App.js
import React from 'react';
import { ChakraProvider, Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import GenerateReferralCode from './GenerateReferralCode';
import ReferralCodeList from './ReferralCodeList';
import ReferralCodeAnalytics from './ReferralCodeAnalytics';

function MainReferal() {
  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Referral Code Management</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Generate Code</Tab>
            <Tab>Code List</Tab>
            <Tab>Analytics</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <GenerateReferralCode />
            </TabPanel>
            <TabPanel>
              <ReferralCodeList />
            </TabPanel>
            <TabPanel>
              <ReferralCodeAnalytics />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default MainReferal;
