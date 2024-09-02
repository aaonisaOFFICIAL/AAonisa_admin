// components/HelpSupportAdmin.js
import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, VStack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addSupportQuery, getSupportQueries } from 'service/helpandsupport';
import ReactPaginate from 'react-paginate';

const schema = yup.object().shape({
  topic: yup.string().required('Topic is required'),
  description: yup.string().required('Description is required'),
  uid: yup.string().required('User ID is required'),
});

const HelpandSupport = () => {
  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchQueries = async () => {
      const data = await getSupportQueries();
      // Sort the data by created_at in descending order
      const sortedData = data.sort((a, b) => b.created_at.toDate() - a.created_at.toDate());

      setQueries(sortedData);
    };
    fetchQueries();
  }, []);

  const onSubmit = async (data) => {
    try {
      await addSupportQuery(data.topic, data.description, data.uid);
      reset();
      const updatedQueries = await getSupportQueries();
      const sortedUpdatedQueries = updatedQueries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setQueries(sortedUpdatedQueries);
    } catch (error) {
      console.error('Error adding support query:', error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = queries.slice(offset, offset + itemsPerPage);

  return (
    <Box marginTop="100px">
      <VStack spacing={4} mt={8}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Topic</Th>
              <Th>Description</Th>
              <Th>User ID</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentPageData.map((query) => (
              <Tr key={query.id}>
                <Td>{query.topic}</Td>
                <Td>{query.description}</Td>
                <Td>{query.uid}</Td>
                <Td>{new Date(query.created_at.toDate()).toLocaleString()}</Td> {/* Ensure the created_at field is displayed correctly */}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(queries.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </VStack>
    </Box>
  );
};

export default HelpandSupport;
