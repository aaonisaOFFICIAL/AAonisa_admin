import React, { useEffect, useState, useMemo } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading } from '@chakra-ui/react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import ReactPaginate from 'react-paginate';

const PaymentDetails = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [originalData, setOriginalData] = useState([]);

  const fetchData = async () => {
    const usersCollection = collection(db, 'payments'); // Adjust collection name as needed
    const usersSnapshot = await getDocs(usersCollection);
    const paymentData = usersSnapshot.docs.map(doc => doc.data());
    setData(paymentData);
    setOriginalData(paymentData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search === '') {
      setData(originalData);
    }
  }, [search, originalData]);

  const handleSearch = () => {
    const filteredData = originalData.filter(user => user?.mobile?.includes(search));
    setData(filteredData);
  };

  const columns = useMemo(() => [
    { Header: 'S.No', accessor: 'sno', Cell: ({ row }) => row.index + 1 },
    { Header: 'Username', accessor: 'username' },
   { Header: 'Mobile Number', accessor: 'mobileNumber' },    // contactNumber to mobileNumber
    { Header: 'Rank', accessor: 'rank' },
    { Header: 'Plan', accessor: 'plan' },
    { Header: 'No. of Followers', accessor: 'followers', sortType: 'basic' },
    { Header: 'No. of Likes', accessor: 'likes', sortType: 'basic' },
    { Header: 'Payment Details (Statement)', accessor: 'paymentDetails' },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <Box p={4}>
      <Heading mb={4}>Payment Details</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="Search by mobile number"
            value={search}
            type='number'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button mt={2} onClick={handleSearch}>Search</Button>
        </Box>
        <table {...getTableProps()} style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ borderBottom: 'solid 3px red', background: 'aliceblue', padding: '10px' }}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      style={{ padding: '10px', border: 'solid 1px gray', background: 'papayawhip' }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </VStack>
    </Box>
  );
};

export default PaymentDetails;
