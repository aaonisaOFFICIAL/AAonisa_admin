// src/components/SalaryManagement.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Stat, StatLabel, StatNumber, Heading } from "@chakra-ui/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "Config";

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);

  useEffect(() => {
    const fetchSalaries = async () => {
      const snapshot = await getDocs(collection(db, 'salespersons'));
      const salaryList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSalaries(salaryList);
    };

    fetchSalaries();
  }, []);

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Salary Management</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Salesperson</Th>
            <Th>Base Salary</Th>
            <Th>Bonuses</Th>
            <Th>Total Payment</Th>
            <Th>Payment History</Th>
          </Tr>
        </Thead>
        <Tbody>
          {salaries.map(salary => (
            <Tr key={salary.id}>
              <Td>{salary.name}</Td>
              <Td>${salary.baseSalary.toFixed(2)}</Td>
              <Td>${salary.bonuses.toFixed(2)}</Td>
              <Td>${(salary.baseSalary + salary.bonuses).toFixed(2)}</Td>
              <Td>{/* Payment history implementation here */}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default SalaryManagement;
