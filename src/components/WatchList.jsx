import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { auth } from './firebase';
import { IconButton } from "@mui/material";
import Table from './Table';

const Watchlist = ({ userId }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (userId) {
      console.log('Fetching watchlist for user:', userId);
      axios.get(`/api/user/${userId}/watchlist`)
        .then(response => {
          console.log('Watchlist fetched:', response.data);
          setWatchlist(response.data);
        })
        .catch(error => console.error('Error fetching watchlist:', error));
    }
  }, [userId]);

  const toggleWatchlist = (item) => {
    console.log('Toggling watchlist for item:', item);
    const isInWatchlist = watchlist.some(watchlistItem => watchlistItem.item_id === item.item_id);
    if (isInWatchlist) {
      console.log('Removing item from watchlist:', item);
      axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.item_id } })
        .then(() => {
          console.log('Item removed from watchlist');
          setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.item_id));
        })
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
      console.log('Adding item to watchlist:', item);
      axios.post(`/api/user/${userId}/watchlist`, { itemId: item.item_id, itemName: item.item_name })
        .then(() => {
          console.log('Item added to watchlist');
          setWatchlist(prev => [...prev, item]);
        })
        .catch(error => console.error('Error adding to watchlist:', error));
    }
  };

  return (
    <div style={{backgroundColor: 'black'}}>
      <h2 style={{ color:'green'}}>Your Watchlist</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
  {watchlist.map(item => (
    <li key={item.item_id} style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={(e) => {
        e.stopPropagation();
        toggleWatchlist(item);
      }}>
        <StarIcon style={{ color: 'yellow' }} />
      </IconButton>
      <Link to={`/item/${item.item_id}`} style={{ color: 'white', textDecoration: 'underline', marginLeft: '8px' }}>
        <span style={{ color: 'white' }}>{item.item_name}</span>
      </Link>
    </li>
  ))}
</ul>

    </div>
  );
};

export default Watchlist;
