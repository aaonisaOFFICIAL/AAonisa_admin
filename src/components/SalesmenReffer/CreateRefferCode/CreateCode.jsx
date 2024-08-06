import React, { useState, useEffect } from 'react'
import "./CreateCode.css"
import { Button, Input, Table, Tbody, Td, Th, Thead, Tr, IconButton } from '@chakra-ui/react'
import { addDoc, collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from 'Config'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'
import { DeleteIcon } from '@chakra-ui/icons'

const CreateCode = () => {
    //state variables
    const [location, setLocation] = useState("")
    const [franchise, setFranchise] = useState("")
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [address, setAddress] = useState("")
    const [adhaar, setAdhaar] = useState("")
    const [bankName, setBankName] = useState("")
    const [accName, setAccName] = useState("")
    const [accNumber, setAccNumber] = useState("")
    const [ifsc, setIfsc] = useState("")

    //state for pagination
    const [salesmen, setSalesmen] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 4

    //fetch data from firestore
    const fetchSalesmen = async () => {
        const user = collection(db, "salesmen")
        const snapshot = await getDocs(query(user))
        const salesmenList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setSalesmen(salesmenList)
    }

    useEffect(() => {
        fetchSalesmen()
    }, [])

    //create data
    const createData = async() => {
        const user = collection(db, "salesmen")
        try {
            await addDoc(user, {
                salemenid: location + franchise + code,
                name: name,
                phonenumber: number,
                salesmenaddress: address,
                aadharnumber: adhaar,
                bankname: bankName,
                accountholdername: accName,
                accountnumber: accNumber,
                ifsc: ifsc
            })
            fetchSalesmen()
            Swal.fire({
                icon: 'success',
                title: 'Salesman Created',
                text: 'The salesman has been created successfully!'
            })
            // Clear input fields
            setLocation("")
            setFranchise("")
            setCode("")
            setName("")
            setNumber("")
            setAddress("")
            setAdhaar("")
            setBankName("")
            setAccName("")
            setAccNumber("")
            setIfsc("")
        }
        catch(err) {
            console.error(err)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error creating the salesman.'
            })
        }
    }

    //delete data
    const deleteData = async (id) => {
        try {
            await deleteDoc(doc(db, "salesmen", id))
            fetchSalesmen()
            Swal.fire({
                icon: 'success',
                title: 'Salesman Deleted',
                text: 'The salesman has been deleted successfully!'
            })
        } catch (err) {
            console.error(err)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error deleting the salesman.'
            })
        }
    }

    //handle page click
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }

    //paginate salesmen
    const offset = currentPage * itemsPerPage
    const currentPageData = salesmen.slice(offset, offset + itemsPerPage).sort((a, b) => b.timestamp - a.timestamp)
    const pageCount = Math.ceil(salesmen.length / itemsPerPage)

    return (
        <div className="create-code">
            <div className="create-input">
                <p>ANS</p>
                <Input style={{border: "1px solid #000", width:"28%"}} placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)}/>
                <Input style={{border: "1px solid #000", width:"28%"}} placeholder='Franchise/Salespartner' value={franchise} onChange={(e) => setFranchise(e.target.value)}/>
                <Input style={{border: "1px solid #000", width:"28%"}} placeholder='Code' value={code} onChange={(e) => setCode(e.target.value)}/>
            </div>

            <div className="create-personal">
                <h2>Personal Details</h2>
                <form>
                    <div className="details-row">
                        <Input type="text" placeholder='Name' style={{width:"40%", border:"1px solid #000"}} value={name} onChange={(e) => setName(e.target.value)}/>
                        <Input type="number" placeholder='Phone Number'style={{width:"40%", border:"1px solid #000"}} value={number} onChange={(e) => setNumber(e.target.value)}/>
                    </div>
                    <div className="details-row" style={{marginTop:"20px"}}>
                        <Input type="text" placeholder='Address' style={{width:"40%", border:"1px solid #000"}} value={address} onChange={(e) => setAddress(e.target.value)}/>
                        <Input type="number" placeholder='Aadhar Number'style={{width:"40%", border:"1px solid #000"}} value={adhaar} onChange={(e) => setAdhaar(e.target.value)}/>
                    </div>
                </form>
            </div>

            <div className="create-bank">
                <h2>Bank Details</h2>
                <form>
                    <div className="details-row">
                        <Input type="text" placeholder='Bank Name' style={{width:"40%", border:"1px solid #000"}} value={bankName} onChange={(e) => setBankName(e.target.value)}/>
                        <Input type="text" placeholder='Account Holder Name'style={{width:"40%", border:"1px solid #000"}} value={accName} onChange={(e) => setAccName(e.target.value)}/>
                    </div>
                    <div className="details-row" style={{marginTop:"20px"}}>
                        <Input type="number" placeholder='Account Number' style={{width:"40%", border:"1px solid #000"}} value={accNumber} onChange={(e) => setAccNumber(e.target.value)}/>
                        <Input type="text" placeholder='IFSC'style={{width:"40%", border:"1px solid #000"}} value={ifsc} onChange={(e) => setIfsc(e.target.value)}/>
                    </div>
                </form>
            </div>

            <div className="create-button">
                <Button onClick={createData}>Create</Button>
            </div>

            <div className="salesmen-list">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Phone Number</Th>
                            <Th>Address</Th>
                            <Th>Bank Name</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {currentPageData.map((salesman, index) => (
                            <Tr key={index}>
                                <Td>{salesman.salemenid}</Td>
                                <Td>{salesman.name}</Td>
                                <Td>{salesman.phonenumber}</Td>
                                <Td>{salesman.salesmenaddress}</Td>
                                <Td>{salesman.bankname}</Td>
                                <Td>
                                    <IconButton
                                        icon={<DeleteIcon />}
                                        colorScheme="red"
                                        onClick={() => deleteData(salesman.id)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    )
}

export default CreateCode
