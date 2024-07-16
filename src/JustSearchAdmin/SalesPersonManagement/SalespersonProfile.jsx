// src/components/SalespersonProfile.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Table, Thead, Tbody, Tr, Th, Td, Button, Select } from "@chakra-ui/react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "Config";

const SalespersonProfile = ({ salesperson }) => {
  const [businesses, setBusinesses] = useState([]);
  const [referralCodes, setReferralCodes] = useState([]);
  const [status, setStatus] = useState(salesperson.status);
  const [region, setRegion] = useState(salesperson.region);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const snapshot = await getDocs(collection(db, `salespersons/${salesperson.id}/businesses`));
      setBusinesses(snapshot.docs.map(doc => doc.data()));
    };

    const fetchReferralCodes = async () => {
      const snapshot = await getDocs(collection(db, `salespersons/${salesperson.id}/referralCodes`));
      setReferralCodes(snapshot.docs.map(doc => doc.data()));
    };

    fetchBusinesses();
    fetchReferralCodes();
  }, [salesperson.id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateDoc(doc(db, 'salespersons', salesperson.id), { status: newStatus });
  };

  const handleRegionChange = async (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    await updateDoc(doc(db, 'salespersons', salesperson.id), { region: newRegion });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>{salesperson.name}'s Profile</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px" mb={5}>
        <Stat>
          <StatLabel>Contact</StatLabel>
          <StatNumber>{salesperson.contact}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Region</StatLabel>
          <StatNumber>{region}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Status</StatLabel>
          <Select value={status} onChange={handleStatusChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Stat>
      </SimpleGrid>
      <Heading size="md" mb={3}>Businesses Listed</Heading>
      <Table variant="simple" mb={5}>
        <Thead>
          <Tr>
            <Th>Business Name</Th>
            <Th>Added Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {businesses.map((business, index) => (
            <Tr key={index}>
              <Td>{business.name}</Td>
              <Td>{new Date(business.addedDate.seconds * 1000).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Heading size="md" mb={3}>Referral Codes</Heading>
      <Table variant="simple" mb={5}>
        <Thead>
          <Tr>
            <Th>Code</Th>
            <Th>Performance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {referralCodes.map((code, index) => (
            <Tr key={index}>
              <Td>{code.code}</Td>
              <Td>{code.performance}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalespersonProfile;
