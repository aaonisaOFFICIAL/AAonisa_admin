// src/components/BusinessProfile.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Table, Thead, Tbody, Tr, Th, Td, Button, Select, Textarea } from "@chakra-ui/react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "Config";

const BusinessProfile = ({ business }) => {
  const [reviews, setReviews] = useState([]);
  const [salesperson, setSalesperson] = useState({});
  const [status, setStatus] = useState(business.status);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, `businesses/${business.id}/reviews`));
      setReviews(snapshot.docs.map(doc => doc.data()));
    };

    const fetchSalesperson = async () => {
      const docSnap = await getDocs(doc(db, `salespersons/${business.salespersonId}`));
      if (docSnap.exists()) {
        setSalesperson(docSnap.data());
      }
    };

    fetchReviews();
    fetchSalesperson();
  }, [business.id, business.salespersonId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateDoc(doc(db, 'businesses', business.id), { status: newStatus });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>{business.name}'s Profile</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px" mb={5}>
        <Stat>
          <StatLabel>Contact</StatLabel>
          <StatNumber>{business.contact}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Category</StatLabel>
          <StatNumber>{business.category}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Location</StatLabel>
          <StatNumber>{business.location}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Status</StatLabel>
          <Select value={status} onChange={handleStatusChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </Stat>
      </SimpleGrid>
      <Heading size="md" mb={3}>Business Details</Heading>
      <Textarea value={business.details} isReadOnly mb={5} />
      <Heading size="md" mb={3}>Assigned Salesperson</Heading>
      <SimpleGrid columns={[1, 2]} spacing="40px" mb={5}>
        <Stat>
          <StatLabel>Name</StatLabel>
          <StatNumber>{salesperson.name}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Contact</StatLabel>
          <StatNumber>{salesperson.contact}</StatNumber>
        </Stat>
      </SimpleGrid>
      <Heading size="md" mb={3}>User Reviews</Heading>
      <Table variant="simple" mb={5}>
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Review</Th>
            <Th>Rating</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviews.map((review, index) => (
            <Tr key={index}>
              <Td>{review.user}</Td>
              <Td>{review.text}</Td>
              <Td>{review.rating}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BusinessProfile;
