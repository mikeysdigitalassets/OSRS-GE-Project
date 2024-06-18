import React, { useState, useEffect } from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { auth } from './firebase';
import { IconButton } from "@mui/material";

const Table = ({ itemDetails }) => {
  const [user, setUser] = useState(null);
  const [apiDetails, setApiDetails] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const tax = 0.01;
  const bond = {
    id: 13190,
    name: "Old school bond",
    lowalch: "N/A",
    highalch: "N/A",
    item_limit: 100,
  };

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
    } else {
      fetchItemDetails(13190);
    }
  }, [itemDetails]);

  const formatNumber = (value) => {
    const numberValue = parseInt(value, 10);
    return !isNaN(numberValue) ? numberValue.toLocaleString() : "N/A";
  };

  const toggleWatchlist = (item) => {
    console.log('Toggling watchlist for item:', item); // Debug log
    setWatchlist((prev) => {
      const isInWatchlist = prev.some((watchlistItem) => watchlistItem.id === item.id);
      if (isInWatchlist) {
        return prev.filter((watchlistItem) => watchlistItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  return (
    <div id="tableMain">
      <table className="table compact-table">
        <thead id="tableHead">
          <tr>
            <th colSpan="4" style={{ padding: '10px', textAlign: 'left', backgroundColor: '#262a2e' }}>
              {user ? (
                <IconButton onClick={() => toggleWatchlist(itemDetails || bond)}>
                <StarBorderOutlinedIcon  />
                </IconButton> 
              ) : null}
              {itemDetails ? itemDetails.name : bond.name}
              <span id="tableId" style={{ fontSize: 14 }}>
                ID:{itemDetails ? itemDetails.id : bond.id}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Buy price:</th>
            <td>{apiDetails ? apiDetails.high.toLocaleString() + " coins" : "g"}</td>
            <td>Item limit:</td>
            <td>{itemDetails ? itemDetails.item_limit : bond.item_limit}</td>
          </tr>
          <tr>
            <th scope="row">Sell price:</th>
            <td>{apiDetails ? apiDetails.low.toLocaleString() + " coins" : 'loading...'}</td>
            <td>High alch value:</td>
            <td>{formatNumber(itemDetails ? itemDetails.highalch : bond.highalch)}</td>
          </tr>
          <tr>
            <th scope="row">Tax:</th>
            <td>{apiDetails ? (apiDetails.low * tax).toLocaleString() + " coins" : "loading..."}</td>
            <td>Low alch value:</td>
            <td>{formatNumber(itemDetails ? itemDetails.lowalch : bond.lowalch)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
