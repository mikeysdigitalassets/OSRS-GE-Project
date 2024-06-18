
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import react, { useState, useEffect, useContext } from "react";
import Table from './components/Table';
import ChartComponent from './components/ChartComponent';
import { result } from 'lodash';
import Watchlist from './components/WatchList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  
  const handleItemSelected = (itemDetails) => {
    setSelectedItemDetails(itemDetails);
    
  }
  


  return (

    <Router>
    <div id="page-content-wrapper">
      <Header onItemSelected={handleItemSelected} />
      <div className="d-flex" id="wrapper">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/watchlist" element={<Watchlist />} /> 
            <Route path="/" element={
              <>
                <Table itemDetails={selectedItemDetails} />
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
