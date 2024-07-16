// src/components/IncentiveCalculation.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Stat, StatLabel, StatNumber, Heading } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const IncentiveCalculation = () => {
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    const fetchIncentives = async () => {
      const snapshot = await getDocs(collection(db, 'salespersons'));
      const incentiveList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        totalIncentives: doc.data().performance * 0.1, // Assuming 10% incentive on performance
      }));
      setIncentives(incentiveList);
    };

    fetchIncentives();
  }, []);

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Incentive Calculation</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Salesperson</Th>
            <Th>Performance</Th>
            <Th>Total Incentives</Th>
          </Tr>
        </Thead>
        <Tbody>
          {incentives.map(incentive => (
            <Tr key={incentive.id}>
              <Td>{incentive.name}</Td>
              <Td>{incentive.performance}</Td>
              <Td>${incentive.totalIncentives.toFixed(2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default IncentiveCalculation;
