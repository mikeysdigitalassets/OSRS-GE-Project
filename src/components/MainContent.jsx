import React, { useEffect, useState } from 'react';
import ChartComponent from './ChartComponent';

function MainContent({ selectedItemId, itemDetails }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (itemDetails && selectedItemId) {
      const itemData = itemDetails.data[selectedItemId];

      if (itemData && typeof itemData.highTime === 'number' && typeof itemData.lowTime === 'number') {
        // Format data for Chart.js
        const formattedData = {
          dates: [new Date(itemData.highTime * 1000), new Date(itemData.lowTime * 1000)],
          prices: [itemData.high, itemData.low],
        };

        setChartData(formattedData);
      } else {
        console.error("Data structure is not as expected", itemData);
      }
    }
  }, [itemDetails, selectedItemId]);

  return (
    <div>
      {itemDetails && (
        <div>
          <h2>Item details</h2>
          <pre>{JSON.stringify(itemDetails, null, 2)}</pre>
        </div>
      )}
      {chartData ? (
        <ChartComponent data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}

export default MainContent;
