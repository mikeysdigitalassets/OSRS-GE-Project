import React, { useState, useEffect } from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import { auth } from './firebase';
import { IconButton } from "@mui/material";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

const Table = ({ itemDetails, userId }) => {
  const [user, setUser] = useState(null);
  const [apiDetails, setApiDetails] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  const tax = 0.01;
  // const bond = {
  //   id: 13190,
  //   name: "Old school bond",
  //   lowalch: "N/A",
  //   highalch: "N/A",
  //   item_limit: 100,
  // };

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
    const fetchItemDetails = async (itemId) => {
      try {
        const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const itemData = result.data[itemId];
        setApiDetails(itemData);
      } catch (error) {
        console.error("Error fetching item details", error.message);
      }
    };
    if (itemDetails && itemDetails.id) {
      fetchItemDetails(itemDetails.id);
    } 
  }, [itemDetails]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/user/${userId}/watchlist`);
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
    console.log('Toggling watchlist for item:', item); // Debug log
    if (!userId) {
      console.error('User ID not provided');
      return;
    }

    const isInWatchlist = watchlist.some((watchlistItem) => watchlistItem.item_id === item.id);
    if (isInWatchlist) {
      console.log('Removing item from watchlist:', item);
      try {
        await axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.id } });
        console.log('Item removed from watchlist');
        setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.id));
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    } else {
      console.log('Adding item to watchlist:', item);
      try {
        await axios.post(`/api/user/${userId}/watchlist`, { itemId: item.id, itemName: item.name });
        console.log('Item added to watchlist');
        setWatchlist(prev => [...prev, { item_id: item.id, item_name: item.name }]); // Update the state with the correct structure
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
  };

  const isInWatchlist = (item) => {
    return watchlist.some((watchlistItem) => watchlistItem.item_id === item.id); // Check against item_id
  };

  

  return (
    <div id="tableMain">
      <table className="table compact-table">
        <thead id="tableHead">
          <tr>
            <th colSpan="4" style={{ padding: '10px', textAlign: 'left', backgroundColor: '#262a2e' }}>
              {user ? (
                <IconButton onClick={() => toggleWatchlist(itemDetails)}>
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
