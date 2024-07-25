import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HighestPrice = ({ userId }) => {
    const [allItems, setAllItems] = useState([]);
    const [itemDetails, setItemDetails] = useState([]);
    const [sortedHighPrice, setSortedHighPrice] = useState([]);

    // axios.defaults.baseURL = 'http://localhost:3000';
    // axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllItems();
            await fetchItemDetails();
        };

        fetchData();
    }, []);

    const fetchAllItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/allitems`);
            const allItems = response.data;
            setAllItems(allItems);
        } catch (error) {
            console.error('Error fetching all items', error);
        }
    };

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/latest`);
            const data = response.data.data; 

            // convert to array
            const sortedArray = Object.entries(data)
                .map(([itemId, details]) => ({ itemId, ...details }))
                .sort((a, b) => b.high - a.high)
                .slice(0, 25);

            

            setItemDetails(sortedArray);
            setSortedHighPrice(sortedArray.map(item => [item.itemId, item.high]));
        } catch (error) {
            console.error('Error fetching item details', error);
        }
    };

    return (
        <div>
            <div style={{ color: 'white', position: 'absolute', left: '30%' }}>
                <h1>&#128176; Highest priced items &#128176;</h1>
            </div>
            <div className="table-container-list">
                <table className="items-table">
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Icon</th>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Members</th>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>High</th>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Low</th>
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Buy Limit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHighPrice.map(([itemId, highPrice]) => {
                            const itemDetail = itemDetails.find(item => item.itemId == itemId);
                            const allItemDetail = allItems.find(item => item.id == itemId);
                            

                         

                            return (
                                <tr key={itemId}>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail && <img src={`https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images/${itemId}.png`} alt={`Item ${itemId}`} />}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail ? (
                                            <Link to={`${process.env.REACT_APP_API_URL}/item/${itemId}`} style={{ color: '#e4daa2', textDecoration: 'none' }}>
                                                {allItemDetail.name}
                                            </Link>
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail ? (allItemDetail.members ? <p>Yes</p> : <p>No</p>) : <p>Loading...</p>}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {itemDetail && itemDetail.high !== undefined && itemDetail.high !== null ? itemDetail.high.toLocaleString() : "Loading..."} gp
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {itemDetail && itemDetail.low !== undefined && itemDetail.low !== null ? itemDetail.low.toLocaleString() : "Loading..."} gp
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail && allItemDetail.item_limit ? allItemDetail.item_limit.toLocaleString() : "unknown"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HighestPrice;
