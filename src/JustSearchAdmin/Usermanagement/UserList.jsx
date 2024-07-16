// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Input, Button, Stack } from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "Config";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(user => user?.name?.includes(search) || user?.email?.includes(search)));
  }, [search, users]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack direction="row" mb={5}>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
        />
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Registration Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map(user => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{new Date(user.registrationDate).toLocaleDateString()}</Td>
              <Td>
                <Button colorScheme="blue" onClick={() => onSelectUser(user)}>View</Button>
                <Button colorScheme="green" ml={2}>Edit</Button>
                <Button colorScheme="red" ml={2}>Deactivate</Button>
                <Button colorScheme="red" ml={2}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
