// src/components/NotificationHistory.js
import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import ReactPaginate from 'react-paginate';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { JSdb } from "JSConfig"; // Assuming you have initialized Firebase

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const notificationsPerPage = 10; // Number of notifications per page

  useEffect(() => {
    // Fetch notifications from Firestore
    const fetchNotifications = async () => {
      try {
        const querySnapshot = await getDocs(collection(JSdb, 'notifications'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Sort by createdAt in descending order
        const sortedData = data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setNotifications(sortedData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Check and update notification status dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedNotifications = notifications.map(notification => {
        if (notification.status === 'scheduled' && notification.scheduleDate.toDate() <= new Date()) {
          // Update status to 'sent' in Firestore
          updateDoc(doc(JSdb, 'notifications', notification.id), {
            status: 'sent'
          });
          // Update locally to reflect changes immediately
          return {
            ...notification,
            status: 'sent'
          };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notifications]);

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
        <Td>{notification.scheduleDate.toDate().toLocaleString()}</Td>
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
