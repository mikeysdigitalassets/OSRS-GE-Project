import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { auth } from './firebase';
import { IconButton } from "@mui/material";


const Watchlist = ({ userId, showDetails=true, triggerRenderer }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [apiDetails, setApiDetails] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  

  useEffect(() => {
    const fetchWatchList = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/user/${userId}/watchlist`);
          setWatchlist(response.data);
          
          response.data.forEach(async (item) => {
            const itemResponse = await axios.get(`/item/${item.item_id}`);
            const currentPrice = itemResponse.data.high;
            
            // Update previous prices
            setPreviousPrices(prevState => ({
              ...prevState,
              [item.item_id]: prevState[item.item_id] ? prevState[item.item_id] : currentPrice
            }));
            
            
            
            
            setApiDetails(prevState => ({
              ...prevState,
              [item.item_id]: itemResponse.data
            }))
          })
        } catch (error) {
          console.error('Error fetching watchlist', error);
        }
        
      }
    }

    fetchWatchList();

    const interval = setInterval(() => {
      fetchWatchList();
    }, 20000); // 60000 milliseconds = 1 minute

    // Clean up interval on component unmount.
    return () => clearInterval(interval);

  },[userId]);

  
  const toggleWatchlist = (item) => {
    
    const isInWatchlist = watchlist.some(watchlistItem => watchlistItem.item_id === item.item_id);
    if (isInWatchlist) {
      
      axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.item_id } })
        .then(() => {
          
          setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.item_id));
          fetchWatchList();
          
        })
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
      
      axios.post(`/api/user/${userId}/watchlist`, { itemId: item.item_id, itemName: item.item_name })
        .then(() => {
          
          setWatchlist(prev => [...prev, item]);
          fetchWatchList();
          
        })
        .catch(error => console.error('Error adding to watchlist:', error));
    }
    triggerRenderer();
  };

  //  console.log(apiDetails)
  
  const getChangeText = (itemId) => {
    if (!previousPrices[itemId] || !apiDetails[itemId]) {
      return null;
    }
    const previousPrice = previousPrices[itemId];
    const currentPrice = apiDetails[itemId].high;
    const change = currentPrice - previousPrice;
    
    return change > 0 ? `+${change}` : change;
    
    
  };

  

  return (
    <div className="watchlist">
      <h2 style={{ color: 'green' }}>Your Watchlist</h2>
      <table className="watchlist-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
           {showDetails && apiDetails ? (
              <>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Change</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Placeholder</th>
              </>
           ) : null }
          </tr>
        </thead>
        <tbody>
          {watchlist.map(item => (
            <tr key={item.item_id}>
              <td style={{ border: '1px solid #ccc', padding: '8px', display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(item);
                }}>
                  <StarIcon style={{ color: 'yellow' }} />
                </IconButton>
                <Link to={`/item/${item.item_id}`} style={{ color: 'black', textDecoration: 'underline', marginLeft: '8px' }}>
                  {item.item_name}
                </Link>
              </td>
              {showDetails && apiDetails[item.item_id] && (
                <>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id][item.item_id].high.toLocaleString()} gp
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {getChangeText([item.item_id])}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {/* Placeholder for future data */}
                  </td>
                </>
              )} 
                
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
    
  
};

export default Watchlist;




// const fetchWatchList = async () => {
//   if (userId) {
//     try {
//       const response = await axios.get(`/api/user/${userId}/watchlist`);
//       setWatchlist(response.data);
      
//       response.data.forEach(async (item) => {
//         const itemResponse = await axios.get(`/item/${item.item_id}`);
//         const currentPrice = itemResponse.data.high;
        
//         // Update previous prices
//         setPreviousPrices(prevState => ({
//           ...prevState,
//           [item.item_id]: prevState[item.item_id] ? prevState[item.item_id] : currentPrice
//         }));
        
        
        
        
//         setApiDetails(prevState => ({
//           ...prevState,
//           [item.item_id]: itemResponse.data
//         }))
//       })
//     } catch (error) {
//       console.error('Error fetching watchlist', error);
//     }
    
//   }
// }

// fetchWatchList();