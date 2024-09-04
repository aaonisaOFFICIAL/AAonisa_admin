// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Input,
//   Button,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
// } from '@chakra-ui/react';
// import { db } from 'Config'; // Adjust the import according to your file structure
// import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
// import ReactPaginate from 'react-paginate';
// import Swal from 'sweetalert2'; // Import SweetAlert2

// const ReferId = () => {
//   const [searchReferId, setSearchReferId] = useState('');
//   const [searchMobileNumber, setSearchMobileNumber] = useState('');
//   const [addReferId, setAddReferId] = useState('');
//   const [addMobileNumber, setAddMobileNumber] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [referrals, setReferrals] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage] = useState(5);

//   useEffect(() => {
//     fetchReferralData();
//   }, []);

//   useEffect(() => {
//     setReferrals(searchResults.slice(0, itemsPerPage));
//   }, [searchResults, itemsPerPage]);

//   const fetchReferralData = async (refId = '', mobNumber = '') => {
//     const collectionRef = collection(db, 'referralCode');
//     let q = collectionRef;

//     if (refId) {
//       q = query(q, where('code', '==', refId));
//     }

//     if (mobNumber) {
//       q = query(q, where('mobileNumber', '==', mobNumber));
//     }

//     try {
//       const referralSnapshot = await getDocs(q);
//       const referralData = referralSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

//       console.log('Fetched referral data:', referralData); // Log fetched data

//       setSearchResults(referralData);
//       setReferrals(referralData.slice(0, itemsPerPage));
//       setCurrentPage(0);
//     } catch (error) {
//       console.error("Error fetching referral data: ", error);
//     }
//   };

//   const handleSearch = async () => {
//     await fetchReferralData(searchReferId, searchMobileNumber);
//   };

//   const handleClearSearch = () => {
//     setSearchReferId('');
//     setSearchMobileNumber('');
//     fetchReferralData(); // Fetch all data when inputs are cleared
//   };

//   const handleAdd = async () => {
//     // Validation for mobile number and referral ID
//     if (addMobileNumber.length > 10) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Invalid Mobile Number',
//         text: 'Mobile number must not exceed 10 digits.',
//       });
//       return;
//     }

//     if (addReferId.length > 12) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Invalid Refer ID',
//         text: 'Refer ID must not exceed 12 characters.',
//       });
//       return;
//     }

//     const newReferral = {
//       code: addReferId,
//       mobileNumber: addMobileNumber,
//       noOfPaidUsers: 0,
//       amount: 0,
//     };

//     // Count users using the new referral code
//     const usersCollection = collection(db, 'users');

//     const usersQuery = query(usersCollection, where('referId', '==', addReferId));
//     const usersSnapshot = await getDocs(usersQuery);
//     const userCount = usersSnapshot.docs.length;
//     console.log('User count:', userCount);

//     newReferral.noOfPaidUsers = userCount;
//     newReferral.amount = userCount * 1999;

//     const docRef = await addDoc(collection(db, 'referralCode'), newReferral);
//     newReferral.id = docRef.id;

//     setSearchResults([...searchResults, newReferral]);
//     setReferrals([...searchResults.slice(0, itemsPerPage - 1), newReferral]);
//     Swal.fire({
//         icon: 'success',
//         title: 'added successfully',
//       });
//   };

//   const handlePageClick = ({ selected }) => {
//     const offset = selected * itemsPerPage;
//     setCurrentPage(selected);
//     setReferrals(searchResults.slice(offset, offset + itemsPerPage));
//   };

//   return (
//     <Box p={16} mt={10}>
//       <Box display="flex" mb={5}>
//         <Input
//           placeholder="Refer ID"
//           value={searchReferId}
//           onChange={(e) => setSearchReferId(e.target.value)}
//           mr={2}
//         />
//         <Box as="span" mr={2}>or</Box>
//         <Input
//           placeholder="Mobile Number"
//           value={searchMobileNumber}
//           onChange={(e) => setSearchMobileNumber(e.target.value)}
//           mr={2}
//         />
//         <Button onClick={handleSearch}>Search</Button>
//         <Button onClick={handleClearSearch} ml={2}>Clear</Button>
//       </Box>

