// src/components/SupportTickets.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Select } from "@chakra-ui/react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "Config";

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const snapshot = await getDocs(collection(db, 'supportTickets'));
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchAgents = async () => {
      const snapshot = await getDocs(collection(db, 'supportAgents'));
      setAgents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchTickets();
    fetchAgents();
  }, []);

  const handleAssignAgent = async () => {
    if (selectedTicket && assignedAgent) {
      const ticketRef = doc(db, 'supportTickets', selectedTicket.id);
      await updateDoc(ticketRef, { assignedAgent });
      setSelectedTicket(null);
      setAssignedAgent('');
      const snapshot = await getDocs(collection(db, 'supportTickets'));
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Support Tickets</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Subject</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Assigned Agent</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickets.map(ticket => (
            <Tr key={ticket.id}>
              <Td>{ticket.subject}</Td>
              <Td>{ticket.description}</Td>
              <Td>{ticket.status}</Td>
              <Td>{ticket.assignedAgent || 'Unassigned'}</Td>
              <Td>
                <Button colorScheme="green" onClick={() => setSelectedTicket(ticket)}>Assign Agent</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedTicket && (
        <Box mt={5}>
          <Heading size="md">Assign Agent to Ticket</Heading>
          <Select
            placeholder="Select agent"
            value={assignedAgent}
            onChange={(e) => setAssignedAgent(e.target.value)}
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.name}>{agent.name}</option>
            ))}
          </Select>
          <Button mt={3} colorScheme="blue" onClick={handleAssignAgent}>Assign</Button>
        </Box>
      )}
    </Box>
  );
};

export default SupportTickets;
