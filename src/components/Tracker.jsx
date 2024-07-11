import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { IconButton } from "@mui/material";
import Search from "./Search";

const Tracker = ({ userId }) => {
    
    // useEffect(() => {
    //     const fetchTrackList = async () => {
    //       if (userId) {
    //         try {
    //           const response = await axios.get(`/api/user/${userId}/watchlist`);
    //           setWatchlist(response.data);
              
    //           response.data.forEach(async (item) => {
    //             const itemResponse = await axios.get(`/extra/${item.item_id}`);
    //             const data = itemResponse.data.data
                
                
                
                
                
                
                
                
    //             setApiDetails(prevState => ({
    //               ...prevState,
    //               [item.item_id]: data
    //             }))
                
    //           })
    //         } catch (error) {
    //           console.error('Error fetching watchlist', error);
    //         }
            
    //       }
    //     }
    
    //     fetchWatchList();
    
    //     const interval = setInterval(() => {
    //       fetchWatchList();
    //     }, 60000); // 60000 milliseconds = 1 minute
    
        
    //     return () => clearInterval(interval);
    
    //   },[userId]);
    
    
    
    
    
    const handleItemSelect = (suggestion) => {
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        if (onItemSelected) {
          onItemSelected(suggestion);
        }
        // Navigate to the main content route and pass the selected item as state
        navigate(`/item/${suggestion.id}`);
      };

  return (
    <div>
      <div>
          <h2 style={{ color: '#90ee90', display: 'flex', justifyContent: 'center' }}>P/L tracker</h2>
        </div>
        <div>
          <p style={{ color: 'orange', display: 'flex', justifyContent: 'center' }}>lorem ipsum</p>
        </div>
      <div>
        <form className="tracker-search" style={{ width: '50%' }} >
          <Search onItemSelected={handleItemSelect} />
        </form>
      </div>
      <div className="Tracker-list">
        
        
        <table className="Tracker-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Item</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Price</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buying price</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Selling price</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Profit (including tax)</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buy amount ( 1 Hour)</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Sell amount (1 Hour)</th>
              <th style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>Buy/Sell ratio</th>
              <th style={{ color: 'white', border: '3px solid ', padding: '8px', borderColor: '#add8e6' }}>Track</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px', display: 'flex', alignItems: 'center' }}>
                {/* <IconButton onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(item);
                }}>
                  <StarIcon style={{ color: 'yellow' }} />
                </IconButton> */}
                <Link style={{ color: '#e4daa2', textDecoration: 'underline', marginLeft: '8px' }}>
                  lorem ipsum
                </Link>
              </td>
              <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>gp</td>
              <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>gp</td>
              <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>gp</td>
              <td style={{ color: 'green', border: '1px solid #ccc', padding: '8px' }}>gp</td>
              <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>lorum ipsum</td>
              <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>lorem ipsum</td>
              <td style={{ color: 'green', border: '1px solid #ccc', padding: '8px' }}>lorem ipsum</td>
              <td style={{ color: 'white', border: '3px solid ', padding: '8px', borderColor: '#add8e6' }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracker;