//       <Box display="flex" mb={5}>
//         <Input
//           placeholder="Refer ID"
//           value={addReferId}
//           onChange={(e) => setAddReferId(e.target.value)}
//           mr={2}
//         />
//         <Input
//           placeholder="Mobile Number"
//           value={addMobileNumber}
//           onChange={(e) => setAddMobileNumber(e.target.value)}
//           mr={2}
//         />
//         <Button onClick={handleAdd}>Add</Button>
//       </Box>

//       <Table variant="simple">
//         <Thead>
//           <Tr>
//             <Th>S. No.</Th>
//             <Th>Mobile Number</Th>
//             <Th>Refer ID</Th>
//             <Th>no.of paid users ANS</Th>
//             <Th>AMOUNT</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {referrals.map((referral, index) => (
//             <Tr key={referral.id}>
//               <Td>{currentPage * itemsPerPage + index + 1}</Td>
//               <Td>{referral.mobileNumber}</Td>
//               <Td>
//                 <Input
//                   value={referral.code}
//                   onChange={(e) =>
//                     setReferrals(
//                       referrals.map((r, i) =>
//                         i === index ? { ...r, code: e.target.value } : r
//                       )
//                     )
//                   }
//                 />
//               </Td>
//               <Td>{referral.noOfPaidUsers}</Td>
//               <Td>{referral.amount}</Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>

//       <ReactPaginate
//         previousLabel={'Previous'}
//         nextLabel={'Next'}
//         breakLabel={'...'}
//         breakClassName={'break-me'}
//         pageCount={Math.ceil(searchResults.length / itemsPerPage)}
//         marginPagesDisplayed={2}
//         pageRangeDisplayed={3}
//         onPageChange={handlePageClick}
//         containerClassName={'pagination'}
//         subContainerClassName={'pages pagination'}
//         activeClassName={'active'}
//       />
//     </Box>
//   );
// };

