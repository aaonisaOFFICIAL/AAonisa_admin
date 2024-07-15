import { db, storage } from 'Config'; // Ensure 'storage' is also imported from your config
import { collection, addDoc,setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Reference to the quiz collection
const quizCollection = collection(db, 'quiz');

// Function to add a quiz question with image upload
export const addQuizQuestion = async (question,image) => {
  try {
    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `quiz_images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = doc(quizCollection);

    await setDoc(docRef, {
      question,
      image: imageUrl,
      options: '',
      quizid: docRef.id,
      uid:" ",
      createdAt: new Date(),
      allowComment: true, // Set to true if allowComment is undefined or null
      commentCount:0, // Array with an empty string
      comment: [""] ,// Array with an empty string
      profile:"",
      likeComment:0,
      commentimage:"",
    });


    return {
      quizid: docRef.quizid,
      allowComment:docRef.allowComment,
      commentCount:docRef.commentCount,
      comment:docRef.comments,
      profile:docRef.profile,
      likeComment:docRef.likeComment,
      commentimage:docRef.commentimage
    };

   
  } catch (error) {
    console.error('Error adding quiz question:', error);
    throw error;
  }
};
