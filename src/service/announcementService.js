import { db, storage } from 'Config'; // Adjust the path as necessary
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const announcementsCollection = collection(db, 'annocument');

export const addAnnouncement = async (content, imageFile) => {
  try {
    let imageUrl = ' ';
    if (imageFile) {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const announcement = {
      title: content.trim(),
      image: imageUrl,
      created_at: new Date(),
    };
    const docRef = await addDoc(announcementsCollection, announcement);
    console.log('Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const q = query(announcementsCollection, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const announcements = [];
    querySnapshot.forEach((doc) => {
      announcements.push({ id: doc.id, ...doc.data() });
    });
    return announcements;
  } catch (error) {
    console.error('Error getting announcements:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id, imageUrl) => {
  try {
    const announcementDoc = doc(db, 'annocument', id);
    await deleteDoc(announcementDoc);
    if (imageUrl && imageUrl !== ' ') {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
    console.log('Announcement deleted with ID:', id);
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};
