import react, { useState, useEffect, useContext } from "react";
import App from "../App";
import Search from "./Search";
import Header from "./Header";
import { result } from "lodash";

const Table = ({itemDetails}) => {
  const [apiDetails, setApiDetails] = useState(null);
  const tax = .01;
    const bond = {
      id: 13190,
      name: "Old school bond",
      lowalch: "N/A",
      highalch: "N/A",
      item_limit: 100,
      }
  
   
  useEffect(() => {
    const fetchItemDetails = async (itemId) => {
      
        try {
          const response = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const result = await response.json();
          const itemData = result.data[itemId];
          setApiDetails(itemData);
          // console.log(itemId)
          // console.log(itemData.high.toLocaleString());
        } catch (error) {
          console.error("Error fetching item details", error.message);
        }
      
  };
    if (itemDetails && itemDetails.id) {
      fetchItemDetails(itemDetails.id)
    } else {
      fetchItemDetails(13190)
      
      
    }
  }, [itemDetails]);      
  
  const formatNumber = (value) => {
    const numberValue = parseInt(value, 10);
    return !isNaN(numberValue) ? numberValue.toLocaleString() : "N/A";
  }

    
   

      return ( 
  <div id="tableMain">
  <table className="table compact-table">
  <thead id="tableHead">
        <tr>
          <th colSpan="4" style={{padding: '10px', textAlign: 'left', backgroundColor: '#262a2e'}} >
            {itemDetails ? itemDetails.name : bond.name}
              <span  id="tableId" style={{fontSize: 14}} >
                ID:{itemDetails ? itemDetails.id : bond.id}
              </span>
          </th>
        </tr>
  </thead>      
  <tbody>
    <tr>
      <th scope="row">Buy price:</th>
      <td>{apiDetails ? apiDetails.high.toLocaleString() + " coins" : "g"}</td>
      <td>Item limit:</td>
      <td>{itemDetails ? itemDetails.item_limit : bond.item_limit}</td>
    </tr>
    <tr>
      <th scope="row">Sell price:</th>
      <td>{apiDetails ? apiDetails.low.toLocaleString() + " coins" : 'loading...'}</td>
      <td>High alch value:</td>
      <td>{formatNumber(itemDetails ? itemDetails.highalch.toLocaleString() : bond.highalch)}</td>
    </tr>
    <tr> 
      <th scope="row">Tax:</th>
      <td>{apiDetails ? (apiDetails.low * tax).toLocaleString() + " coins" : "loading..."}</td>
      <td>Low alch value:</td>
      <td>{formatNumber(itemDetails ? itemDetails.lowalch.toLocaleString() : bond.lowalch)}</td>
    </tr>
  </tbody>
</table>
</div>  
  )}

export default Table;