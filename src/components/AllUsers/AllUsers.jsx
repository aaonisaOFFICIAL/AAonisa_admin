import { db } from 'Config';
import Table from '../Tables/Tables';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndPosts = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = usersSnapshot.docs.map((userDoc) => userDoc.data());

        const postsCollection = collection(db, 'videos');
        const postsQuery = query(postsCollection);
        const postsSnapshot = await getDocs(postsQuery);

        const postsData = postsSnapshot.docs.map((postDoc) => postDoc.data());

        const userDataWithPosts = usersData.map((user) => {
          const userPosts = postsData.filter((post) => post.uid === user.uid);
          const totalLikes = userPosts.reduce((acc, post) => acc + (post.likes ? post.likes.length : 0), 0);
          const totalViews = userPosts.reduce((acc, post) => acc + (post.views ? post.views : 0), 0);

          return {
            ...user,
            likes: totalLikes,
            views: totalViews,
            totalPosts: userPosts.length,
          };
        });

        setUsers(userDataWithPosts);
        setPosts(postsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUsersAndPosts();
  }, []);

  const columns = [
    { Header: 'Username', accessor: 'username' },
    { Header: 'Mobile Number', accessor: 'MobileNumber' },
    { Header: 'Followers', accessor: 'Followers' },
    { Header: 'Following', accessor: 'Following' },
    { Header: 'Profile Pic', accessor: 'Pic' },
    { Header: 'Plan', accessor: 'Plan' },
    { Header: 'Likes', accessor: 'likes' },
    { Header: 'Views', accessor: 'views' },
    { Header: 'Total Posts', accessor: 'totalPosts' },
  ];

  const data = users.map((user) => {
    if (!user) return {}; // or some default value
    return {
      username: user?.username,
      MobileNumber: user?.contactNumber,
      Email: user?.email,
      Followers: user?.followers ? user.followers.length : 0,
      Following: user?.following ? user.following.length : 0,
      Pic: user?.profilePic,
      Plan: user?.plan,
      likes: user?.likes,
      views: user?.views,
      totalPosts: user?.totalPosts,
    };
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Table columns={columns} data={data} />;
};

export default AllUsers;