// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const Items = () => {
    
    
    
    
//     return (
//         <div className="items-list">
//           <h2 style={{ color: 'green' }}>All items on the Grand Exchange</h2>
//           <table className="items-list-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                {showDetails && apiDetails ? (
//                   <>
//                 <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item</th>
//                 <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
//                 <th style={{ border: '1px solid #ccc', padding: '8px' }}>Change</th>
//                 <th style={{ border: '1px solid #ccc', padding: '8px' }}>Placeholder</th>
//                   </>
//                ) : null }
//               </tr>
//             </thead>
//             <tbody>
//               {watchlist.map(item => (
//                 <tr key={item.item_id}>
//                   <td style={{ border: '1px solid #ccc', padding: '8px', display: 'flex', alignItems: 'center' }}>
//                     <IconButton onClick={(e) => {
//                       e.stopPropagation();
//                       toggleWatchlist(item);
//                     }}>
//                       <StarIcon style={{ color: 'yellow' }} />
//                     </IconButton>
//                     <Link to={`/item/${item.item_id}`} style={{ color: 'black', textDecoration: 'underline', marginLeft: '8px' }}>
//                       {item.item_name}
//                     </Link>
//                   </td>
//                   {showDetails && apiDetails[item.item_id] && (
//                     <>
//                       <td style={{ color: 'white', border: '1px solid #ccc', padding: '8px' }}>
//                         {apiDetails[item.item_id][item.item_id].high.toLocaleString()} gp
//                       </td>
//                       <td style={{ border: '1px solid #ccc', padding: '8px' }}>
//                         {getChangeText([item.item_id])}
//                       </td>
//                       <td style={{ border: '1px solid #ccc', padding: '8px' }}>
//                         {/* Placeholder for future data */}
//                       </td>
//                     </>
//                   )} 
                    
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
// }











// export default Items;