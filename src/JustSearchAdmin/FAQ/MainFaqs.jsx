// src/App.js
import React from 'react';
import { ChakraProvider, Box, Heading, Grid, GridItem } from "@chakra-ui/react";
import FAQs from './FAQs';
import SupportTickets from './SupportTickets';

function MainFaqs() {
  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={5}>Help and Support</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <FAQs />
          </GridItem>
          <GridItem colSpan={1}>
            <SupportTickets />
          </GridItem>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default MainFaqs;
