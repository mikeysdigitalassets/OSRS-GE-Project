import react from "react";
import App from "../App";

const Table = ({selectedItemId, itemDetails, itemData}) => {
 
    return (
    
  <table className="table compact-table">
  <tbody>
    <tr>
      <th scope="row">Buy price:</th>
      <td>{}</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">Sell price</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">Tax</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
  )}

export default Table;