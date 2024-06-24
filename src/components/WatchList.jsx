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
      
      axios.get(`/api/user/${userId}/watchlist`)
        .then(response => {
          
          setWatchlist(response.data);
        })
        .catch(error => console.error('Error fetching watchlist:', error));
    }
  }, [userId]);

  const toggleWatchlist = (item) => {
    
    const isInWatchlist = watchlist.some(watchlistItem => watchlistItem.item_id === item.item_id);
    if (isInWatchlist) {
      
      axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.item_id } })
        .then(() => {
          
          setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.item_id));
        })
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
      
      axios.post(`/api/user/${userId}/watchlist`, { itemId: item.item_id, itemName: item.item_name })
        .then(() => {
          
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
