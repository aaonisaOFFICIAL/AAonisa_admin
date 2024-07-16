// src/components/ReferralCodeReports.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Select, Heading, Button } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const ReferralCodeReports = () => {
  const [referralCodes, setReferralCodes] = useState([]);
  const [selectedReferralCode, setSelectedReferralCode] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReferralCodes = async () => {
      const snapshot = await getDocs(collection(db, 'referralCodes'));
      setReferralCodes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchReferralCodes();
  }, []);

  const generateReport = async () => {
    if (!selectedReferralCode) return;
    const snapshot = await getDocs(collection(db, `referralCodes/${selectedReferralCode}/usage`));
    setReport(snapshot.docs.map(doc => doc.data()));
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Referral Code Reports</Heading>
      <Select
        placeholder="Select Referral Code"
        value={selectedReferralCode}
        onChange={(e) => setSelectedReferralCode(e.target.value)}
        mb={5}
      >
        {referralCodes.map(referralCode => (
          <option key={referralCode.id} value={referralCode.id}>{referralCode.code}</option>
        ))}
      </Select>
      <Button colorScheme="blue" onClick={generateReport} mb={5}>Generate Report</Button>
      {report.length > 0 && (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Business</Th>
              <Th>Usage Count</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {report.map((usage, index) => (
              <Tr key={index}>
                <Td>{usage.business}</Td>
                <Td>{usage.count}</Td>
                <Td>{usage.date}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ReferralCodeReports;
