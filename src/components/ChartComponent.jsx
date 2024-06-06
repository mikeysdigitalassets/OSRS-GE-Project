import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const ChartComponent = ({ itemDetails }) => {
  const [interval, setInterval] = useState('day'); // Default interval
  const [apiDetails, setApiDetails] = useState(null);

  useEffect(() => {
    if (!itemDetails || !itemDetails.id) {
      return;
    }

    const fetchApiDetails = async () => {
      try {
        const response = await fetch(`https://www.ge-tracker.com/api/graph/${itemDetails.id}/${interval}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setApiDetails(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchApiDetails();
  }, [interval, itemDetails]);

  // Function to prepare data based on the selected interval
  const getData = () => {
    if (!apiDetails || !apiDetails.data || !Array.isArray(apiDetails.data)) {
      return {
        labels: [],
        datasets: [],
      };
    }

    let labels = [];
    let buyData = [];
    let sellData = [];

    try {
      labels = apiDetails.data.map((data) => new Date(data.ts)); // Convert timestamp to Date object
      buyData = apiDetails.data.map((data) => data.buyingPrice);
      sellData = apiDetails.data.map((data) => data.sellingPrice);
    } catch (error) {
      console.error('Error processing data:', error);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'Buy Price',
          data: buyData.map((price, index) => ({ x: labels[index], y: price })), // Mapping x and y values
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
        {
          label: 'Sell Price',
          data: sellData.map((price, index) => ({ x: labels[index], y: price })), // Mapping x and y values
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
        },
      ],
    };
  };

  const chartData = getData();

  const options = {
    animation: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: interval === 'day' ? 'hour' : 'day', // Use 'hour' for daily, 'day' for monthly
          tooltipFormat: 'PP', // Correct format for date-fns
          displayFormats: {
            hour: 'MMM dd, h a',
            day: 'MMM dd',
            month: 'MMM yyyy',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
  };

  return (
    <div>
      <div className="dropDownTime">
        <select onChange={(e) => setInterval(e.target.value)} value={interval}>
          <option value="day">Daily</option>
          <option value="month">Monthly</option>
          {/* will add more intervals */}
        </select>
      </div>
      <div className="chart-container">
        {apiDetails ? (
          <Line data={chartData} options={options} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
