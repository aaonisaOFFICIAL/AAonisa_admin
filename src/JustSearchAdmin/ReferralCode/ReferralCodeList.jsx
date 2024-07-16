// src/components/ReferralCodeList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, Stack } from "@chakra-ui/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "Config";

const ReferralCodeList = () => {
  const [referralCodes, setReferralCodes] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchReferralCodes = async () => {
      const snapshot = await getDocs(collection(db, 'referralCodes'));
      const codes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReferralCodes(codes);
    };

    fetchReferralCodes();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'referralCodes', id));
    setReferralCodes(referralCodes.filter(code => code.id !== id));
  };

  const filteredCodes = referralCodes.filter(code => {
    return code.salesperson.toLowerCase().includes(search.toLowerCase()) && (!filter || code.status === filter);
  });

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack spacing={3} mb={5}>
        <Input placeholder="Search by salesperson" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select placeholder="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Referral Code</Th>
            <Th>Salesperson</Th>
            <Th>Businesses Added</Th>
            <Th>Expiration Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCodes.map(code => (
            <Tr key={code.id}>
              <Td>{code.code}</Td>
              <Td>{code.salesperson}</Td>
              <Td>{code.businessesAdded || 0}</Td>
              <Td>{code.validityPeriod}</Td>
              <Td>{code.status}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2}>View</Button>
                <Button size="sm" colorScheme="yellow" mr={2}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(code.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ReferralCodeList;
