import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Grid, GridItem
} from '@chakra-ui/react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, Timestamp, orderBy } from "firebase/firestore";
import { db } from 'Config';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './paid.css';
import moment from 'moment';

const PaidUserControl = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [transactionSearch, setTransactionSearch] = useState('');
    const [validTill, setValidTill] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showPaidUsers, setShowPaidUsers] = useState(false);
    const [sortBy, setSortBy] = useState(''); // Track sorting state
    const [sortOrder, setSortOrder] = useState('asc'); // Track sorting order
    const [mobileSearch, setMobileSearch] = useState('');


    const fetchUsers = useCallback(async () => {
        let q = query(
            collection(db, "users"),
            where("TransactionID", "!=", ""),
            orderBy("TransactionDate", "desc")
        );
        
        
        if (showPaidUsers) {
            q = query(collection(db, "users"), where("paid", "==", true));
        } else if (transactionSearch) {
            q = query(collection(db, "users"), where("TransactionID", "==", transactionSearch));
        }
        if (mobileSearch) {
            q = query(collection(db, "users"), where("mobileNumber", "==", mobileSearch), where("TransactionID", "!=", ""));   // contactNumber to mobileNumber
        }
    
        const querySnapshot = await getDocs(q);
        let usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('usersData:', usersData);
        // Check and update the paid status based on validityTo date
        const today = new Date();
        usersData = usersData.map(user => {
            if (user.validityTo) {
                const [month, year] = user.validityTo.split('-');
                const validTillDate = new Date(year, month - 1, 1);
                if (validTillDate < today) {
                    user.paid = false;
                }
            }
            return user;
        });

        if (validTill) {
            const [month, year] = validTill.split('-');
            usersData = usersData.filter(user => {
              if (!user.validTill) return false;
              const userValidTillDate = user.validTill.toDate();
              return userValidTillDate.getFullYear() === parseInt(year) && userValidTillDate.getMonth() + 1 === parseInt(month);
            });
        }

        // Sort usersData based on the sort state
        if (sortBy) {
            usersData.sort((a, b) => {
                if (sortBy === 'paid') {
                    return sortOrder === 'asc' ? a.paid - b.paid : b.paid - a.paid;
                }
                if (sortBy === 'hold') {
                    const holdOrder = { 'Hold': 1, 'Unhold': 0 };
                    return sortOrder === 'asc' ? holdOrder[a.hold] - holdOrder[b.hold] : holdOrder[b.hold] - holdOrder[a.hold];
                }
                return 0;
            });
        }

        setUsers(usersData?.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))); // Latest added on top
        setPageCount(Math.ceil(usersData.length / 10));
    }, [validTill, showPaidUsers, transactionSearch, mobileSearch,sortBy, sortOrder]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, currentPage,mobileSearch]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleAddUserToPaidList = useCallback(async (mobileNumber) => {
        if (!mobileNumber) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mobile number cannot be empty.',
            });
            return;
        }
      
        const q = query(collection(db, "users"), where("contactNumber", "==", mobileNumber));   // contactNumber to mobileNumber
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "users", userDoc.id);
      
            const today = new Date();
            const validFrom = Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
            const validTill =  Timestamp.fromDate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()))
            const transactionDate = Timestamp.fromDate(new Date()); // Current date and time for TransactionDate
      
            await updateDoc(userRef, {
                paid: true,
                TransactionID: "*************",
                validFrom: validFrom,
                validTill: validTill,
                TransactionDate: transactionDate
            });
            toast.success(`User has been added to the paid list.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchUsers();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `User with mobile number ${mobileNumber} not found.`,
            });
        }
    }, [fetchUsers]);

    const handlePaidChange = useCallback(async (user) => {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const updatedPaidStatus = !userDoc.data().paid;
            const today = new Date();
            const validFrom = updatedPaidStatus ? Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate())) : '';
            const validTill = updatedPaidStatus ? Timestamp.fromDate(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())) : '';
                
            await updateDoc(userRef, {
                paid: updatedPaidStatus,
                validFrom: validFrom,
                validTill: validTill
            });
        
            toast.success(`User payment status has been ${updatedPaidStatus ? 'marked as paid' : 'marked as unpaid'}.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchUsers();
        }
    }, [fetchUsers]);
    
    const handlePaidToggle = (user) => {
        Swal.fire({
            title: 'Confirm?',
            text: `Do you want to ${user.paid ? 'unmark' : 'mark'} this user as paid?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                handlePaidChange(user);
            }
        });
    };

    const handleHoldChange = useCallback(async (user) => {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const updatedHoldStatus = userDoc.data().hold === 'Hold' ? 'Unhold' : 'Hold';

            await updateDoc(userRef, {
                hold: updatedHoldStatus
            });

            toast.success(`User status has been ${updatedHoldStatus}.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchUsers();
        }
    }, [fetchUsers]);

    const handleHoldToggle = (user) => {
        Swal.fire({
            title: 'Confirm?',
            text: `Do you want to ${user.hold === 'Hold' ? 'unhold' : 'hold'} this user?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                handleHoldChange(user);
            }
        });
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            // Toggle the sorting order
            setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new column and default sorting order
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    return (
        <Box p={4} m={16}>
            <Grid templateColumns="repeat(6, 1fr)" gap={2} mb={4}>
            <GridItem colSpan={{ base: 6, md: 1 }}>
    <Input
        placeholder="Search by Mobile Number (With Transaction ID)"
        value={mobileSearch}
        onChange={(e) => setMobileSearch(e.target.value)}
    />
</GridItem>

                <GridItem colSpan={{ base: 6, md: 2 }}>
                    <Input
                        placeholder="Mobile Number"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </GridItem>
                <GridItem colSpan={{ base: 6, md: 1 }}>
                    <Button width="100%" onClick={() => handleAddUserToPaidList(search)}>Add to Paid List</Button>
                </GridItem>
                <GridItem colSpan={{ base: 6, md: 1 }}>
                    <Input
                        placeholder="Valid Till (MM-YYYY)"
                        value={validTill}
                        onChange={(e) => setValidTill(e.target.value)}
                    />
                </GridItem>
                <GridItem colSpan={{ base: 6, md: 1 }}>
                    <Input
                        placeholder="Search by Transaction ID"
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                    />
                </GridItem>
                {/* <GridItem colSpan={{ base: 6, md: 1 }}>
                    <Button width="100%" onClick={() => setShowPaidUsers(true)}>Show Paid Users</Button>
                </GridItem>
                <GridItem colSpan={{ base: 6, md: 1 }}>
                    <Button width="100%" onClick={() => setShowPaidUsers(false)}>Show All Users</Button>
                </GridItem> */}
            </Grid>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>S.No</Th>
                        <Th>Username</Th>
                        <Th>Mobile No.</Th>
                        <Th>Transaction ID</Th>
                        <Th>Validity From</Th>
                        <Th>Validity To</Th>
                        <Th>
                            <Button onClick={() => handleSort('paid')}>
                                Paid {sortBy === 'paid' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                            </Button>
                        </Th>
                        <Th>TransactionDate</Th>
                        <Th>
                            <Button onClick={() => handleSort('hold')}>
                                Hold {sortBy === 'hold' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                            </Button>
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users
                        ?.slice(currentPage * 10, (currentPage + 1) * 10)
                        .map((user, index) => (
                            <Tr key={user.id}>
                                <Td>{currentPage * 10 + index + 1}</Td>
                                <Td>{user.username}</Td>
                                <Td>{user.mobileNumber}</Td>   // contactNumber to mobileNumber
                                <Td>{user.TransactionID}</Td>
                                <Td>
                                    {user.validFrom && moment(user.validFrom.toDate()).format('DD-MM-YYYY')}
                                </Td>
                                <Td>
                                    {user.validTill && moment(user.validTill.toDate()).format('DD-MM-YYYY')}
                                </Td>
                                <Td>
                                    {user.paid ? '✔️' : '❌'}
                                    <Button onClick={() => handlePaidToggle(user)} ml={2}>
                                        {user.paid ? 'Unmark Paid' : 'Mark as Paid'}
                                    </Button>
                                </Td>
                                <Td>
                          
                                
                                <Td>
    {user.TransactionDate && moment(user.TransactionDate.toDate()).format('DD-MM-YYYY HH:mm:ss')}
</Td>

                                </Td>
                                <Td>
                                    {user.hold === 'Hold' ? '❌' : '✔️'}
                                    <Button onClick={() => handleHoldToggle(user)} ml={2}>
                                        {user.hold === 'Hold' ? 'Unhold' : 'Hold'}
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>

            <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                forcePage={currentPage} // force the current page to stay the same after update
            />
            <ToastContainer />
        </Box>
    );
};

export default PaidUserControl;
