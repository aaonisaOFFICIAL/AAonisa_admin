import { db } from 'Config';
import Table from '../Tables/Tables';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const AllVideos = () => {
  const [users, setUsers] = useState([]);
  const [demo, setDemo] = useState([]);
  const [form, setForm] = useState('');
  const [to, setTo] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const usersCollection = collection(db, 'videos');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setUsers(usersData);
      setDemo(usersData);

      setData(usersData.map(data => ({
        username: data.username,
        shareCount: data.shareCount,
        Followers: data.likes.length,
        Following: data.dislike.length,
        Pic: data.thumbnail,
        commentCount: data.commentCount,
        views: data.views,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { Header: 'Username', accessor: 'username' },
    { Header: 'Share Count', accessor: 'shareCount' },
    { Header: 'Likes', accessor: 'Followers' },
    { Header: 'Dislikes', accessor: 'Following' },
    { Header: 'Profile Pic', accessor: 'Pic' },
    { Header: 'Comment Count', accessor: 'commentCount' },
    { Header: 'Views', accessor: 'views' },
  ];

  const handleDateSearch = async () => {
    try {
      const fromDateTimestamp = new Date(form).getTime();
      const toDateTimestamp = new Date(to).getTime();
      const usersCollection = collection(db, 'videos');
      const dateQuery = query(
        usersCollection,
        where('date', '>=', new Date(fromDateTimestamp)),
        where('date', '<=', new Date(toDateTimestamp))
      );
      const usersSnapshot = await getDocs(dateQuery);
      const filteredData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setData(filteredData.map(data => ({
        username: data.username,
        shareCount: data.shareCount,
        Followers: data.likes.length,
        Following: data.dislike.length,
        Pic: data.thumbnail,
        commentCount: data.commentCount,
        views: data.views,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleHashtagSearch = async (event) => {
    const value = event.target.value;
    setHashtag(value);
    if (value === "") {
      setData(demo);
    } else {
      try {
        const usersCollection = collection(db, 'videos');
        const hashtagQuery = query(usersCollection, where('hashtags', 'array-any-contains', value));
        const usersSnapshot = await getDocs(hashtagQuery);
        const filteredData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
console.log(filteredData)
        setData(filteredData.map(data => ({
          username: data.username,
          shareCount: data.shareCount,
          Followers: data.likes.length,
          Following: data.dislike.length,
          Pic: data.thumbnail,
          commentCount: data.commentCount,
          views: data.views,
        })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div style={{ marginTop: '100px', display: 'inline-flex' }}>
        <input onChange={(e) => setForm(e.target.value)} type='date' />
        <div style={{ width: '100px', textAlign: 'center', fontWeight: 'bold' }}>To</div>
        <input onChange={(e) => setTo(e.target.value)} type='date' />
        <div onClick={handleDateSearch} style={{ width: '150px', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', marginLeft: '10px' }}>Search by Date</div>
      </div>
      <div style={{ marginTop: '20px', display: 'inline-flex' }}>
        <input onChange={handleHashtagSearch} type='text' placeholder='Search By Hashtag' style={{ marginRight: '10px' }} />
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
};

export default AllVideos;
