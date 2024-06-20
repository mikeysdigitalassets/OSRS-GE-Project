import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import Watchlist from "./Watchlist";
import axios from 'axios';

const Results = ({ userId, itemDetails: initialItemDetails }) => {
    const { itemId } = useParams();
    const [itemDetails, setItemDetails] = useState(initialItemDetails);

    useEffect(() => {
        const fetchItemDetails = async () => {
            console.log("Fetching item details for itemId:", itemId); // Debugging log
            try {
                const response = await axios.get(`/item/${itemId}`);
                console.log("Item details fetched:", response.data); // Debugging log
                setItemDetails(response.data);
            } catch (error) {
                console.error("Error fetching item details", error);
            }
        };
        if (!initialItemDetails || initialItemDetails.id !== itemId) {
            fetchItemDetails();
        }
    }, [itemId]);

    useEffect(() => {
        if (initialItemDetails) {
            console.log("Initial item details:", initialItemDetails); // Debugging log
            setItemDetails(initialItemDetails);
        }
    }, [initialItemDetails]);

    console.log("Current item details in Results:", itemDetails); // Debugging log

    return (
        <div>
            <div className='tablechart'>
                {itemDetails ? (
                    <>
                        <Table itemDetails={itemDetails} userId={userId} />
                        <ChartComponent itemDetails={itemDetails} />
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
