import React from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const dance = `${process.env.PUBLIC_URL}/images/dance.gif`;

const Home = () => {
    
    return (
        <div>
            <div>
                <h1 style={{ display: 'flex', justifyContent: 'center', color: 'white'}} > 
                <img style={{ height: '75px', width: '75px' }} src={require('../images/dance.gif')}/> Welcome to the OSRS GE tool! <img style={{ height: '75px', width: '75px' }} src={require('../images/dance.gif')}/> </h1>
            
            </div>
                <div className="card bg-dark mb-4">
                    <div style={{ color: 'white', display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }} className="card-header">How to use the OSRS GE tool</div>
                        <div className="card-body">
                            <ul style={{ color: 'white' }} >
                                <li>Begin typing your item in the search bar for an item, and select the suggested item in the drop down.</li>
                                <li>View real time prices, and/or use the configurable time series graph</li>
                                <li>Logged in users can save items to their watchlist by clicking the star <StarBorderOutlinedIcon syle={{ color: 'yellow' }} /> , and clicking again to remove from watchlist. The watchlist provides extra item details to help aid in potential profits.</li>
                                <li>
                                    Users can use the Profit/Loss tracker. Here you will enter your transaction information; 
                                    including quantity of item purchased, and the amount paid per item.<br />
                                    The trade tracker tracks the total cost paid, your average cost basis, the current market price of the item, and your unrealized P/L (including tax).<br />
                                    While the item is being tracked, you can add more buys to the record, or sell off some of the quantity.<br />
                                    When you close out the trade (Sell off all of the quantity), your trade data will be moved to a separate table 
                                    that tracks historic trades, so you will have access to all trades that you have tracked using the tracker tool.
                                </li>

                            </ul>
                        </div>
                </div>
            
        </div>

    )
}

export default Home;
