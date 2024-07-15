import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Table, Thead, Tbody, Tr, Th, Td, useToast, useDisclosure } from '@chakra-ui/react';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from 'Config'; 
import ReactPaginate from 'react-paginate';
import './paid.css'; // Import the CSS file
import ConfirmDialog from './ConfirmDialog'; // Import the custom ConfirmDialog component

const PaidUserControl = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [validTill, setValidTill] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('all');
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            let q = query(collection(db, "users"));
            if (search) {
                q = query(collection(db, "users"), where("mobileNumber", "==", search));
            }
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
        };
        
        fetchUsers();
    }, [search, validTill]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handlePaidChange = async () => {
        if (selectedUser) {
            const userRef = doc(db, "users", selectedUser.id);
            const userDoc = await getDoc(userRef);
    
            if (userDoc.exists()) {
                const updatedPaidStatus = !userDoc.data().paid;
                await updateDoc(userRef, {
                    paid: updatedPaidStatus ? '*' : '✔️'
                });
                toast({
                    title: "User updated.",
                    description: `User payment status has been ${updatedPaidStatus ? 'marked as paid' : 'marked as unpaid'}.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                onClose();
                setSelectedUser(null);
                setActionType('');
                // Refetch users to update the list
                const querySnapshot = await getDocs(query(collection(db, "users")));
                setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        }
    };

    // const handleReview = async (userId) => {
    //     const userRef = doc(db, "users", userId);
    //     await updateDoc(userRef, {
    //         review: true
    //     });
    //     toast({
    //         title: "User marked for review.",
    //         status: "success",
    //         duration: 5000,
    //         isClosable: true,
    //     });
    // };

    const handlePaidToggle = (user, type) => {
        return 
        // setSelectedUser(user);
        // setActionType(type);
        // onOpen();
    };

    const handleSearch = () => {
        // Trigger the search by setting the validTill state
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
                <Input
                    placeholder="Valid Till (MM-YYYY)"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    mr={2}
                />
                {/* <Button onClick={handleSearch} mr={2}>Search</Button>
                <Button onClick={() => setFilter('all')} mr={2}>All</Button> */}
                <Button onClick={() => setFilter('paid')}>Paid</Button>
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>S.No</Th>
                        <Th>Username</Th>
                        <Th>Mobile No.</Th>
                        <Th>Validity From</Th>
                        <Th>Validity To</Th>
                        <Th>Paid</Th>
                        <Th>Review</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {users?.slice(currentPage * 10, (currentPage + 1) * 10).filter(user => {
                        if (filter === 'paid') return user.paid;
                        return true;
                    }).map((user, index) => (
                        <Tr key={user.id}>
                            <Td>{index + 1}</Td>
                            <Td>{user.username}</Td>
                            <Td>{user.mobileNumber}</Td>
                            <Td>{user.validityFrom}</Td>
                            <Td>{user.validityTo}</Td>
                            <Td>
                                {user.paid ? '✔️' : '❌'}
                                <Button onClick={() => handlePaidToggle(user, 'paid')}>{user.paid ? 'Unmark Paid' : 'Mark as Paid'}</Button>
                            </Td>
                            <Td>
                                <Button >Hold</Button>
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
            />
            {selectedUser && (
                <ConfirmDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    onConfirm={handlePaidChange}
                    title="Confirm?"
                    description={`Do you want to ${selectedUser.paid ? 'unmark' : 'mark'} this user as paid?`}
                />
            )}
        </Box>
    );
};

export default PaidUserControl;
