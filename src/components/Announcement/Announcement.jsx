import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  FormControl,
  FormErrorMessage,
  Input,
  Grid,
  Heading,
  Text,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addAnnouncement, getAnnouncements, deleteAnnouncement } from 'service/announcementService'; // Adjust path as necessary
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import { DeleteIcon } from '@chakra-ui/icons';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const schema = yup.object().shape({
  content: yup.string().max(1000, 'Content must be at most 1000 characters'),
  image: yup
    .mixed()
    .test('fileSize', 'The file is too large', (value) => {
      return value && value[0] ? value[0].size <= 2 * 1024 * 1024 : true; // Max 2MB
    }),
});

const Announcement = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [announcements, setAnnouncements] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Page index starts from 0
  const [announcementsPerPage] = useState(4); // Number of announcements per page

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const announcementsData = await getAnnouncements();
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const { content, image } = data;
      if (!content && !image[0]) {
        toast.dismiss();
        toast.error('Please enter either content or an image.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      await addAnnouncement(content, image[0]); // Assuming image[0] is the file
      toast.dismiss();
      toast.success('Your announcement has been successfully added.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      reset();
      fetchAnnouncements(); // Refresh announcements after adding new one
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure you want to delete this announcement?",
        text: "This action cannot be undone.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
  
      if (confirmation.isConfirmed) {
        await deleteAnnouncement(id);
        setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
        toast.success('Announcement deleted successfully.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // User canceled deletion
        Swal.fire("Deletion cancelled", "Your announcement is safe.", "info");
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      Swal.fire("Error", "An error occurred while deleting the announcement.", "error");
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(announcements?.length / announcementsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Display announcements for the current page
  const indexOfLastAnnouncement = (currentPage + 1) * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  return (
    <Box marginTop="100px">
      <ToastContainer />
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Add New Announcement
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.content} mb={4}>
            <Textarea placeholder="Content" maxLength={1000} {...register('content')} />
            <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.image} mb={4}>
            <Input type="file" id="imageInput" accept="image/*" {...register('image')} />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          All Announcements
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {currentAnnouncements.map((announcement) => (
            <Box key={announcement.id} p={4} borderWidth="1px" borderRadius="md" position="relative">
              <Heading size="sm">{announcement.title}</Heading>
              {announcement?.image && announcement?.image !== ' ' && (
                <img src={announcement.image} alt="Announcement" style={{ maxWidth: '100%', marginTop: '8px' }} />
              )}
              <Text mt={2}>{announcement?.created_at?.toDate()?.toLocaleDateString()}</Text>
              {/* Delete Icon */}
              <IconButton
                aria-label="Delete announcement"
                icon={<DeleteIcon />}
                position="absolute"
                top="8px"
                right="8px"
                onClick={() => handleDelete(announcement.id)}
              />
            </Box>
          ))}
        </Grid>

        {/* Pagination controls */}
        <Box
          sx={{
            '.pagination': {
              listStyle: 'none',
              padding: 0,
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center',
            },
            '.pagination li': {
              marginRight: '10px',
            },
            '.pagination li a': {
              padding: '5px 10px',
              textDecoration: 'none',
              color: '#337ab7',
            },
            '.pagination li a:hover': {
              color: '#23527c',
            },
            '.active a': {
              color: '#fff',
              backgroundColor: '#337ab7',
              borderRadius: '5px',
            },
          }}
        >
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'pagination-previous'}
            nextClassName={'pagination-next'}
            breakClassName={'pagination-break'}
            pageClassName={'pagination-page'}
            pageLinkClassName={'pagination-page-link'}
            previousLinkClassName={'pagination-previous-link'}
            nextLinkClassName={'pagination-next-link'}
            breakLinkClassName={'pagination-break-link'}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Announcement;
