// UserService.js
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Config';

const getUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);

  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getUserWithPostsStats = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);

  const userData = [];
  for (const userDoc of usersSnapshot.docs) {
    const user = userDoc.data();
    const postsCollection = collection(db, 'videos');
    const userPostsQuery = query(postsCollection, where('uid', '==', user.uid));
    const postsSnapshot = await getDocs(userPostsQuery);

    let totalLikes = 0;
    let totalViews = 0;
    postsSnapshot.forEach(postDoc => {
      const postData = postDoc.data();
      totalLikes += postData.likes ? postData.likes.length : 0;
      totalViews += postData.views ? postData.views : 0;
    });

    userData.push({
      id: userDoc.id,
      ...user,
      likes: totalLikes,
      views: totalViews,
      totalPosts: postsSnapshot.docs.length
    });
  }

  return userData;
};

export { getUsers, getUserWithPostsStats };
