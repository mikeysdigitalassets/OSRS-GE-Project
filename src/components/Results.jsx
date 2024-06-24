import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "./Table";
import ChartComponent from "./ChartComponent";
import Watchlist from "./Watchlist";
import axios from 'axios';

const Results = ({ userId, itemDetails }) => {
    

    // useEffect(() => {
    //     const fetchItemDetails = async (itemId) => {
    //       try {
    //         const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);
    //         if (!response.ok) {
    //           throw new Error("Network response was not ok");
    //         }
    //         const result = await response.json();
    //         const itemData = result.data[itemId];
            
    //       } catch (error) {
    //         console.error("Error fetching item details", error.message);
    //       }
    //     };
    //     if (itemDetails && itemDetails.id) {
    //       fetchItemDetails(itemDetails.id);
    //     } 
        
    //   }, [itemDetails]);
    

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
