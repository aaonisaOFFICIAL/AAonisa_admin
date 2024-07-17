import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'Config';
import Table from '../Tables/Tables';
import './AllVideos.css'; // Import the CSS file

const AllVideos = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [form, setForm] = useState('');
  const [to, setTo] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [demo, setDemo] = useState([]);

  const getUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    }
  };

  const getVideos = async () => {
    try {
      const videosCollection = collection(db, 'videos');
      const videosSnapshot = await getDocs(videosCollection);
      const videosData = videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVideos(videosData);
      setDemo(videosData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
    getVideos();
  }, []);

  useEffect(() => {
    const mergeData = () => {
      const data = videos.map(video => {
        const user = users.find(user => user.uid === video.uid) || {};
        return {
          ...video,
          username: video.username,
          mobileNumber: user.contactNumber || 'N/A', // Adding mobileNumber from users collection
          Followers: video.likes.length,
          Following: video.dislike.length,
          Pic: video.thumbnail,
          commentCount: video.commentCount,
          views: video.views,
          view: video.videoUrl,
          Hashtag: video.hashtags
        };
      });
      setMergedData(data);
      setDemo(data);
    };
    mergeData();
  }, [users, videos]);

  const handleClick = (e) => {
    window.open(e, '_blank');
  };

  const columns = [
    { Header: 'S.No', accessor: 'sno', Cell: ({ row }) => row.index + 1 },
    { Header: 'Username', accessor: 'username' },
    { Header: 'Mobile Number', accessor: 'mobileNumber' },
    { Header: 'Likes', accessor: 'Followers' },
    { Header: 'Dislikes', accessor: 'Following' },
    { Header: 'Hashtags', accessor: 'Hashtag', Cell: ({ value }) => (
      <div className="hashtag-cell">
        {value ? value.join(',') : ''}
      </div>
    ) },
    { Header: 'Comment Count', accessor: 'commentCount' },
    { Header: 'Views', accessor: 'views' },
    { Header: 'Video Url', accessor: 'view', Cell: ({ row }) => (
      <span
        style={{ cursor: 'pointer', color: 'blue' }}
        onClick={() => window.open(row.original.view, '_blank')}
      >
        View
      </span>
    ) },
  ];

  const handleDateSearch = async () => {
    try {
      const fromDateTimestamp = new Date(form).getTime();
      const toDateTimestamp = new Date(to).getTime();
      const videosCollection = collection(db, 'videos');
      const dateQuery = query(
        videosCollection,
        where('date', '>=', new Date(fromDateTimestamp)),
        where('date', '<=', new Date(toDateTimestamp))
      );
      const videosSnapshot = await getDocs(dateQuery);
      const filteredData = videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMergedData(filteredData.map(data => ({
        username: data.username,
        mobileNumber: users.find(user => user.uid === data.uid)?.mobileNumber || 'N/A',
        Followers: data.likes.length,
        Following: data.dislike.length,
        Pic: data.thumbnail,
        commentCount: data.commentCount,
        views: data.views,
        view: data.videoUrl, // Ensure videoUrl is included
        Hashtag: data.hashtags
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleHashtagSearch = async (value) => {
    setHashtag(value);
    if (value === "") {
      setMergedData(demo);
    } else {
      try {
        const videosCollection = collection(db, 'videos');
        const hashtagQuery = query(videosCollection, where('hashtags', 'array-contains', value));
        const videosSnapshot = await getDocs(hashtagQuery);
        const filteredData = videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMergedData(filteredData.map(data => ({
          username: data.username,
          mobileNumber: users.find(user => user.uid === data.uid)?.mobileNumber || 'N/A',
          Followers: data.likes.length,
          Following: data.dislike.length,
          Pic: data.thumbnail,
          commentCount: data.commentCount,
          views: data.views,
          view: data.videoUrl, // Ensure videoUrl is included
          Hashtag: data.hashtags
        })));
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Autosuggest logic
  const onSuggestionsFetchRequested = ({ value }) => {
    const filteredSuggestions = demo
      .flatMap(data => data.hashtags)
      .filter((hashtag, index, self) => hashtag.toLowerCase().includes(value.toLowerCase()) && self.indexOf(hashtag) === index);

    setSuggestions(filteredSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion}
    </div>
  );

  const onSuggestionSelected = (event, { suggestion }) => {
    handleHashtagSearch(suggestion);
  };

  const inputProps = {
    placeholder: 'Search By Hashtag',
    value: hashtag.trim() || '',
    onChange: (event, { newValue }) => {
      setHashtag(newValue);
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
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={inputProps}
          theme={{
            container: 'autosuggest__container',
            suggestionsContainerOpen: 'autosuggest__suggestions-container--open',
            suggestionsList: 'autosuggest__suggestions-list',
            suggestion: 'autosuggest__suggestion',
            suggestionHighlighted: 'autosuggest__suggestion--highlighted'
          }}
        />
      </div>
      <Table columns={columns} data={mergedData} />
    </div>
  );
};

export default AllVideos;
