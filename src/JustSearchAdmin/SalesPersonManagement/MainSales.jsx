// src/App.js
import React, { useState } from 'react';
import { ChakraProvider, Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SalespersonList from './SalespersonList';
import SalespersonProfile from './SalespersonProfile';

function MainSales() {
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);

  const handleSelectSalesperson = (salesperson) => {
    setSelectedSalesperson(salesperson);
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Salesperson Management</Heading>
        <Tabs variant="enclosed">
          <TabList>
            <Tab onClick={() => setSelectedSalesperson(null)}>Salesperson List</Tab>
            {selectedSalesperson && <Tab>Profile</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <SalespersonList onSelect={handleSelectSalesperson} />
            </TabPanel>
            {selectedSalesperson && (
              <TabPanel>
                <SalespersonProfile salesperson={selectedSalesperson} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default MainSales;
