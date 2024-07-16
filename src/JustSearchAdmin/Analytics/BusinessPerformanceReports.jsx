// src/components/BusinessPerformanceReports.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Select, Heading, Button } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const BusinessPerformanceReports = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const snapshot = await getDocs(collection(db, 'businesses'));
      setBusinesses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchBusinesses();
  }, []);

  const generateReport = async () => {
    if (!selectedBusiness) return;
    const snapshot = await getDocs(collection(db, `businesses/${selectedBusiness}/performance`));
    setReport(snapshot.docs.map(doc => doc.data()));
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Business Performance Reports</Heading>
      <Select
        placeholder="Select Business"
        value={selectedBusiness}
        onChange={(e) => setSelectedBusiness(e.target.value)}
        mb={5}
      >
        {businesses.map(business => (
          <option key={business.id} value={business.id}>{business.name}</option>
        ))}
      </Select>
      <Button colorScheme="blue" onClick={generateReport} mb={5}>Generate Report</Button>
      {report.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Value</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {report.map((metric, index) => (
              <Tr key={index}>
                <Td>{metric.name}</Td>
                <Td>{metric.value}</Td>
                <Td>{metric.date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default BusinessPerformanceReports;
