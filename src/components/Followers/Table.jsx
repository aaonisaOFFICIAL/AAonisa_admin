import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, HStack, Input } from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const UserTable = ({ data, onPaidChange, pageIndex, setPageIndex }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'Plan (Free/Paid)', accessor: 'plan' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Mobile Number', accessor: 'contactNumber' },
      { Header: 'Total No. of Followers', accessor: 'totalFollowers' },
      { Header: 'Amount (in Rs.)', accessor: 'amount' },
      {
        Header: 'Paid Done',
        accessor: 'paidDone',
        Cell: ({ row }) => {
          const { id, amount, paidDone } = row.original;
          return (
            <Input
              type="number"
              value={paidDone}
              onChange={(e) => onPaidChange(id, Number(e.target.value))}
              min="0"
              max={amount}
            />
          );
        },
      },
      { Header: 'Balance Amount', accessor: 'balanceAmount' },
      { Header: 'Processing Amount', accessor: 'processingAmount' },
      { Header: 'Paid Amount Details', accessor: 'paidAmountDetails' }
    ],
    [onPaidChange]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize }
  } = useTable(
    { columns, data, initialState: { pageIndex } },
    useSortBy,
    usePagination
  );

  const renderSortIcon = (column) => {
    if (!column.isSorted) return <FaSort />;
    return column.isSortedDesc ? <FaSortDown /> : <FaSortUp />;
  };

  return (
    <Box overflowX="auto">
      <ChakraTable {...getTableProps()} variant="striped" colorScheme="teal">
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <HStack>
                    <span>{column.render('Header')}</span>
                    <span>{renderSortIcon(column)}</span>
                  </HStack>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map(row => {
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
      </ChakraTable>
      
      <Box mt={4}>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => {
            setPageIndex(selected);
            gotoPage(selected);
          }}
          containerClassName={'pagination'}
          activeClassName={'active'}
          initialPage={pageIndex}
        />
      </Box>
    </Box>
  );
};

export default UserTable;
