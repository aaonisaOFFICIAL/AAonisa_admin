import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from 'Config';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './paid.css';

const PaidUserControl = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [validTill, setValidTill] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchUsers = useCallback(async () => {
        let q = query(collection(db, "users"), where("TransactionID", "!=", ""));
        const querySnapshot = await getDocs(q);
        let usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (validTill) {
            usersData = usersData.filter(user => {
                if (!user.validityTo) return false;
                const [month, year] = validTill.split('-');
                const [validMonth, validYear] = user.validityTo.split('-');
                return validYear >= year && (validYear > year || validMonth >= month);
            });
        }

        setUsers(usersData);
        setPageCount(Math.ceil(usersData.length / 10));
    }, [validTill]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, currentPage]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleAddUserToPaidList = useCallback(async (mobileNumber) => {
        const q = query(collection(db, "users"), where("contactNumber", "==", mobileNumber));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userRef = doc(db, "users", userDoc.id);

            await updateDoc(userRef, {
                paid: true,
                TransactionID: "*************"
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
            await updateDoc(userRef, {
                paid: updatedPaidStatus
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

    return (
        <Box p={4} m={16}>
            <Box display="flex" mb={4}>
                <Input
                    placeholder="Mobile Number"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    mr={2}
                />
                <Button onClick={() => handleAddUserToPaidList(search)}>Add to Paid List</Button>
                <Input
                    placeholder="Valid Till (MM-YYYY)"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    ml={2}
                />
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>S.No</Th>
                        <Th>Username</Th>
                        <Th>Mobile No.</Th>
                        <Th>Transaction ID</Th>
                        <Th>Validity From</Th>
                        <Th>Validity To</Th>
                        <Th>Paid</Th>
                        <Th>Review</Th>
                    
                    </Tr>
                </Thead>
                <Tbody>
                    {users
                        ?.slice(currentPage * 10, (currentPage + 1) * 10)
                        .map((user, index) => (
                            <Tr key={user.id}>
                                <Td>{currentPage * 10 + index + 1}</Td>
                                <Td>{user.username}</Td>
                                <Td>{user.contactNumber}</Td>
                                <Td>{user.TransactionID}</Td>
                                <Td>{user.validityFrom}</Td>
                                <Td>{user.validityTo}</Td>
                                <Td>
                                    {user.paid ? '✔️' : '❌'}
                                    <Button onClick={() => handlePaidToggle(user)}>
                                        {user.paid ? 'Unmark Paid' : 'Mark as Paid'}
                                    </Button>
                                </Td>
                                <Td>
                                    <Button>Hold</Button>
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
