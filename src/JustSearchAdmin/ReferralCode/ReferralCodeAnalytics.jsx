// src/components/ReferralCodeAnalytics.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ReferralCodeAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsage: 0,
    mostEffectiveCode: '',
    mostEffectiveSalesperson: '',
    performanceTrends: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      const snapshot = await getDocs(collection(db, 'referralCodes'));
      const codes = snapshot.docs.map(doc => doc.data());

      // Placeholder logic for analytics
      const totalUsage = codes.reduce((sum, code) => sum + (code.usageCount || 0), 0);
      const mostEffectiveCode = codes.reduce((max, code) => (code.usageCount > (max.usageCount || 0) ? code : max), {}).code;
      const mostEffectiveSalesperson = codes.reduce((max, code) => (code.usageCount > (max.usageCount || 0) ? code : max), {}).salesperson;
      const performanceTrends = codes.map(code => ({ code: code.code, usage: code.usageCount || 0 }));

      setAnalytics({
        totalUsage,
        mostEffectiveCode,
        mostEffectiveSalesperson,
        performanceTrends,
      });
    };

    fetchAnalytics();
  }, []);

  const data = {
    labels: analytics.performanceTrends.map(trend => trend.code),
    datasets: [{
      label: 'Usage Count',
      data: analytics.performanceTrends.map(trend => trend.usage),
      fill: false,
      backgroundColor: 'blue',
      borderColor: 'blue',
    }],
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Referral Code Analytics</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px" mb={5}>
        <Stat>
          <StatLabel>Total Usage</StatLabel>
          <StatNumber>{analytics.totalUsage}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Most Effective Code</StatLabel>
          <StatNumber>{analytics.mostEffectiveCode}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Most Effective Salesperson</StatLabel>
          <StatNumber>{analytics.mostEffectiveSalesperson}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Box>
        <Line data={data} />
      </Box>
    </Box>
  );
};

export default ReferralCodeAnalytics;
