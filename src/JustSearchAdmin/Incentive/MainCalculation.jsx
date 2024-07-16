// src/App.js
import React from 'react';
import { ChakraProvider, Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import IncentiveCalculation from './IncentiveCalculation';
import SalaryManagement from './SalaryManagement';

function MainCalculation() {
  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Incentive and Salary Management</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Incentive Calculation</Tab>
            <Tab>Salary Management</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <IncentiveCalculation />
            </TabPanel>
            <TabPanel>
              <SalaryManagement />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default MainCalculation;
