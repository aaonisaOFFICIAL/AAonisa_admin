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
  IconButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import { DeleteIcon } from '@chakra-ui/icons';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { fetchQuizzes, deleteQuizQuestion, addQuizQuestion } from 'service/quizservice'; // Adjust path as necessary

const schema = yup.object().shape({
  question: yup.string().max(1000, 'Question must be at most 1000 characters'),
  image: yup.mixed().test('fileRequired', 'Image is required', (value) => {
    return value && value.length > 0;
  }),
});

const Quiz = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [quizzes, setQuizzes] = useState([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [pageData, setPageData] = useState({});
  const quizzesPerPage = 4;

  useEffect(() => {
    fetchQuizData(currentPage);
  }, [currentPage]);

  const fetchQuizData = async (page) => {
    try {
      const { data, lastVisible: newLastVisible, total } = await fetchQuizzes(
        page === 0 ? null : lastVisible, 
        quizzesPerPage
      );

      setPageData((prev) => ({
        ...prev,
        [page]: { data, lastVisible: newLastVisible, total },
      }));

      setQuizzes(data);
      setLastVisible(newLastVisible);
      setTotalQuizzes(total);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const { question, image } = data;
      await addQuizQuestion(question, image[0]);
      toast.success('Your quiz has been successfully added.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      reset();
      // Fetch data after adding a quiz
      fetchQuizData(currentPage);
    } catch (error) {
      console.error('Error adding quiz question:', error);
    }
  };

  const handleDelete = async (quizId) => {
    try {
      const confirmation = await Swal.fire({
        title: 'Are you sure you want to delete this quiz?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      });

      if (confirmation.isConfirmed) {
        await deleteQuizQuestion(quizId);
        toast.success('Quiz deleted successfully.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Fetch data after deleting a quiz
        fetchQuizData(currentPage);
      } else {
        Swal.fire('Deletion cancelled', 'Your quiz is safe.', 'info');
      }
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      Swal.fire('Error', 'An error occurred while deleting the quiz.', 'error');
    }
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const pageCount = Math.ceil(totalQuizzes / quizzesPerPage);

  return (
    <Box marginTop="100px">
      <ToastContainer />
      <Box mb={8}>
        <Heading size="md" mb={4}>
          Add New Quiz Question
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.question} mb={4}>
            <Textarea placeholder="Question" maxLength={1000} {...register('question')} />
            <FormErrorMessage>{errors.question?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.image} mb={4}>
            <Input type="file" accept="image/*" {...register('image')} />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          All Quizzes
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {quizzes.map((quiz) => (
            <Box key={quiz.id} p={4} borderWidth="1px" borderRadius="md" position="relative">
              <Heading size="sm">{quiz.question}</Heading>
              {quiz.image && (
                <img src={quiz.image} alt="Quiz" style={{ maxWidth: '100%', marginTop: '8px' }} />
              )}
              <IconButton
                aria-label="Delete quiz"
                icon={<DeleteIcon />}
                position="absolute"
                top="8px"
                right="8px"
                onClick={() => handleDelete(quiz.id)}
              />
            </Box>
          ))}
        </Grid>
        <Box mt={4}>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Quiz;
