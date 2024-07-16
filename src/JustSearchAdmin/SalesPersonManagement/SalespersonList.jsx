// src/components/SalespersonList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, Stack } from "@chakra-ui/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "Config";

const SalespersonList = ({ onSelect }) => {
  const [salespersons, setSalespersons] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchSalespersons = async () => {
      const snapshot = await getDocs(collection(db, 'salespersons'));
      const salespersonsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSalespersons(salespersonsList);
    };

    fetchSalespersons();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'salespersons', id));
    setSalespersons(salespersons.filter(person => person.id !== id));
  };

  const filteredSalespersons = salespersons.filter(person => {
    return person.name.toLowerCase().includes(search.toLowerCase()) && (!filter || person.region === filter);
  });

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack spacing={3} mb={5}>
        <Input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select placeholder="Filter by region" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {/* Assuming regions are predefined */}
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </Select>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Region</Th>
            <Th>Performance</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredSalespersons.map(person => (
            <Tr key={person.id}>
              <Td>{person.name}</Td>
              <Td>{person.region}</Td>
              <Td>{person.performance}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => onSelect(person)}>View</Button>
                <Button size="sm" colorScheme="yellow" mr={2}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(person.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalespersonList;
