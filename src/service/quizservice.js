import { db, storage } from 'Config';
import { collection, setDoc, doc, Timestamp, deleteDoc, query, getDocs, orderBy, startAfter, limit } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const quizCollection = collection(db, 'quiz');

export const addQuizQuestion = async (question, image) => {
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
      createdAt: new Date(),
      allowComment: true,
      commentCount: 0,
      comment: [],
      profile: '',
      likeComment: 0,
      commentimage: [],
      Likestatus: false,
      likes: [],
      pincomment: false,
      created_at: Timestamp.now(),
      likecount: 0
    });

    return {
      quizid: docRef.quizid,
      allowComment: docRef.allowComment,
      commentCount: docRef.commentCount,
      comment: docRef.comments,
      profile: docRef.profile,
      likeComment: docRef.likeComment,
      commentimage: docRef.commentimage,
      Likestatus: docRef.Likestatus,
      likes: docRef.likes,
      createdAt: docRef.createdAt,
      created_at: docRef.created_at,
      likecount: docRef.likecount
    };
  } catch (error) {
    console.error('Error adding quiz question:', error);
    throw error;
  }
};

export const deleteQuizQuestion = async (quizId) => {
  try {
    await deleteDoc(doc(quizCollection, quizId));
    // Optionally delete associated image from storage if needed
  } catch (error) {
    console.error('Error deleting quiz question:', error);
    throw error;
  }
};

export const fetchQuizzes = async (page, perPage) => {
  try {
    const quizQuery = query(quizCollection, orderBy('created_at', 'desc'), limit(perPage));
    const snapshot = await getDocs(quizQuery);

    const quizzes = [];
    snapshot.forEach((doc) => {
      quizzes.push(doc.data());
    });

    // Get total quizzes count
    const totalSnapshot = await getDocs(query(quizCollection));
    const totalQuizzes = totalSnapshot.size;

    return { data: quizzes, total: totalQuizzes };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};
