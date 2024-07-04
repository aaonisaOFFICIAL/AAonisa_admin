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
      id: docRef.id,
      uid:" ",
      createdAt: new Date(),
    });


    return docRef.id;
  } catch (error) {
    console.error('Error adding quiz question:', error);
    throw error;
  }
};
