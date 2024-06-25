import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import Watchlist from "./Watchlist";
import axios from 'axios';

const Results = ({ userId }) => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(null);

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

    return (
        <div>
            <div className='tablechart'>
                {itemDetails ? (
                    <>
                        <Table itemDetails={itemDetails} userId={userId} />
                        <ChartComponent itemDetails={itemDetails}  />
                    </>
                ) : (
                    <p>Loading item details...</p>
                )}
            </div>
            <div className='list-widget'>
                {userId ? (
                    <Watchlist userId={userId} />
                ) : (
                    <p>Loading watchlist...</p>
                )}
            </div>
        </div>
    );
};

export default Results;
