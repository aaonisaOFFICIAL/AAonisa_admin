// src/components/GenerateReferralCode.js
import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Stack, Select, useToast } from "@chakra-ui/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "Config";

const GenerateReferralCode = () => {
  const [salesperson, setSalesperson] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [code, setCode] = useState('');
  const toast = useToast();

  const handleGenerateCode = async () => {
    try {
      await addDoc(collection(db, "referralCodes"), {
        salesperson,
        validityPeriod,
        usageLimit,
        code,
        status: "active",
        createdAt: new Date(),
      });
      toast({
        title: "Referral code generated.",
        description: `Referral code ${code} assigned to ${salesperson}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setSalesperson('');
      setValidityPeriod('');
      setUsageLimit('');
      setCode('');
    } catch (e) {
      toast({
        title: "An error occurred.",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Stack spacing={3}>
        <FormControl id="salesperson">
          <FormLabel>Salesperson</FormLabel>
          <Input value={salesperson} onChange={(e) => setSalesperson(e.target.value)} placeholder="Salesperson" />
        </FormControl>
        <FormControl id="validityPeriod">
          <FormLabel>Validity Period</FormLabel>
          <Input type="date" value={validityPeriod} onChange={(e) => setValidityPeriod(e.target.value)} />
        </FormControl>
        <FormControl id="usageLimit">
          <FormLabel>Usage Limit</FormLabel>
          <Input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Usage Limit" />
        </FormControl>
        <FormControl id="code">
          <FormLabel>Referral Code</FormLabel>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Referral Code" />
        </FormControl>
        <Button colorScheme="teal" onClick={handleGenerateCode}>Generate and Save Code</Button>
      </Stack>
    </Box>
  );
};

export default GenerateReferralCode;
