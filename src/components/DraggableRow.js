import { useDrag, useDrop } from 'react-dnd';
import React, { useRef } from 'react';

const DraggableRow = ({ row, index, moveRow, prepareRow }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'row',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: { type: 'row', id: row.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  prepareRow(row);

  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}
      {...row.getRowProps()}
    >
      {row.cells.map(cell => {
        let style = { color: 'white', border: '1px solid #ccc', padding: '8px' };
        if (cell.column.Header === 'Unrealized P/L (inc tax)' && cell.value !== undefined) {
          style.color = cell.value.includes('+') ? 'green' : 'red';
        }
        return (
          <td {...cell.getCellProps()} style={style}>
            {cell.render('Cell')}
          </td>
        );
      })}
    </tr>
  );
};

export default DraggableRow;
