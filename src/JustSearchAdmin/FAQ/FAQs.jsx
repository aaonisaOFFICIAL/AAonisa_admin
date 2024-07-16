// src/components/FAQs.js
import React, { useEffect, useState } from 'react';
import { Box, Heading, Input, Stack, Button, Textarea, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "Config";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      const snapshot = await getDocs(collection(db, 'faqs'));
      setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchFAQs();
  }, []);

  const handleSave = async () => {
    if (editingFaq) {
      const faqRef = doc(db, 'faqs', editingFaq.id);
      await updateDoc(faqRef, { question, answer });
      setEditingFaq(null);
    } else {
      await addDoc(collection(db, 'faqs'), { question, answer });
    }
    setQuestion('');
    setAnswer('');
    const snapshot = await getDocs(collection(db, 'faqs'));
    setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingFaq(faq);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'faqs', id));
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={5}>Manage FAQs</Heading>
      <Stack spacing={3} mb={5}>
        <Input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Textarea
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSave}>
          {editingFaq ? 'Update FAQ' : 'Add FAQ'}
        </Button>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Question</Th>
            <Th>Answer</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {faqs.map(faq => (
            <Tr key={faq.id}>
              <Td>{faq.question}</Td>
              <Td>{faq.answer}</Td>
              <Td>
                <Button colorScheme="green" onClick={() => handleEdit(faq)}>Edit</Button>
                <Button colorScheme="red" ml={2} onClick={() => handleDelete(faq.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default FAQs;
