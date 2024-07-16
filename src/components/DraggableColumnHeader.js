import { useDrag, useDrop } from 'react-dnd';
import React, { useRef } from 'react';

const DraggableColumnHeader = ({ column, index, moveColumn }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'column',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { type: 'column', id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <th
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        border: '1px solid #ccc',  // Same border style as other cells
        padding: '8px',
        backgroundColor: '#2c3e50',  // Ensuring the background color is consistent
        color: 'white',  // Ensuring text color is consistent
        cursor: 'pointer'  // Change cursor to pointer
      }}
      {...column.getHeaderProps()}
    >
      {column.render('Header')}
    </th>
  );
};

export default DraggableColumnHeader;
