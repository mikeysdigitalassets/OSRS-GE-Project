import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HighVolume = ({ userId }) => {
    const [allItems, setAllItems] = useState([]);
    const [itemDetails, setItemDetails] = useState({});
    const [sortedVolume, setSortedVolume] = useState([]);

    axios.defaults.baseURL = 'http://my-backend-env.eba-tqzpmtwd.us-east-1.elasticbeanstalk.com';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllItems();
            await fetchVolume();
        };

        fetchData();
    }, []);

    const fetchAllItems = async () => {
        try {
            const response = await axios.get('/api/allitems');
            const allItems = response.data;
            setAllItems(allItems);
        } catch (error) {
            console.error('Error fetching all items', error);
        }
    };

    const fetchVolume = async () => {
        try {
            const response = await axios.get('/volume');
            const data = response.data;

            const volumeArray = Object.entries(data);
            volumeArray.sort((a, b) => b[1] - a[1]);

            // limit to 25 items
            const topVolumeArray = volumeArray.slice(0, 25);
            setSortedVolume(topVolumeArray);

            console.log('Top volume array:', topVolumeArray);

            // fetch the details for only the 25 items the fetch array grabs
            await fetchTopItemDetails(topVolumeArray);
        } catch (error) {
            console.error("Error fetching Volume data", error);
        }
    };

    const fetchTopItemDetails = async (topVolumeArray) => {
        try {
            const details = await Promise.all(topVolumeArray.map(async ([itemId]) => {
                console.log(`Fetching details for item ID: ${itemId}`);
                const response = await axios.get(`/item/${itemId}`);
                console.log(`Details for item ID ${itemId}:`, response.data);
                return { id: itemId, ...response.data[itemId] };
            }));
            // Convert to array to make it easy for me to understand data
            const detailsObject = details.reduce((acc, detail) => {
                acc[detail.id] = detail;
                return acc;
            }, {});
            setItemDetails(detailsObject);
        } catch (error) {
            console.error('Error fetching item details', error);
        }
    };

    return (
        <div>
            <div style={{ color: 'white', position: 'absolute', left: '30%' }}>
                <h1>&#128293; Highest volume items &#128293;</h1>
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
                            <th style={{ border: '1px solid #ccc', padding: '1px' }}>Daily Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedVolume.map(([itemId, volume]) => {
                            const itemDetail = itemDetails[itemId];
                            const allItemDetail = allItems.find(item => item.id == itemId);
                            
                            return (
                                <tr key={itemId}>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail && <img src={`https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images/${itemId}.png`} alt={`Item ${itemId}`} />}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail ? (
                                            <Link to={`/item/${itemId}`} style={{ color: '#e4daa2', textDecoration: 'none' }}>
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
                                        {itemDetail && itemDetail.high !== undefined ? itemDetail.high.toLocaleString() : "Loading..."} gp
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {itemDetail && itemDetail.low !== undefined ? itemDetail.low.toLocaleString() : "Loading..."} gp
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {allItemDetail && allItemDetail.item_limit !== undefined ? allItemDetail.item_limit.toLocaleString() : "Loading..."}
                                    </td>
                                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {volume.toLocaleString()}
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

export default HighVolume;
