import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { auth } from './firebase';
import { IconButton } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const Watchlist = ({ userId, showDetails=true, triggerRenderer }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [apiDetails, setApiDetails] = useState({});
  const [previousPrices, setPreviousPrices] = useState({});
  

  useEffect(() => {
    fetchWatchList();
  }, [userId]);
    
  const fetchWatchList = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`);
          setWatchlist(response.data);
          
          response.data.forEach(async (item) => {
            const itemResponse = await axios.get(`${process.env.REACT_APP_API_URL}/extra/${item.item_id}`);
            const data = itemResponse.data.data
            
            
            
            
            
            
            
            
            setApiDetails(prevState => ({
              ...prevState,
              [item.item_id]: data
            }))
            
          })
        } catch (error) {
          console.error('Error fetching watchlist', error);
        }
        
      }
      const interval = setInterval(() => {
        fetchWatchList();
      }, 60000); // 60000 milliseconds is 1 min
  
      
      return () => clearInterval(interval);
    }

    

    

  

  
  const toggleWatchlist = (item) => {
    
    const isInWatchlist = watchlist.some(watchlistItem => watchlistItem.item_id === item.item_id);
    if (isInWatchlist) {
      
      axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`, { data: { itemId: item.item_id } })
        .then(() => {
          notify('Item removed Watchlist!', 'success');
          setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.item_id));
          fetchWatchList();
          
        })
        .catch(error => console.error('Error removing from watchlist:', error));
    } else {
      
      axios.post(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`, { itemId: item.item_id, itemName: item.item_name })
        .then(() => {
          {!showDetails &&
          notify('Item added to Watchlist!', 'success');
          }
          setWatchlist(prev => [...prev, item]);
          fetchWatchList();
          
        })
        .catch(error => console.error('Error adding to watchlist:', error));
    }
    {!showDetails ?
    triggerRenderer() 
    : fetchWatchList()}
  };

  const notify = (message, type) => {
    toast(message, { type, autoClose: 5000 });

  };
 


  

  return (
    <div className="watchlist">
      <div>
      <h2 style={{ color: '#90ee90', display: 'flex', justifyContent: 'center' }}>Your Watchlist</h2>
      </div>
      <div>
      <p style={{ color: 'orange', display: 'flex', justifyContent: 'center' }}>Price info auto-updates every 60 seconds</p>
      </div>
      <table className="watchlist-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
           {showDetails && apiDetails ? (
              <>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Item</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Price</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buying price</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Selling price</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Profit (including tax)</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buy amount ( 1 Hour)</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Sell amount (1 Hour)</th>
            <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buy/Sell ratio</th>
            <th style={{ color: 'white', border: '3px solid ', padding: '8px', borderColor: '#add8e6' }}>Track</th>
            
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
                <Link to={`${process.env.REACT_APP_API_URL}/item/${item.item_id}`} style={{ color: '#e4daa2', textDecoration: 'underline', marginLeft: '8px' }}>
                  {item.item_name}
                </Link>
              </td>
              {showDetails && apiDetails[item.item_id] && (
                <>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].overall.toLocaleString()} gp
                  </td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].buying.toLocaleString()} gp
                  </td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].selling.toLocaleString()} gp
                  </td>
                  
                  { apiDetails[item.item_id].approxProfit > 0 ? (
                  <td style={{ color: 'green', border: '1px solid #ccc', padding: '8px' }}>
                    +{apiDetails[item.item_id].approxProfit.toLocaleString()} gp  
                  </td> ) : ( <td style={{ color: 'red', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].approxProfit.toLocaleString()} gp  
                  </td> )}
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].buyingQuantity.toLocaleString()} 
                  </td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].sellingQuantity.toLocaleString()} 
                  </td>
                  
                  { apiDetails[item.item_id].buySellRatio >= 1 ? (
                  <td style={{ color: 'green', border: '1px solid #ccc', padding: '8px' }}>
                    {apiDetails[item.item_id].buySellRatio.toLocaleString()} 
                    </td> ) : ( <td style={{ color: 'red', border: '1px solid #ccc', padding: '8px' }}>
                  {apiDetails[item.item_id].buySellRatio.toLocaleString()}  
                  </td> )}
                  <td style={{ color: 'white', border: '3px solid ', padding: '8px', borderColor: '#add8e6' }}>
                      <Link to={`${process.env.REACT_APP_API_URL}/tracker?itemId=${item.item_id}&itemName=${encodeURIComponent(item.item_name)}`}>
                          <img style={{ height: '40px', width: '40px', display: 'flex', justifyContent: 'center' }} src={require('../images/pl.png')} />
                      </Link> 
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

