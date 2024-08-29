import React, { useEffect, useState, useMemo } from 'react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { collection, getDocs } from 'firebase/firestore';
import { Box, Input, Button, VStack, Heading ,Select } from '@chakra-ui/react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import ReactPaginate from 'react-paginate';
// import Select from 'rc-select';
// import 'rc-select/assets/index.css';

const AchieverRankTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [rank, setRank] = useState(null);
  const [plan, setPlan] = useState(null);
  const [originalData, setOriginalData] = useState([]);

  const rankOptions = [
    { value: 'Silver', label: 'Silver' },
    { value: 'Gold', label: 'Gold' },
    { value: 'Platinum', label: 'Platinum' },
    { value: 'Diamond', label: 'Diamond' },
    { value: 'Kohinoor', label: 'Kohinoor' }
  ];

  const planOptions = [
    { value: 'Free', label: 'Free' },
    { value: 'Paid', label: 'Paid' }
  ];

  const fetchData = async () => {
    const usersCollection = collection(db, 'users'); // Adjust collection name as needed
    const usersSnapshot = await getDocs(usersCollection);
    const achieversData = usersSnapshot.docs.map(doc => doc.data());
    setData(achieversData);
    setOriginalData(achieversData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = originalData;
    if (search) {
      filteredData = filteredData.filter(user => user?.mobileNumber?.includes(search));
    }
    if (rank) {
      filteredData = filteredData.filter(user => user?.rank === rank.value);
    }
    if (plan) {
      filteredData = filteredData.filter(user => user?.plan === plan.value);
    }
    setData(filteredData);
  }, [search, rank, plan, originalData]);

  const columns = useMemo(() => [
    { Header: 'S.No', accessor: (_, rowIndex) => rowIndex + 1 },
    { Header: 'Mobile No.', accessor: 'mobileNumber' },
    { Header: 'Rank', accessor: 'rank' },
    { Header: 'No. of Followers', accessor: 'followers.length', sortType: 'basic' },
    { Header: 'No. of Reports', accessor: 'reports', sortType: 'basic' },
    { Header: 'Plan', accessor: 'plan' },
    { Header: 'One Time Bonus', accessor: 'oneTimeBonus' },
    { Header: 'One Time Bonus Paid', accessor: 'oneTimeBonusPaid' },
    { Header: 'Salary', accessor: 'salary' },
    { Header: 'Details', accessor: 'paymentDetails' },
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
  const handleRankChange = (event) => {
    setRank(event.target.value);
  };
  return (
    <Box p={4}>
      <Heading mb={4}>Achiever Rank Details</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Input
            placeholder="Search by mobile number"
            value={search}
            type='number'
            onChange={(e) => setSearch(e.target.value)}
          />
             <Select
          placeholder="Select Rank"
          value={rank}
          onChange={handleRankChange}
          style={{ width: '200px', marginTop: '10px' }}
        >
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Diamond">Diamond</option>
          <option value="Kohinoor">Kohinoor</option>
        </Select>

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

export default AchieverRankTable;
