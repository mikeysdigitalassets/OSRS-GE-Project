import React from 'react';

function Sidebar() {
  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">OSRS GE</div>
      <div className="list-group list-group-flush">
        <a href="/dashboard" className="list-group-item list-group-item-action bg-light">Dashboard</a>
        <a href="/items" className="list-group-item list-group-item-action bg-light">Items</a>
        <a href="/prices" className="list-group-item list-group-item-action bg-light">Prices</a>
      </div>
    </div>
  );
}

export default Sidebar;
