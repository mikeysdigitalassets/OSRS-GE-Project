import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import React, { useState, useEffect } from "react"; 
import Table from './components/Table';
import ChartComponent from './components/ChartComponent';
import Watchlist from './components/Watchlist';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/user')
      .then(response => {
        console.log('User data fetched:', response.data);
        setUser(response.data);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleItemSelected = (itemDetails) => {
    setSelectedItemDetails(itemDetails);
  };

  return (
    <Router>
      <div id="page-content-wrapper">
        <Header onItemSelected={handleItemSelected} />
        <div className="d-flex" id="wrapper">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/watchlist" element={user && <Watchlist userId={user.id} />} />
              <Route path="/" element={
                <>
                  <Table itemDetails={selectedItemDetails} userId={user ? user.id : null} />
                  <ChartComponent itemDetails={selectedItemDetails} />
                </>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
