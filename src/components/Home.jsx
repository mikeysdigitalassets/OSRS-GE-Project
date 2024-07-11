import React from "react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

const Home = () => {
    
    return (
        <div>
            <div>
                <h1 style={{ display: 'flex', justifyContent: 'center', color: 'white'}} >Welcome! lorem ipsum mutha fucka!</h1>
            
            </div>
                <div className="card bg-dark mb-4">
                    <div style={{ color: 'white', display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }} className="card-header">How to use the OSRS GE tool</div>
                        <div className="card-body">
                            <ul style={{ color: 'white' }} >
                                <li>Begin typing your item in the search bar for an item, and select the suggested item in the drop down.</li>
                                <li>View real time prices, and/or use the configurable time series graph</li>
                                <li>Logged in users can save items to their watchlist by clicking the star <StarBorderOutlinedIcon syle={{ color: 'yellow' }} /> , and clicking again to remove from watchlist. The watchlist provides extra item details to help aid in potential profits.</li>
                            </ul>
                        </div>
                </div>
            
        </div>

    )
}

export default Home;