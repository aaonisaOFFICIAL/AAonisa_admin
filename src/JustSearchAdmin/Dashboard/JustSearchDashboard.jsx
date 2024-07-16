// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Button, VStack, Heading } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const DashboardJS = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    referralBusinesses: 0,
    dailyTraffic: 0,
    newSignUps: 0,
    revenueInsights: 0,
    referralPerformance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch data from Firestore and update state
      // This is a simplified example. You need to implement the logic for fetching real data.
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const businessesSnapshot = await getDocs(collection(db, 'businesses'));

      setMetrics({
        totalUsers: usersSnapshot.size,
        totalBusinesses: businessesSnapshot.size,
        referralBusinesses: 10, // Placeholder value
        dailyTraffic: 200, // Placeholder value
        newSignUps: 5, // Placeholder value
        revenueInsights: 1000, // Placeholder value
        referralPerformance: 15, // Placeholder value
      });
    };

    fetchData();
  }, []);

  return (
    <Box p={5}>
      <Heading mb={5}>Dashboard</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        <Stat>
          <StatLabel>Total Users</StatLabel>
          <StatNumber>{metrics.totalUsers}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Businesses</StatLabel>
          <StatNumber>{metrics.totalBusinesses}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Businesses Added by Referral</StatLabel>
          <StatNumber>{metrics.referralBusinesses}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Daily Traffic</StatLabel>
          <StatNumber>{metrics.dailyTraffic}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>New Sign-ups (Users and Businesses)</StatLabel>
          <StatNumber>{metrics.newSignUps}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Revenue Insights</StatLabel>
          <StatNumber>{metrics.revenueInsights}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Referral Performance Summary</StatLabel>
          <StatNumber>{metrics.referralPerformance}</StatNumber>
        </Stat>
      </SimpleGrid>
      <VStack mt={10} spacing={4} align="stretch">
        <Button colorScheme="teal">Generate New Referral Code</Button>
        <Button colorScheme="teal">Add New Business</Button>
        <Button colorScheme="teal">Add New Salesperson</Button>
        <Button colorScheme="teal">Generate Reports</Button>
        <Button colorScheme="teal">View Notifications</Button>
      </VStack>
    </Box>
  );
};

export default DashboardJS;
