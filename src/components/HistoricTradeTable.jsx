import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

const HistoricTradeTable = ({ userId }) => {
  const [historicData, setHistoricData] = useState([]);

  useEffect(() => {
    fetchHistoricData();
  }, [userId]);

  const fetchHistoricData = async () => {
    try {
      const response = await axios.get(`/api/user/${userId}/historic`);
      setHistoricData(response.data);
    } catch (error) {
      console.error('Error fetching historic trade data', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Item',
        accessor: 'item_name',
        Cell: ({ row }) => {
          const { item_id, item_name } = row.original; // Access item_id and item_name from row.original
          return (
            <div>
              <img src={`https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images/${item_id}.png`} alt={item_name}/>  {item_name}
            </div>
          );
        },
      },
      {
        Header: 'Quantity Bought',
        accessor: 'quantity_bought',
        Cell: ({ value }) => `${value.toLocaleString()}`
      },
      {
        Header: 'Price Bought At',
        accessor: 'price_bought_at',
        Cell: ({ value }) => `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp`,
      },
      {
        Header: 'Quantity Sold',
        accessor: 'quantity_sold',
        Cell: ({ value }) => `${value.toLocaleString()}`
      },
      {
        Header: 'Price Sold At',
        accessor: 'price_sold_at',
        Cell: ({ value }) => `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gp`,
      },
      {
        Header: 'P/L',
        accessor: 'pl',
        Cell: ({ value }) => {
          const formattedValue = Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          return value > 0 ? (
            <span style={{ color: 'green' }}>
              +{formattedValue} gp
            </span>
          ) : (
            <span style={{ color: 'red' }}>
              {formattedValue} gp
            </span>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => historicData, [historicData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    }
  );

  return (
    <div className="HistoricTradeTable">
      {historicData && historicData.length > 0 ? (
        <table className="Historic-table" {...getTableProps()} style={{ width: '80%', borderCollapse: 'collapse', position: 'absolute', top: '60%' }}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} style={{ color: 'white', border: '1px solid white' }}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} style={{ color: 'white', border: '1px solid white' }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ color: 'white' }}>No historic trade data available.</div>
      )}
    </div>
  );
};

export default HistoricTradeTable;
