import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Box, Table as ChakraTable, Thead, Tbody, Tr, Th, Td, Input, HStack } from '@chakra-ui/react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

const UserTable = ({ data, handlePaidChange, pagination, setPagination }) => {
  const columns = React.useMemo(
    () => [
      { Header: 'Plan (Free/Paid)', accessor: 'plan' },
      { Header: 'Username', accessor: 'username' },
      { Header: 'Mobile Number', accessor: 'contactNumber' },
      { Header: 'Total No. of Likes', accessor: 'likes' },
      { Header: 'Dislikes', accessor: 'dislikes' },
      { Header: 'Amount (in Rs.)', accessor: 'amount' },
      {
        Header: 'Paid Done',
        accessor: 'paidDone',
        Cell: ({ value, row }) => (
          <Input
            type="number"
            defaultValue={value}
            onBlur={(e) => handlePaidChange(row.original.id, Number(e.target.value))}
          />
        ),
      },
      { Header: 'Balance Amount', accessor: 'balanceAmount' },
      { Header: 'Processing Amount', accessor: 'processingAmount' },
      { Header: 'Paid Amount Details', accessor: 'paidAmountDetails' }
    ],
    [handlePaidChange]
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
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
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
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
          initialPage={pageIndex}
        />
      </Box>
    </Box>
  );
};

export default UserTable;
