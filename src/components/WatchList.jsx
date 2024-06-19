import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div style={{backgroundColor: 'red'}}>
      <h2 style={{ color:'green'}}>Your Watchlist</h2>
      <ul>
        {watchlist.map(item => (
          <li key={item.item_id}>
            {item.item_name}
            <button onClick={() => toggleWatchlist(item)}>Toggle</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
