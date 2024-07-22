import React, { useEffect, useState } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, HStack } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';
import ReactPaginate from 'react-paginate';

const SalesmanScreen = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [referId, setReferId] = useState('');
  const [paidUsers, setPaidUsers] = useState(0);
  const [freeUsers, setFreeUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const fetchData = async () => {
    const usersCollection = collection(db, 'users'); // Adjust collection name as needed
    const usersSnapshot = await getDocs(usersCollection);
    const usersData = usersSnapshot.docs.map(doc => doc.data());
    setData(usersData);
    setOriginalData(usersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!referId) {
      setData(originalData);
      setPaidUsers(0);
      setFreeUsers(0);
      return;
    }
    const usersCollection = collection(db, 'users');
    const referQuery = query(usersCollection, where('referId', '==', referId));
    const usersSnapshot = await getDocs(referQuery);
    const usersData = usersSnapshot.docs.map(doc => doc.data());

    setPaidUsers(usersData.filter(user => user.plan === 'Paid').length);
    setFreeUsers(usersData.filter(user => user.plan === 'Free').length);

    setData(usersData);
    setCurrentPage(0);
  };

  const columns = React.useMemo(
    () => [
      { Header: 'S.No', accessor: 'sno', Cell: ({ row }) => row.index + 1 },
      { Header: 'Username', accessor: 'username' },
      { Header: 'refer id', accessor: 'userdfname' },
      { Header: 'Mobile No.', accessor: 'contactNumber' },
      { Header: 'Plan (Free/Paid)', accessor: 'plan' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const paginatedData = rows.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <Box p={4}>
      <Heading mb={4}>Salesman Screen</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="Search by Refer ID"
            value={referId}
            onChange={(e) => setReferId(e.target.value)}
            onKeyUp={(e) => {
              if (e.target.value === '') {
                setData(originalData);
                setPaidUsers(0);
                setFreeUsers(0);
              }
            }}
          />
          <Button mt={2} onClick={handleSearch}>Search</Button>
        </Box>
        <HStack spacing={4} justify="space-between" mb={4}>
          <Box border="1px" borderRadius="md" p={4} w="50%">
            <Text fontWeight="bold">No. of Paid Users</Text>
            <Text>{paidUsers}</Text>
          </Box>
          <Box border="1px" borderRadius="md" p={4} w="50%">
            <Text fontWeight="bold">No. of Free Users</Text>
            <Text>{freeUsers}</Text>
          </Box>
        </HStack>
        <Table {...getTableProps()} variant="striped" colorScheme="teal">
          <Thead>
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {paginatedData.map(row => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(rows.length / itemsPerPage)}
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

export default SalesmanScreen;
