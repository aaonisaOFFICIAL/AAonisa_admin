// src/components/BusinessList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, Stack } from "@chakra-ui/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "Config";

const BusinessList = ({ onSelect }) => {
  const [businesses, setBusinesses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterReferral, setFilterReferral] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      const snapshot = await getDocs(collection(db, 'businesses'));
      const businessList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(businessList);
    };

    fetchBusinesses();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'businesses', id));
    setBusinesses(businesses.filter(business => business.id !== id));
  };

  const filteredBusinesses = businesses.filter(business => {
    return (
      business.name.toLowerCase().includes(search.toLowerCase()) &&
      (!filterCategory || business.category === filterCategory) &&
      (!filterLocation || business.location === filterLocation) &&
      (!filterReferral || business.referralCode === filterReferral)
    );
  });

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack spacing={3} mb={5}>
        <Input placeholder="Search by business name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select placeholder="Filter by category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {/* Assuming categories are predefined */}
          <option value="Restaurant">Restaurant</option>
          <option value="Retail">Retail</option>
          <option value="Service">Service</option>
        </Select>
        <Input placeholder="Filter by location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
        <Input placeholder="Filter by referral code" value={filterReferral} onChange={(e) => setFilterReferral(e.target.value)} />
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Business Name</Th>
            <Th>Category</Th>
            <Th>Location</Th>
            <Th>Referral Code</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredBusinesses.map(business => (
            <Tr key={business.id}>
              <Td>{business.name}</Td>
              <Td>{business.category}</Td>
              <Td>{business.location}</Td>
              <Td>{business.referralCode}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => onSelect(business)}>View</Button>
                <Button size="sm" colorScheme="yellow" mr={2}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(business.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BusinessList;
