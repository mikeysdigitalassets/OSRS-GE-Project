import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import Watchlist from './Watchlist'
import axios from 'axios';

const Results = ({ userId  }) => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [rerenderKey, setRerenderKey] = useState(0);
    
    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`/api/item/${itemId}`);
                setItemDetails(response.data);
            } catch (error) {
                console.error("Error fetching item details", error.message);
            }
        };
        fetchItemDetails();
    }, [itemId]);

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
        
    
        const isInWatchlist = watchlist.some((watchlistItem) => watchlistItem.item_id === item.id);
        if (isInWatchlist) {
          console.log('Removing item from watchlist:', item);
          try {
            await axios.delete(`/api/user/${userId}/watchlist`, { data: { itemId: item.id } });
            console.log('Item removed from watchlist');
            setWatchlist(prev => prev.filter(watchlistItem => watchlistItem.item_id !== item.id));
            fetchWatchlist();
          } catch (error) {
            console.error('Error removing from watchlist:', error);
          }
        } else {
          console.log('Adding item to watchlist:', item);
          try {
            await axios.post(`/api/user/${userId}/watchlist`, { itemId: item.id, itemName: item.name });
            console.log('Item added to watchlist');
            setWatchlist(prev => [...prev, { item_id: item.id, item_name: item.name }]); // Update the state with the correct structure
            
            fetchWatchlist();
          } catch (error) {
            console.error('Error adding to watchlist:', error);
          }
          
        }
        
      };
    
      const isInWatchlist = (item) => {
        return watchlist.some((watchlistItem) => watchlistItem.item_id === item.id); // Check against item_id
      };

      const triggerRerender = () => {
        setRerenderKey(prevKey => prevKey + 1);
      };

    return (
        <div  >
            <div className='tablechart'>
                {itemDetails ? (
                    <>
                        <Table key={rerenderKey} triggerRerender={triggerRerender} itemDetails={itemDetails} userId={userId} toggleWatchlist={toggleWatchlist} />
                        <ChartComponent itemDetails={itemDetails}  />
                    </>
                ) : (
                    <p>Loading item details...</p>
                )}
            </div>
            <div className='list-widget' key={rerenderKey}>
                {userId ? (
                    <Watchlist triggerRenderer={triggerRerender} userId={userId} showDetails={false} toggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                ) : (
                    <p>Loading watchlist...</p>
                )}
            </div>
        </div>
    );
};

export default Results;
