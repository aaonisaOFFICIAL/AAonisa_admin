// src/App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import BusinessList from './BusinessList';
import BusinessProfile from './BusinessProfile';

function MainBusiness() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Business Management</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab onClick={() => setSelectedBusiness(null)}>Business List</Tab>
            {selectedBusiness && <Tab>Profile</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <BusinessList onSelect={handleSelectBusiness} />
            </TabPanel>
            {selectedBusiness && (
              <TabPanel>
                <BusinessProfile business={selectedBusiness} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default MainBusiness;