// export default ReferId;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { db } from 'Config'; // Adjust the import according to your file structure
import { addDoc, collection, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2'; // Import SweetAlert2

const ReferId = () => {
  const [searchReferId, setSearchReferId] = useState('');
  const [searchMobileNumber, setSearchMobileNumber] = useState('');
  const [addReferId, setAddReferId] = useState('');
  const [addMobileNumber, setAddMobileNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchReferralData();
  }, []);

  useEffect(() => {
    setReferrals(searchResults.slice(0, itemsPerPage));
  }, [searchResults, itemsPerPage]);

  const fetchReferralData = async (refId = '', mobNumber = '') => {
    const collectionRef = collection(db, 'referralCode');
    let q = collectionRef;
  
    if (refId) {
      q = query(q, where('code', '==', refId));
    }
  
    if (mobNumber) {
      q = query(q, where('mobileNumber', '==', mobNumber));
    }
  
    // Add ordering by createdAt in descending order
    q = query(q, orderBy('createdAt', 'desc'));
  
    try {
      const referralSnapshot = await getDocs(q);
      const referralData = await Promise.all(referralSnapshot.docs.map(async (doc) => {
        const referral = { ...doc.data(), id: doc.id };
        const userCount = await fetchUserCount(referral.code);
        const amount = userCount * 1999;
        return { ...referral, noOfPaidUsers: userCount, amount };
      }));
  
      console.log('Fetched referral data:', referralData);
  
      setSearchResults(referralData);
      setReferrals(referralData.slice(0, itemsPerPage));
      setCurrentPage(0);
    } catch (error) {
      console.error("Error fetching referral data: ", error);
    }
  };
  

  const fetchUserCount = async (referId) => {
    const usersCollection = collection(db, 'users');
    const usersQuery = query(usersCollection, where('referCode', '==', referId), where('plan', '==', 'paid'));  // Change 'referId' to 'referCode'
    const usersSnapshot = await getDocs(usersQuery);
    const userCount = usersSnapshot.docs.length; // Get the count of users using this referId
    
    console.log(`Count of users using referId ${referId}:`, userCount); // Log the count
    return userCount; // Return the count of users
  };

  const handleSearch = async () => {
    await fetchReferralData(searchReferId, searchMobileNumber);
  };

  const handleClearSearch = () => {
    setSearchReferId('');
    setSearchMobileNumber('');
    fetchReferralData(); // Fetch all data when inputs are cleared
  };

  const handleAdd = async () => {
    if (!addReferId || !addMobileNumber) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Fields',
          text: 'Please enter both Refer ID and Mobile Number.',
        });
        return;
      }
    // Validation for mobile number and referral ID
    if (addMobileNumber.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Mobile Number',
        text: 'Mobile number must  be equall 10 digits.',
      });
      return;
    }

    if (addReferId.length  !== 12) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Refer ID',
        text: 'Refer ID must be equall 12 characters.',
      });
      return;
    }

    // Check for empty fields
  

    const newReferral = {
        code: addReferId,
        mobileNumber: addMobileNumber,
        noOfPaidUsers: 0,
        amount: 0,
        createdAt: new Date(), // Add this line to set the current timestamp
      };
      

    // Fetch the count of users using the new referral code
    newReferral.noOfPaidUsers = await fetchUserCount(newReferral.code);
    newReferral.amount = newReferral.noOfPaidUsers * 1999;

    const docRef = await addDoc(collection(db, 'referralCode'), newReferral);
    newReferral.id = docRef.id;

    setSearchResults([newReferral, ...searchResults]);
    setReferrals([newReferral, ...searchResults.slice(0, itemsPerPage - 1)]);

    // Clear the input fields after adding
    setAddReferId('');
    setAddMobileNumber('');
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the referral record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, 'referralCode', id));
      setSearchResults(searchResults.filter(referral => referral.id !== id));
      setReferrals(referrals.filter(referral => referral.id !== id));
      Swal.fire('Deleted!', 'The referral record has been deleted.', 'success');
    }
  };

  const handlePageClick = ({ selected }) => {
    const offset = selected * itemsPerPage;
    setCurrentPage(selected);
    setReferrals(searchResults.slice(offset, offset + itemsPerPage));
  };

  return (
    <Box p={16} mt={10}>
      <Box display="flex" mb={5}>
        <Input
          placeholder="Refer ID"
          value={searchReferId}
          onChange={(e) => setSearchReferId(e.target.value)}
          mr={2}
        />
        <Box as="span" mr={2}>or</Box>
        <Input
          placeholder="Mobile Number"
          value={searchMobileNumber}
          onChange={(e) => setSearchMobileNumber(e.target.value)}
          mr={2}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={handleClearSearch} ml={2}>Clear</Button>
      </Box>

      <Box display="flex" mb={5}>
        <Input
          placeholder="Refer ID"
          value={addReferId}
          onChange={(e) => setAddReferId(e.target.value)}
          mr={2}
        />
        <Input
          placeholder="Mobile Number"
          value={addMobileNumber}
          onChange={(e) => setAddMobileNumber(e.target.value)}
          mr={2}
        />
        <Button onClick={handleAdd}>Add</Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>S. No.</Th>
            <Th>Mobile Number</Th>
            <Th>Refer ID</Th>
            <Th>no.of paid users ANS</Th>
            <Th>AMOUNT</Th>
            <Th>Actions</Th> {/* New column for actions */}
          </Tr>
        </Thead>
        <Tbody>
          {referrals.map((referral, index) => (
            <Tr key={referral.id}>
              <Td>{currentPage * itemsPerPage + index + 1}</Td>
              <Td>{referral.mobileNumber}</Td>
              <Td>
                <Input
                  value={referral.code}
readOnly
                />
              </Td>
              <Td>{referral.noOfPaidUsers}</Td>
              <Td>{referral.amount}</Td>
              <Td>
                <Button colorScheme="red" onClick={() => handleDelete(referral.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(searchResults.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </Box>
  );
};

export default ReferId;


