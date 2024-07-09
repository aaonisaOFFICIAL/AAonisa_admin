import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'Config';
import Table from '../Tables/Tables';
import './AllVideos.css'; // Import the CSS file
const AllVideos = () => {
  const [users, setUsers] = useState([]);
  const [demo, setDemo] = useState([]);
  const [form, setForm] = useState('');
  const [to, setTo] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const usersCollection = collection(db, 'videos');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
console.log(usersData,"---------_>")
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
        view: data.videoUrl,
        Hashtag: data.hashtags
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleClick = (e) => {
    window.open(e, '_blank');
  };

  const columns = [
    { Header: 'S.No', accessor: 'sno', Cell: ({ row }) => row.index + 1 },
    { Header: 'Username', accessor: 'username' },
    // { Header: 'Share Count', accessor: 'shareCount' },
    { Header: 'Likes', accessor: 'Followers' },
    { Header: 'Dislikes', accessor: 'Following' },
    { Header: 'Hashtags', accessor: 'Hashtag',     Cell: ({ value }) => (
      <div className="hashtag-cell">
        {value ? value.join(',') : ''}
      </div>
    ) },
    // { Header: 'Profile Pic', accessor: 'Pic' },
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
        view: data.videoUrl, // Ensure videoUrl is included
      })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleHashtagSearch = async (value) => {
    setHashtag(value);
    if (value === "") {
      setData(demo);
    } else {
      try {
        const usersCollection = collection(db, 'videos');
        const hashtagQuery = query(usersCollection, where('hashtags', 'array-contains', value));
        const usersSnapshot = await getDocs(hashtagQuery);
        const filteredData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setData(filteredData.map(data => ({
          username: data.username,
          shareCount: data.shareCount,
          Followers: data.likes.length,
          Following: data.dislike.length,
          Pic: data.thumbnail,
          commentCount: data.commentCount,
          views: data.views,
          view: data.videoUrl, // Ensure videoUrl is included
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
    value: hashtag,
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
      <Table columns={columns} data={data} />
    </div>
  );
};

export default AllVideos;
