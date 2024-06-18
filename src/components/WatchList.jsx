import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Watchlist = ({ userId }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // Fetch the user's watchlist when the component mounts
    axios.get(`/api/user/${userId}/watchlist`)
      .then(response => setWatchlist(response.data))
      .catch(error => console.error('Error fetching watchlist:', error));
  }, [userId]);

  const toggleWatchlist = (item) => {
    const isInWatchlist = watchlist.some(watchlistItem => watchlistItem.item_id === item.item_id);
    if (isInWatchlist) {
      axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.item_id } })
        .then(() => setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.item_id)))
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
      axios.post(`/api/user/${userId}/watchlist`, item)
        .then(() => setWatchlist(prev => [...prev, item]))
        .catch(error => console.error('Error adding to watchlist:', error));
    }
  };

  return (
    <div>
      <h2>Your Watchlist</h2>
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

/* <div id="watchlistTable">
//             <table className="table compact-table">
//   <thead id="tableHead">
//         <tr>
//           <th colSpan="1" style={{padding: '10px', textAlign: 'left', backgroundColor: '#262a2e'}} >
            
//           </th>
//         </tr>
//   </thead>      
//   <tbody>
//     <tr>
//       <th scope="row">Item name</th>
//     </tr>
//     <tr>
//       <th scope="row">Price</th>
//     </tr>
//     <tr> 
//       <th scope="row">placeholder</th>
//     </tr>
//   </tbody>
// </table>
//         </div>


//     )     */