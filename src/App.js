
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
<<<<<<< HEAD
import react, { useState, useEffect } from "react";

function App() {
  const [selectedItemId, setSelectedItemId] = react.useState(null);
  const [itemDetails, setItemDetails] = react.useState(null);
  
  const handleItemSelected = (id) => {
    setSelectedItemId(id);
  }
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (selectedItemId) {
        try {
          const response = await fetch(`http://localhost:3000/api/item/${selectedItemId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setItemDetails(data);
        } catch (error) {
          console.error("Error fetching item details", error.message);
        }

      }
    }
    fetchItemDetails();
  }, [selectedItemId]);


=======

function App() {
>>>>>>> origin/master
  return (
    <div className="d-flex" id="wrapper">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Page Content */}
    <div id="page-content-wrapper">
<<<<<<< HEAD
      <Header onItemSelected={handleItemSelected} />
      {selectedItemId && <p>Selected item ID: {selectedItemId}</p>}
      {itemDetails && (
        <div>
          <h2>Item details</h2>
          <pre>{JSON.stringify(itemDetails, null, 2)}</pre>
        </div>  
      )}
=======
      <Header />
>>>>>>> origin/master
      <MainContent />
    </div>
  </div>
);
}


export default App;
