import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTable, useColumnOrder } from 'react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import debounce from 'lodash/debounce';
import DraggableColumnHeader from './DraggableColumnHeader'; // Import the DraggableColumnHeader component
import DraggableRow from './DraggableRow'; // Import the DraggableRow component
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Tracker = ({ userId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [tracklist, setTracklist] = useState([]);
  const [formStatus, setFormStatus] = useState(false);
  const [itemTrack, setItemTrack] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [itemId, setItemId] = useState([]);
  const [itemDetails, setItemDetails] = useState({});
  const [columnOrder, setColumnOrder] = useState(["item_name", "unrealized_pl", "price_bought_at", "quantity_bought", "avg_cost_basis", "current_price", "quantity_sold", "Sell"]); // Adjust initial column order
  const [sellStatus, setSellStatus] = useState(false);
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellFormItemId, setSellFormItemId] = useState(null);
  const [quantityBought, setQuantityBought] = useState(0);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    fetchTracklist();
  }, [userId]);

  useEffect(() => {
    // Load saved column order from local storage
    const savedColumnOrder = localStorage.getItem('columnOrder');
    if (savedColumnOrder) {
      setColumnOrder(JSON.parse(savedColumnOrder));
      setColumnOrderHelper(JSON.parse(savedColumnOrder));
    }
  }, []);

  useEffect(() => {
    // Save column order to local storage
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    // Load saved row order from local storage
    const savedRowOrder = localStorage.getItem('rowOrder');
    if (savedRowOrder) {
      setTracklist(JSON.parse(savedRowOrder));
    }
  }, []);

  useEffect(() => {
    // Save row order to local storage
    localStorage.setItem('rowOrder', JSON.stringify(tracklist));
  }, [tracklist]);

  const fetchTracklist = async () => {
    if (userId) {
      try {
        const response = await axios.get(`/api/user/${userId}/tracker`);
        const tracklistData = response.data;
        setTracklist(tracklistData);

        // Fetch additional data for each item
        tracklistData.forEach(async (item) => {
          try {
            const itemResponse = await axios.get(`/extra/${item.item_id}`);
            setItemDetails(prevState => ({
              ...prevState,
              [item.item_id]: itemResponse.data.data
            }));
          } catch (error) {
            console.error(`Error fetching extra data for item ${item.item_id}`, error);
          }
        });

      } catch (error) {
        console.error('Error fetching tracklist', error);
      }
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Item',
        accessor: 'item_name',
        Cell: ({ row }) => {
          const { item_id, item_name } = row.original; // Access item_id and item_name from row.original
          return (
            <Link to={`/item/${item_id}`} style={{ color: '#e4daa2', textDecoration: 'underline', marginLeft: '8px' }}>
            <img src={`https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images/${item_id}.png`}/>  {item_name}
            </Link>
          );
        },
      },
      {
        Header: 'Unrealized P/L (inc tax)',
        accessor: 'unrealized_pl',
        Cell: ({ row }) => {
          const item = row.original;
          if (itemDetails[item.item_id] && itemDetails[item.item_id].overall !== undefined) {
            const netPL = (itemDetails[item.item_id].overall - item.price_bought_at) -
              ((itemDetails[item.item_id].overall - item.price_bought_at) * 0.01);
            return netPL > 0 ? (
              <span style={{ color: 'green' }}>
                +{netPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            ) : (
              <span style={{ color: 'red' }}>
                {netPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            );
          } else {
            return 'Loading...';
          }
        },
      },
      {
        Header: 'Price bought at',
        accessor: 'price_bought_at',
        Cell: ({ value }) => `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp`,
      },
      {
        Header: 'Quantity bought',
        accessor: 'quantity_bought',
      },
      {
        Header: 'Average cost basis',
        accessor: 'avg_cost_basis',
        Cell: ({ row }) => {
          const item = row.original;
          if (item.quantity_bought && item.price_bought_at !== undefined) {
            return (item.quantity_bought * item.price_bought_at) / item.quantity_bought ? (
              <span style={{ color: 'white' }}>
                {((item.quantity_bought * item.price_bought_at) / item.quantity_bought).toLocaleString()} gp
              </span>
            ) : (
              <span style={{ color: 'white' }}>
                Loading...
              </span>
            );
          } else {
            return 'Loading...';
          }
        },
      },
      {
        Header: 'Current price',
        accessor: 'current_price',
        Cell: ({ row }) => {
          const item = row.original;
          if (itemDetails[item.item_id] && itemDetails[item.item_id].overall !== undefined) {
            return item.price_bought_at > itemDetails[item.item_id].overall ? (
              <span style={{ color: 'red' }}>
                {itemDetails[item.item_id].overall.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp
              </span>
            ) : (
              <span style={{ color: 'green' }}>
                {itemDetails[item.item_id].overall.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp
              </span>
            );
          } else {
            return 'Loading...';
          }
        },
      },
      {
        Header: 'Quantity sold',
        accessor: 'quantity_sold',
        Cell: () => 'lorum ipsum', // Placeholder
      },
      {
        Header: 'Sell',
        accessor: 'Sell',
        Cell: ({ row }) => {
          const item = row.original; 
          return (
            <img
              style={{ height: '30px', width: '30px', cursor: 'pointer' }}
              src={`${process.env.PUBLIC_URL}/images/sell.png`}
              alt="Sell"
              onClick={() => handleSellClick(item.item_id)} 
            />
          );
        },
      },
    ],
    [itemDetails, tracklist]
  );

  const data = React.useMemo(() => tracklist, [tracklist]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder: setColumnOrderHelper,
  } = useTable(
    {
      columns,
      data,
    },
    useColumnOrder
  );

  const moveColumn = (dragIndex, hoverIndex) => {
    const dragRecord = columnOrder[dragIndex];
    const newColumnOrder = [...columnOrder];
    newColumnOrder.splice(dragIndex, 1);
    newColumnOrder.splice(hoverIndex, 0, dragRecord);
    setColumnOrder(newColumnOrder);
    setColumnOrderHelper(newColumnOrder);
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = tracklist[dragIndex];
    const newTracklist = [...tracklist];
    newTracklist.splice(dragIndex, 1);
    newTracklist.splice(hoverIndex, 0, dragRecord);
    setTracklist(newTracklist);
  };

  const handleFormStatus = () => setFormStatus(!formStatus);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setItemTrack(suggestion.name);
    setItemId(suggestion.id);
  };

  const handleItemTrack = (e) => {
    setItemTrack(e.target.value);
  };

  const handleBuyPrice = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/,/g, ''); // Remove commas
    setBuyPrice(numericValue);
  };

  const handleBuyAmount = (e) => {
    setBuyAmount(e.target.value);
  };

  const handleSellPrice = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/,/g, ''); // Remove commas
    setSellPrice(numericValue);
  };

  const handleSellAmount = (e) => {
    const value = e.target.value;
    if (value <= quantityBought) { 
      setSellAmount(value);
    } else {
      alert(`You cannot sell more than ${quantityBought} items`);
    }
  }


  const handleFormSubmit = () => {
    axios.post(`/api/user/${userId}/tracker`, { 
      itemTrack: itemTrack, 
      buyPrice: buyPrice, 
      buyAmount: buyAmount,
      itemId: itemId
    })
    .then(response => {
      console.log(response.data);
      setFormStatus(false);
      fetchTracklist();
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:3000/api/items?q=${query}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, debouncedFetchSuggestions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  const hoverStyle = {
    textDecoration: `underline`,
    cursor: `pointer`
  };


  const handleSellClick = (itemId) => {
    const item = tracklist.find(item => item.item_id === itemId); // find item in the tracklist
    setSellStatus(true);
    setSellFormItemId(itemId);
    setQuantityBought(item.quantity_bought); 
    
  };
  
  const handleSellClickCancel = () => {
    if (sellStatus === true) {
      setSellStatus(false)
    }
  }

  const handleSellSubmitClick = () => {
    axios.post(`/api/user/${userId}/transactions`, { 
      itemTrack: itemTrack, 
      sellPrice: sellPrice, 
      sellAmount: sellAmount,
      itemId: itemId
    })
    .then(response => {
      console.log(response.data);
      setSellStatus(false);
      fetchTracklist();
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }



  


  return (
    <div>
      <div>
        <h2 style={{ color: '#90ee90', position: 'absolute', left: '35%', marginTop: '10px', marginBottom: '10px' }}>P/L tracker</h2>
      </div>

      <div className='form-button-track' style={{ position: 'absolute', top: '20%' }}>
        <button onClick={handleFormStatus} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AddCircleOutlineIcon /> 
          <p style={{ margin: 0 }}>Add an item to track</p>
        </button> 
      </div>

      {sellStatus && 
        <div className='tracker-form' style={{ position: 'absolute', top: '24%', display: 'flex', gap: '10px', borderStyle: 'solid', borderColor: 'salmon', padding: '10px' }}>
          <input 
            type='number'
            placeholder='Sell price (xxx.xx)'
            value={sellPrice}
            onChange={handleSellPrice}
            style={{ width: '200px' }}
            required
          />
          <input 
            type='number'
            placeholder='Quantity'
            value={sellAmount}
            onChange={handleSellAmount}
            style={{ width: '100px' }}
            required
          />
          <span style={{ paddingLeft: '-5px', color: 'white' }}>out of {quantityBought}</span>
          <button onClick={handleSellSubmitClick} >Track!</button>
          <button onClick={handleSellClickCancel} >Cancel</button>
        </div>
      }



      {formStatus && 
        <div className='tracker-form' style={{ position: 'absolute', top: '24%', display: 'flex', gap: '10px', borderStyle: 'solid', borderColor: 'salmon', padding: '10px' }}>
          <div className="search-container" ref={dropdownRef} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search items"
              value={searchQuery}
              onChange={handleChange}
              className="form-control"
              style={{ width: '150px' }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="list-group" style={{ position: 'absolute', top: '100%', left: '0', width: '150px', zIndex: '1000' }}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="list-group-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={hoverStyle}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input 
            type='text'
            placeholder='Item'
            value={itemTrack}
            readOnly
            onChange={handleItemTrack}
            style={{ width: '200px' }}
          />
          <input 
            type='number'
            step='0.01'
            placeholder='Buy price (xxx.xx)'
            value={buyPrice}
            onChange={handleBuyPrice}
            style={{ width: '200px' }}
            required
          />
          <input 
            type='number'
            placeholder='Quantity'
            value={buyAmount}
            onChange={handleBuyAmount}
            style={{ width: '100px' }}
            required
          />
          <button onClick={handleFormSubmit} >Track!</button>
        </div>
      }

      <div className="Tracker-list">
        {tracklist && tracklist.length > 0 && (
          <DndProvider backend={HTML5Backend}>
            <table className="Tracker-table" {...getTableProps()} style={{ width: '80%', borderCollapse: 'collapse', position: 'absolute', top: '40%' }}>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <DraggableColumnHeader
                        key={column.id}
                        column={column}
                        index={index}
                        moveColumn={moveColumn}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    index={index}
                    moveRow={moveRow}
                    prepareRow={prepareRow}
                  />
                ))}
              </tbody>
            </table>
          </DndProvider>
        )}
      </div>
    </div>
  );
};

export default Tracker;
