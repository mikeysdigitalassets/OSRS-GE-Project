import React, { useState, useEffect } from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { auth } from './firebase';
import { IconButton } from "@mui/material";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// axios.defaults.baseURL = 'http://localhost:3000';
 axios.defaults.withCredentials = true;

const Table = ({ itemDetails, userId, triggerRerender }) => {
  const [user, setUser] = useState(null);
  const [apiDetails, setApiDetails] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  const tax = 0.01;
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItemApiDetails = async () => {
      try {
        const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemDetails.id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const itemData = result.data[itemDetails.id];
        setApiDetails(itemData);
      } catch (error) {
        console.error("Error fetching item details", error.message);
      }
    };
    if (itemDetails) {
      fetchItemApiDetails();
    }
  }, [itemDetails]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`);
          setWatchlist(response.data);
        } catch (error) {
          console.error("Error fetching watchlist:", error);
        }
      }
    };

    fetchWatchlist();
  }, [userId]);

  const formatNumber = (value) => {
    const numberValue = parseInt(value, 10);
    return !isNaN(numberValue) ? numberValue.toLocaleString() : "N/A";
  };

  const toggleWatchlist = async (item) => {
    

    const isInWatchlist = watchlist.some((watchlistItem) => watchlistItem.item_id === item.id);
    if (isInWatchlist) {
      console.log('Removing item from watchlist:', item);
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`, { data: { itemId: item.id } });
        console.log('Item removed from watchlist');
        setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.id));
        notify('Item removed from Watchlist!', 'success');
        fetchWatchlist();
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    } else {
      console.log('Adding item to watchlist:', item);
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/user/${userId}/watchlist`, { itemId: item.id, itemName: item.name });
        console.log('Item added to watchlist');
        setWatchlist(prev => [...prev, { item_id: item.id, item_name: item.name }]); 
        notify('Item added to Watchlist!', 'success');
        fetchWatchlist();
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
      
    }
    triggerRerender();
  };


  
  const isInWatchlist = (item) => {
    return watchlist.some((watchlistItem) => watchlistItem.item_id === item.id); 
  };

  const notify = (message, type) => {
    toast(message, { type, autoClose: 5000 });

  };

  return (
    <div id="tableMain">
      <table className="table compact-table">
        <thead id="tableHead">
          <tr>
            <th colSpan="4" style={{ padding: '10px', textAlign: 'left', backgroundColor: '#262a2e' }}>
              {user ? (
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(itemDetails)}}>
                  {isInWatchlist(itemDetails) ? (
                    <StarIcon style={{ color: 'yellow' }} />
                  ) : (
                    <StarBorderOutlinedIcon />
                  )}
                </IconButton>
              ) : null}
              {itemDetails && itemDetails.name}
              <span id="tableId" style={{ fontSize: 14 }}>
                ID: {itemDetails && itemDetails.id}
                
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Buy price:</th>
            <td>{apiDetails ? apiDetails.high.toLocaleString() + " coins" : "loading..."}</td>
            <td>Item limit:</td>
            <td>{itemDetails ? itemDetails.item_limit : "loading..."}</td>
          </tr>
          <tr>
            <th scope="row">Sell price:</th>
            <td>{apiDetails ? apiDetails.low.toLocaleString() + " coins" : 'loading...'}</td>
            <td>High alch value:</td>
            <td>{itemDetails ? formatNumber(itemDetails.highalch) : "loading..."}</td>
          </tr>
          <tr>
            <th scope="row">Tax:</th>
            <td>{apiDetails ? (apiDetails.low * tax).toLocaleString() + " coins" : "loading..."}</td>
            <td>Low alch value:</td>
            <td>{formatNumber(itemDetails && itemDetails.lowalch)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
