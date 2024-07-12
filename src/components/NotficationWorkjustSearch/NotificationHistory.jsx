// NotificationHistory.jsx

import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Select } from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const notificationsPerPage = 10; // Number of notifications per page

  useEffect(() => {
    // Fetch notifications from Firebase or your backend
    // Example fetch logic
    const fetchNotifications = async () => {
      try {
        // Replace with actual fetching logic
        const data = []; // Fetch data from Firebase or API
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const pageCount = Math.ceil(notifications.length / notificationsPerPage);

  const handlePageClick = (selectedPage) => {
    setPageNumber(selectedPage.selected);
  };

  const displayNotifications = notifications
    .slice(pageNumber * notificationsPerPage, (pageNumber + 1) * notificationsPerPage)
    .map((notification) => (
      <Tr key={notification.id}>
        <Td>{notification.title}</Td>
        <Td>{notification.targetAudience}</Td>
        <Td>{notification.status}</Td>
        <Td>{notification.dateSent}</Td>
      </Tr>
    ));

  return (
    <Box mt={4}>
      <Table variant="simple">
        
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Target Audience</Th>
            <Th>Status</Th>
            <Th>Date Sent</Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayNotifications}
        </Tbody>
      </Table>
      <Box mt={4}>
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />
      </Box>
    </Box>
  );
};

export default NotificationHistory;
