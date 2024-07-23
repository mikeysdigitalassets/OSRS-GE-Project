import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import Watchlist from './Watchlist'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

const Results = ({ userId  }) => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);
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

    

      const triggerRerender = () => {
        setRerenderKey(prevKey => prevKey + 1);
      };

      const notify = (message, type) => {
        toast(message, { type, autoClose: 5000 });
    
      };

    return (
        <div  >
            <ToastContainer />
            <div className='tablechart'>
                {itemDetails ? (
                    <>
                        <Table key={rerenderKey} triggerRerender={triggerRerender} itemDetails={itemDetails} userId={userId}  />
                        <ChartComponent itemDetails={itemDetails}  />
                    </>
                ) : (
                    <p>Loading item details...</p>
                )}
            </div>
            <div className='list-widget' key={rerenderKey}>
                {userId ? (
                    <Watchlist triggerRenderer={triggerRerender} userId={userId} showDetails={false}/>
                ) : (
                    <p>Loading watchlist...</p>
                )}
            </div>
        </div>
    );
};

export default Results;
