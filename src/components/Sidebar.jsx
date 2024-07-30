import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { styled } from '@mui/system';



function Sidebar() {
  const [user, setUser] = useState(null);
  const [isVisable, setIsVisable] = useState(false);

  
  useEffect(() => {
    const savedState = localStorage.getItem('isVisable');
    
    if (savedState !== null) {
      setIsVisable(JSON.parse(savedState));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCollapse = () => {
    setIsVisable(prevState => {
      const newState = !prevState;
      localStorage.setItem('isVisable', JSON.stringify(newState)); // save state to localStorage right after updating
      return newState;
    });
  };

  const TwoToneWhatshotIcon = styled(WhatshotIcon)(({ theme }) => ({
    width: 48,
    height: 48,
    '& path:nth-of-type(1)': {
      fill: 'orange',
    },
    '& path:nth-of-type(2)': {
      fill: 'yellow',
    },
    marginLeft: '-50px',
  }));

  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div>
        <div className="list-group list-group-flush" style={{ '--bs-list-group-bg': '#87CEFA' }}>
          <a href="/dashboard" className="list-group-item list-group-item-action">Dashboard</a>
          <a
            style={{ cursor: 'pointer' }}
            onClick={handleCollapse}
            className="list-group-item list-group-item-action">
            <img
              style={{ height: '25px', width: '25px' }}
              src={require('../images/GE.png')}
            /> Items {!isVisable ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
          </a>
          {isVisable && (
            <ul id='ul-drop' style={{ margin: '0', '--bs-list-group-bg': '#F0FFF0' }}>
              <li>
                <a
                  style={{ fontSize: '14px', whiteSpace: 'nowrap', fontWeight: 'bold', '--bs-list-group-bg': '#F0FFF0' }}
                  href="/itemlist"
                  className="list-group-item list-group-item-action"
                  id='nav-drops'>
                  <img
                    style={{ height: '30px', width: '30px', transform: 'translateX(-10px)' }}
                    src={require('../images/az.png')}
                  /> All items
                </a>
              </li>
              <li>
                <a
                  href='/highest-volume'
                  style={{ fontSize: '14px', whiteSpace: 'nowrap', fontWeight: 'bold' }}
                  className="list-group-item list-group-item-action"
                  id='nav-drops'>
                  <WhatshotIcon sx={{ color: 'orange', transform: 'translateX(-10px)' }} /> Hot
                </a>
              </li>
              <li>
                <a
                  href='/highest-price'
                  style={{ fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                  className="list-group-item list-group-item-action bg-light"
                  id='nav-drops'>
                  <AttachMoneyIcon sx={{ color: 'green', transform: 'translateX(-10px)' }} />
                  <span style={{ display: 'inline-block' }}>
                    Highest<br />
                    <span style={{ display: 'block', textAlign: 'left' }}>price</span>
                  </span>
                </a>
              </li>
            </ul>
          )}
          <a href="/tracker" id='track-nav' className="list-group-item list-group-item-action">
            <img
              style={{ height: '20px', width: '20px' }}
              src={require('../images/pl.png')}
            /> P/L tracker
          </a>
          {user && (
            <a href="/watchlist" style={{ backgroundcol: 'red' }} className="list-group-item list-group-item-action">
              <img
                style={{ height: '20px', width: '20px' }}
                src={require('../images/eyes.png')}
              /> Watch List
            </a>
          )}
          <div className="ukraine">
            <a href="https://war.ukraine.ua/support-ukraine/">
              <svg
                width="100"
                height="100"
                viewBox="-82.5 0 165 230.5"
                fill="#ffd500"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M-81.25 1.25h162.5v172.5a31.25 31.25 0 0 1-18.578029 28.565428L0 228.867475l-62.671971-27.802047A31.25 31.25 0 0 1-81.25 172.5z"
                  fill="#005bbb"
                  stroke="#ffd500"
                  strokeWidth="2.5"
                />
                <path
                  d="M5.985561 78.82382a104.079383 104.079383 0 0 0 14.053598 56.017033 55 55 0 0 1-13.218774 70.637179A20 20 0 0 0 0 212.5a20 20 0 0 0-6.820384-7.021968 55 55 0 0 1-13.218774-70.637179A104.079383 104.079383 0 0 0-5.98556 78.82382l-1.599642-45.260519A30.103986 30.103986 0 0 1 0 12.5a30.103986 30.103986 0 0 1 7.585202 21.063301zM5 193.624749a45 45 0 0 0 6.395675-53.75496A114.079383 114.079383 0 0 1 0 112.734179a114.079383 114.079383 0 0 1-11.395675 27.13561A45 45 0 0 0-5 193.624749V162.5H5z"
                />
                <path
                  id="a"
                  d="M27.779818 75.17546A62.64982 62.64982 0 0 1 60 27.5v145H0l-5-10a22.5 22.5 0 0 1 17.560976-21.95122l14.634147-3.292683a10 10 0 1 0-4.427443-19.503751zm5.998315 34.353887a20 20 0 0 1-4.387889 37.482848l-14.634146 3.292683A12.5 12.5 0 0 0 5 162.5h45V48.265462a52.64982 52.64982 0 0 0-12.283879 28.037802zM42 122.5h10v10H42z"
                />
                <use href="#a" transform="scale(-1 1)" />
              </svg>
            </a>
            <a href="https://war.ukraine.ua/support-ukraine/">Support Ukraine!</a>
          </div>
        </div>
      </div>
      <img
        style={{ height: '75px', width: '75px', position: 'absolute', bottom: '-60px', left: '-20px' }}
        src={require('../images/flower.png')}
      />
    </div>
  );
}

export default Sidebar;
