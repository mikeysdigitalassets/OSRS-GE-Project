
import './App.css';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import react, { useState, useEffect } from "react";

function App() {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  

  const handleItemSelected = (id) => {
    console.log(id)
    setSelectedItemId(id);
  }
  
  useEffect(() => {
    const fetchItemDetails = async (itemId) => {
      
        try {
          const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setItemDetails(data);
          
        } catch (error) {
          console.error("Error fetching item details", error.message);
        }
      
  };
    const itemId = selectedItemId || 13190;
    if (itemId) {
      fetchItemDetails(itemId);
      console.log(itemId);
    } else {
      console.error("No valid ID is available to fetch");
    }
  }, [selectedItemId]);


  return (
    <div className="d-flex" id="wrapper">
    {/* Sidebar */}
    <Sidebar />
    
    {/* Page Content */}
    <div id="page-content-wrapper">
      <Header onItemSelected={handleItemSelected} />
      <MainContent 
      selectedItemId={selectedItemId}
      itemDetails={itemDetails}
      
      />
      
    </div>
  </div>
);
}


export default App;
