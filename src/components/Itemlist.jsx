import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Itemlist = ({userId}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [itemDetails, setItemDetails] = useState([]);
  const [pageRange, setPageRange] = useState([1, 2, 3]);
 
  
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
  
  

  useEffect(() => {
    fetchItems();
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/allitems');
      const data = await response.json();
      setItemDetails(data);
    } catch (error) {
      console.error("Error fetching item details", error.message);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/latest');
      const itemIds = Object.keys(response.data.data);
      setTotalItems(itemIds.length);
      setItems(itemIds.map(id => ({ id, ...response.data.data[id] })));
    } catch (error) {
      console.error('Error fetching items', error);
    }
  };

  
  

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updatePageRange(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1); // Reset to first page when limit changes
    updatePageRange(1);
  };

  const updatePageRange = (currentPage) => {
    const totalPages = Math.ceil(totalItems / limit);
    if (totalPages <= 3) {
      setPageRange([1, 2, 3].slice(0, totalPages));
    } else {
      if (currentPage <= 3) {
        setPageRange([1, 2, 3]);
      } else if (currentPage + 2 >= totalPages) {
        setPageRange([totalPages - 2, totalPages - 1, totalPages]);
      } else {
        setPageRange([currentPage - 1, currentPage, currentPage + 1]);
      }
    }
  };

  const paginatedItems = items.slice((page - 1) * limit, page * limit);

  return (
    <div >
      <div className="table-container-list">
        <table className="items-table">
          <thead>
            <tr>
            <th  style={{ border: '1px solid #ccc', padding: '1px' }}>icon</th>
              <th style={{ border: '1px solid #ccc', padding: '1px'  }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '1px'  }}>Members</th>
              <th style={{ border: '1px solid #ccc', padding: '1px' }}>High</th>
              <th style={{ border: '1px solid #ccc', padding: '1px' }}>Low</th>
              <th style={{ border: '1px solid #ccc', padding: '1px' }}>buy limit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(item => {
              const itemDetail = Array.isArray(itemDetails) ? itemDetails.find(detail => detail.id == item.id) : {};
              return (
                <tr key={item.id}>
                  <td style={{ color: '', border: '1px solid #ccc', padding: '8px' }}><img src={`https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images/${item.id}.png`}/></td>
                  <td style={{ color: '#e4daa2', border: '1px solid #ccc', padding: '8px', margin: '0px' }}>
                  {itemDetail ? (
                   <Link to={`/item/${item.id}`} style={{ color: '#e4daa2', margin: '0px', textDecoration: 'none' }} >  
                   {itemDetail.name}
                   </Link>
                  ) : <p>Loading...</p>}
                  </td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>{itemDetail && itemDetail.members ? <p>Yes</p> : <p>No</p>}</td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>{item.high.toLocaleString()} gp</td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>{item.low.toLocaleString()} gp</td>
                  <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>{itemDetail ? itemDetail.item_limit.toLocaleString() : "loading..."}</td>
                </tr>
                
              );
            })}
          </tbody>
        </table>
        </div>
        <div className="page-select">
          {pageRange.map(p => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              disabled={page === p}
            >
              {p}
            </button>
          ))}
          {pageRange[pageRange.length - 1] < Math.ceil(totalItems / limit) && (
            <button onClick={() => handlePageChange(pageRange[pageRange.length - 1] + 1)}>...</button>
          )}
        
        
      </div>
      <label className="item-limit">
          Items per page:
          <select value={limit} onChange={handleLimitChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </label>
    </div>
  );
};

export default Itemlist;
