// src/components/SalespersonPerformanceReports.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Select, Heading, Button } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const SalespersonPerformanceReports = () => {
  const [salespersons, setSalespersons] = useState([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchSalespersons = async () => {
      const snapshot = await getDocs(collection(db, 'salespersons'));
      setSalespersons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchSalespersons();
  }, []);

  const generateReport = async () => {
    if (!selectedSalesperson) return;
    const snapshot = await getDocs(collection(db, `salespersons/${selectedSalesperson}/activities`));
    setReport(snapshot.docs.map(doc => doc.data()));
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Salesperson Performance Reports</Heading>
      <Select
        placeholder="Select Salesperson"
        value={selectedSalesperson}
        onChange={(e) => setSelectedSalesperson(e.target.value)}
        mb={5}
      >
        {salespersons.map(salesperson => (
          <option key={salesperson.id} value={salesperson.id}>{salesperson.name}</option>
        ))}
      </Select>
      <Button colorScheme="blue" onClick={generateReport} mb={5}>Generate Report</Button>
      {report.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Activity</Th>
              <Th>Date</Th>
              <Th>Incentives Earned</Th>
            </Tr>
          </Thead>
          <Tbody>
            {report.map((activity, index) => (
              <Tr key={index}>
                <Td>{activity.activity}</Td>
                <Td>{activity.date}</Td>
                <Td>${activity.incentivesEarned.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default SalespersonPerformanceReports;
