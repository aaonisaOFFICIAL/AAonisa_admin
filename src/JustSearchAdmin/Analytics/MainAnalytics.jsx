// src/App.js
import React from 'react';
import { ChakraProvider, Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SalespersonPerformanceReports from './SalespersonPerformanceReports';
import BusinessPerformanceReports from './BusinessPerformanceReports';
import ReferralCodeReports from './ReferralCodeReports';

function MainAnalytics() {
  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Analytics and Reports</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Salesperson Performance Reports</Tab>
            <Tab>Business Performance Reports</Tab>
            <Tab>Referral Code Reports</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SalespersonPerformanceReports />
            </TabPanel>
            <TabPanel>
              <BusinessPerformanceReports />
            </TabPanel>
            <TabPanel>
              <ReferralCodeReports />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default MainAnalytics;
