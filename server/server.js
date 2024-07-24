const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PgSession = require('connect-pg-simple')(session);
const axios = require('axios');

const imageLink = 'https://d14htxdhbak4qi.cloudfront.net/osrsproject-item-images';

const app = express();
const port = process.env.PORT || 8080;

// Amazon RDS database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // for self-signed certificates
    }
});

app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', 
        domain: 'localhost' 
    }
}));

app.use(cors({
    origin: 'https://osrs-ge-project.vercel.app/', // my frontend
    credentials: true
}));

app.use(express.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    console.log('User is not authenticated');
    res.status(401).send('Unauthorized');
}

app.get('/api/items', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT id, name, highalch, lowalch, item_limit
            FROM osrs_items
            WHERE name ILIKE $1
        `;
        const result = await client.query(queryText, [`%${searchTerm}%`]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/item/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT id, name, highalch, lowalch, item_limit
            FROM osrs_items
            WHERE id = $1
        `;
        const result = await client.query(queryText, [itemId]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).send('Item not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

async function saveUser(email, oauthProvider, oauthId) {
    const client = await pool.connect();
    try {
        const queryText = 'INSERT INTO users(email, oauth_provider, oauth_id) VALUES($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *';
        const res = await client.query(queryText, [email, oauthProvider, oauthId]);

        if (res.rows.length > 0) {
            return res.rows[0];
        } else {
            const fetchUserQuery = 'SELECT * FROM users WHERE email = $1';
            const fetchUserResult = await client.query(fetchUserQuery, [email]);
            return fetchUserResult.rows[0];
        }
    } catch (err) {
        throw err; 
    } finally {
        client.release();
    }
}

app.post('/auth/google/callback', async (req, res) => {
    const { email, oauthProvider, oauthId } = req.body;
    try {
        const user = await saveUser(email, oauthProvider, oauthId);
        if (user) {
            req.session.user = { id: user.id, email, oauthProvider, oauthId };
            req.session.save(err => {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).json({ id: user.id });
                }
            });
        } else {
            res.status(200).send('User already exists');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/user', ensureAuthenticated, (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const { itemId, itemName } = req.body;
    try {
        const client = await pool.connect();
        const query = 'INSERT INTO watchlist (user_id, item_id, item_name) VALUES ($1, $2, $3)';
        const values = [userId, itemId, itemName];
        await client.query(query, values);
        client.release();
        res.status(201).send('Item added to watchlist');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;
    try {
        const client = await pool.connect();
        await client.query('DELETE FROM watchlist WHERE user_id = $1 AND item_id = $2', [userId, itemId]);
        client.release();
        res.status(200).send('Item removed from watchlist');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get("/item/:itemId", async (req, res) => {
    const { itemId } = req.params;
    try {
        const response = await axios.get(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`);
        res.json(response.data.data);
    } catch (error) {
        console.error("Error fetching item details", error.message);
        res.status(500).send("Internal server error");
    }
});

app.get('/api/allitems', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM osrs_items');
        client.release();
        res.json(result.rows);
    } catch {
        res.status(500).send('Internal server error, sowwy uncle tom');
    }
});

app.get('/image/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const imageUrl = `${imageLink}/${itemId}`;
    try {
        const response = await axios.get(imageUrl);
        res.json({ url: imageUrl });
    } catch {
        res.status(500).send('Interal server error, too bad soo sad');
    }
});

app.get("/latest", async (req, res) => {
    try {
        const response = await axios.get(`https://prices.runescape.wiki/api/v1/osrs/latest`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching item details", error.message);
        res.status(500).send("Internal server error");
    }
});

app.get("/mapping", async (req, res) => {
    try {
        const response = await axios.get(`https://prices.runescape.wiki/api/v1/osrs/mapping`);
        res.json(response.data);
        console.log("hit");
    } catch (error) {
        console.error("Error fetching item details", error.message);
        res.status(500).send("Internal server error");
    }
});

app.get('/volume', async (req, res) => {
    try {
        const response = await axios.get('https://prices.runescape.wiki/api/v1/osrs/volumes');
        res.json(response.data.data);
    } catch (error) {
        console.error('Error fetching volume details', error.message);
        res.status(500).send('Internal server error');
    }
});

app.get('/change/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        const response = await axios.get(`https://prices.runescape.wiki/api/v1/osrs/timeseries?timestep=1h&id=${itemId}`);
        res.json(response.data.data);
    } catch (error) {
        console.error("Error fetching item details", error.message);
        res.status(500).send("Internal server error");
    }
});

app.get('/extra/:itemId', async (req, res) => {
    const { itemId } = req.params;
    try {
        const response = await axios.get(`https://www.ge-tracker.com/api/items/${itemId}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching item details", error.message);
        res.status(500).send("Internal server error");
    }
});

app.get('/api/user/:userId/tracker', async (req, res) => {
    const { userId } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM tracker WHERE user_id = $1', [userId]);
        client.release();
        res.json(result.rows);
    } catch (error) {
        res.status(500).send('Internal sever error');
    }
});

app.post('/api/user/:userId/tracker', async (req, res) => {
    const { userId } = req.params;
    const { itemTrack, buyPrice, buyAmount , itemId } = req.body;
    try {
        const client = await pool.connect();
        const query = 'INSERT INTO tracker (user_id, item_id, item_name, price_bought_at, quantity_bought) VALUES ($1, $2, $3, $4, $5)';
        const values = [userId, itemId, itemTrack, buyPrice, buyAmount];
        await client.query(query, values);
        client.release();
        res.status(201).send('Item added to tracker');
    } catch (error) {
        res.status(500).send('Internal sever error');
    }
});

app.patch('/api/user/:userId/tracker/buy', async (req, res) => {
    const { userId } = req.params;
    const { buyPrice, buyAmount, itemId } = req.body;
    try {
        const client = await pool.connect();
        const query = `
            UPDATE tracker
            SET price_bought_at = price_bought_at + $1,
                quantity_bought = quantity_bought + $2
            WHERE user_id = $3 AND item_id = $4
            RETURNING price_bought_at, quantity_bought
        `;
        const values = [buyPrice, buyAmount, userId, itemId];
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: 'Tracker updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error updating tracker:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.patch('/api/user/:userId/tracker/sell', async (req, res) => {
    const { userId } = req.params;
    const { sellPrice, sellAmount, itemId } = req.body;
    try {
        const client = await pool.connect();
        const currentItemQuery = `
            SELECT price_bought_at, quantity_bought, item_name
            FROM tracker
            WHERE user_id = $1 AND item_id = $2
        `;
        const currentItemResult = await client.query(currentItemQuery, [userId, itemId]);

        if (currentItemResult.rowCount === 0) {
            client.release();
            return res.status(404).json({ message: 'Item not found' });
        }

        const currentItem = currentItemResult.rows[0];
        const { price_bought_at, quantity_bought, item_name } = currentItem;
        const effectiveSellPrice = parseFloat(sellPrice) * (1 - 0.01);

        if (sellAmount === quantity_bought) {
            const totalSellPrice = effectiveSellPrice * sellAmount;
            const totalCost = price_bought_at * quantity_bought;
            const pl = totalSellPrice - totalCost - (totalSellPrice * 0.01);

            const insertHistoricTradeQuery = `
                INSERT INTO historic_trade_data (user_id, item_id, quantity_bought, price_bought_at, quantity_sold, price_sold_at, pl, item_name)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            await client.query(insertHistoricTradeQuery, [userId, itemId, quantity_bought, price_bought_at, sellAmount, effectiveSellPrice, pl, item_name]);

            const deleteTrackerQuery = `
                DELETE FROM tracker
                WHERE user_id = $1 AND item_id = $2
            `;
            await client.query(deleteTrackerQuery, [userId, itemId]);

            client.release();
            return res.status(200).json({ message: 'Trade closed and moved to historic data' });
        } else {
            const updateTrackerQuery = `
                UPDATE tracker
                SET price_bought_at = price_bought_at - ($1::numeric * $2::numeric),
                    quantity_sold = COALESCE(quantity_sold, 0) + $2::integer,
                    quantity_bought = quantity_bought - $2::integer
                WHERE user_id = $3::integer AND item_id = $4::integer
                RETURNING price_bought_at, quantity_sold, quantity_bought
            `;
            const values = [effectiveSellPrice, sellAmount, userId, itemId];
            const result = await client.query(updateTrackerQuery, values);
            client.release();

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Item not found' });
            }

            return res.status(200).json({ message: 'Tracker updated successfully', data: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating tracker:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/api/user/:userId/tracker/remove', async (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;

    if (!itemId) {
        return res.status(400).send("Item ID is required");
    }

    try {
        const client = await pool.connect();
        const query = `DELETE FROM tracker WHERE user_id = $1 AND item_id = $2`;
        const values = [userId, itemId];
        await client.query(query, values);
        client.release();
        return res.status(200).send('Item removed from tracker');
    } catch (error) {
        console.error('Error removing from tracker', error.message);
        return res.status(500).send('Internal server error');  
    }
});

app.get('/api/user/:userId/historic', async (req, res) => {
    const { userId } = req.params;
    try {
        const client = await pool.connect();
        const query = `
            SELECT item_id, item_name, quantity_bought, price_bought_at, quantity_sold, price_sold_at, pl
            FROM historic_trade_data
            WHERE user_id = $1
            ORDER BY completed_at DESC
        `;
        const result = await client.query(query, [userId]);
        client.release();

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'No historic trade data found' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching historic trade data:', error.message); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Handles any requests that don't match the above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
