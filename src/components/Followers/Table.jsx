import React, { useState, useCallback } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, HStack, Input } from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const UserTable = ({ data, onPaidChange, onProcessingAmountChange, pageIndex, setPageIndex }) => {
  const [editingPaidDone, setEditingPaidDone] = useState({});
  const [editingProcessingAmount, setEditingProcessingAmount] = useState({});

  const handlePaidDoneChange = (id, value) => {
    setEditingPaidDone((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleProcessingAmountChange = (id, value) => {
    setEditingProcessingAmount((prevState) => ({ ...prevState, [id]: value }));
  };

  const debounceApiCall = useCallback(
    debounce((id, value, apiFunc) => {
      apiFunc(id, value);
    }, 500),
    []
  );

  const columns = React.useMemo(
    () => [
      { Header: 'Plan (Free/Paid)', accessor: 'plan' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Mobile Number', accessor: 'mobileNumber' },
      { Header: 'Total No. of Followers', accessor: 'totalFollowers' },
      { Header: 'Amount (in Rs.)', accessor: 'amount' },
      {
        Header: 'Paid Done',
        accessor: 'paidDone',
        Cell: ({ row }) => {
          const { id, amount } = row.original;
          const localValue = editingPaidDone[id] !== undefined ? editingPaidDone[id] : row.original.paidDone;

          return (
            <Input
              type="number"
              value={localValue}
              onClick={(e) => e.stopPropagation()} // Prevent sorting on click
              onChange={(e) => {
                handlePaidDoneChange(id, Number(e.target.value));
                debounceApiCall(id, Number(e.target.value), onPaidChange);
              }}
              onBlur={() => onPaidChange(id, localValue)} // Call API when focus is lost
              min="0"
              max={amount}
            />
          );
        },
      },
      { Header: 'Balance Amount', accessor: 'balanceAmount' },
      {
        Header: 'Processing Amount',
        accessor: 'processingAmount',
        Cell: ({ row }) => {
          const { id } = row.original;
          const localValue = editingProcessingAmount[id] !== undefined ? editingProcessingAmount[id] : row.original.processingAmount;

          return (
            <Input
              type="number"
              value={localValue}
              onClick={(e) => e.stopPropagation()} // Prevent sorting on click
              onChange={(e) => {
                handleProcessingAmountChange(id, Number(e.target.value));
                debounceApiCall(id, Number(e.target.value), onProcessingAmountChange);
              }}
              onBlur={() => onProcessingAmountChange(id, localValue)} // Call API when focus is lost
              min="0"
            />
          );
        },
      },
      { Header: 'Paid Amount Details', accessor: 'paidAmountDetails' }
    ],
    [editingPaidDone, editingProcessingAmount, onPaidChange, onProcessingAmountChange]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex: currentPageIndex, sortBy }, // Access sortBy after initialization
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex }, // Remove sortBy from initialState
      autoResetSortBy: false, // Prevent auto reset of sortBy when data changes
    },
    useSortBy,
    usePagination
  );

  const renderSortIcon = (column) => {
    if (!column.isSorted) return <FaSort />;
    return column.isSortedDesc ? <FaSortDown /> : <FaSortUp />;
  };

  const handlePageChange = ({ selected }) => {
    setPageIndex(selected);
    gotoPage(selected);
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
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
          initialPage={currentPageIndex}
        />
      </Box>
    </Box>
  );
};

export default UserTable;
