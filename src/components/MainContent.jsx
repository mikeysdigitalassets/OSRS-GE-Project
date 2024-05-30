import React from 'react';

function MainContent({selectedItemId, itemDetails}) {
  return (
    <div>
    {selectedItemId && <p>Selected item ID: {selectedItemId}</p>}
      {itemDetails && ( <div>
          <h2>Item details</h2>
          <pre>{JSON.stringify(itemDetails, null, 2)}</pre>
        </div>  
      )}
    </div>  
  );
}

export default MainContent;
