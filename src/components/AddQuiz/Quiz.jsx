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
  useToast,
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
  question: yup.string().max(1000, 'Question must be at most 1000 characters').required('Question is required'),
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
  const [totalQuizzes, setTotalQuizzes] = useState(0); // Total number of quizzes in the database
  const [currentPage, setCurrentPage] = useState(0); // Page index starts from 0
  const quizzesPerPage = 4; // Number of quizzes per page

  useEffect(() => {
    fetchQuizData(currentPage); // Fetch data for the initial page
  }, [currentPage]); // Trigger fetchQuizData when currentPage changes

  const fetchQuizData = async (page) => {
    try {
      const { data, total } = await fetchQuizzes(page + 1, quizzesPerPage); // Page starts from 1 in fetchQuizzes
      setQuizzes(data);
      setTotalQuizzes(total); // Assuming fetchQuizzes returns total quizzes count

      // Debug output for totalQuizzes
      console.log("Total Quizzes:", total);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const { question, image } = data;
      await addQuizQuestion(question, image[0]);
      toast.dismiss();
      toast.success('Your quiz has been successfully added.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      reset(); // Reset the entire form
      fetchQuizData(currentPage); // Refresh quizzes after adding new one on the current page
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
        fetchQuizData(currentPage); // Refresh quizzes after deletion
        toast.success('Quiz deleted successfully.', {
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
        Swal.fire('Deletion cancelled', 'Your quiz is safe.', 'info');
      }
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      Swal.fire('Error', 'An error occurred while deleting the quiz.', 'error');
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(totalQuizzes / quizzesPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // Update current page
  };

  // Display quizzes for the current page
  const indexOfLastQuiz = (currentPage + 1) * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);

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
          {currentQuizzes.map((quiz) => (
            <Box key={quiz.quizid} p={4} borderWidth="1px" borderRadius="md" position="relative">
              <Heading size="sm">{quiz.question}</Heading>
              {quiz?.image && quiz?.image !== ' ' && (
                <img src={quiz.image} alt="Quiz" style={{ maxWidth: '100%', marginTop: '8px' }} />
              )}
              {/* Delete Icon */}
              <IconButton
                aria-label="Delete quiz"
                icon={<DeleteIcon />}
                position="absolute"
                top="8px"
                right="8px"
                onClick={() => handleDelete(quiz.quizid)}
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
