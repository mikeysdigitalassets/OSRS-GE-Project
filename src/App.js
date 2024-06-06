
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import react, { useState, useEffect, useContext } from "react";
import Table from './components/Table';
import ChartComponent from './components/ChartComponent';
import { result } from 'lodash';

function App() {
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  
  const handleItemSelected = (itemDetails) => {
    setSelectedItemDetails(itemDetails);
    
  }
  


  return (

    //  
    <div id="page-content-wrapper">
      <Header onItemSelected={handleItemSelected}  />
      <div className="d-flex" id="wrapper">
      <Sidebar />
    <div className="content">
      <Table itemDetails={selectedItemDetails} />
      <ChartComponent itemDetails={selectedItemDetails} />
    </div>  
    </div>
  </div>
  
);
}


export default App;
