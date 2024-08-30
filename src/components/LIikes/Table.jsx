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

const UserTable = ({ data, handlePaidChange, handleProcessingAmountChange, pagination, setPagination }) => {
  const [editingPaidDone, setEditingPaidDone] = useState({});
  const [editingProcessingAmount, setEditingProcessingAmount] = useState({});

  const handlePaidDoneChange = (id, value) => {
    setEditingPaidDone((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleProcessingAmountLocalChange = (id, value) => {
    setEditingProcessingAmount((prevState) => ({ ...prevState, [id]: value }));
  };

  const debouncePaidDoneApiCall = useCallback(
    debounce((id, value) => {
      handlePaidChange(id, value);
    }, 500),
    [handlePaidChange]
  );

  const debounceProcessingAmountApiCall = useCallback(
    debounce((id, value) => {
      handleProcessingAmountChange(id, value);
    }, 500),
    [handleProcessingAmountChange]
  );
  
  const columns = React.useMemo(
    () => [
      { Header: 'Plan (Free/Paid)', accessor: 'plan' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Mobile Number', accessor: 'mobileNumber' }, // contactNumber to mobileNumber
      { Header: 'Total No. of Likes', accessor: 'likes' },
      { Header: 'Dislikes', accessor: 'dislikes' },
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
                debouncePaidDoneApiCall(id, Number(e.target.value));
              }}
              onBlur={() => handlePaidChange(id, localValue)} // Call API when focus is lost
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
                handleProcessingAmountLocalChange(id, Number(e.target.value));
                debounceProcessingAmountApiCall(id, Number(e.target.value));
              }}
              onBlur={() => handleProcessingAmountChange(id, localValue)} // Call API when focus is lost
              min="0"
            />
          );
        },
      },
      { Header: 'Paid Amount Details', accessor: 'paidAmountDetails' },
    ],
    [editingPaidDone, editingProcessingAmount, handlePaidChange, handleProcessingAmountChange]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize },
      autoResetSortBy: false, // Prevent table from resetting sorting after each change
      autoResetPage: false, // Prevent table from resetting pagination after each change
    },
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    setPagination({ pageIndex, pageSize });
  }, [pageIndex, pageSize, setPagination]);

  const renderSortIcon = (column) => {
    if (!column.isSorted) return <FaSort />;
    return column.isSortedDesc ? <FaSortDown /> : <FaSortUp />;
  };

  const handlePageChange = ({ selected }) => {
    setPagination({ pageIndex: selected, pageSize });
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
          initialPage={pageIndex}
        />
      </Box>
    </Box>
  );
};

export default UserTable;
