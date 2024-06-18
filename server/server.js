const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = 3000;

// Amazon RDS hosted database
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());
app.use(cors());

function ensureAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Function saving user info to db
async function saveUser(email, oauthProvider, oauthId) {
    const client = await pool.connect();
    console.log('Database connected'); // Debug log
    try {
        const queryText = 'INSERT INTO users(email, oauth_provider, oauth_id) VALUES($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *';
        const res = await client.query(queryText, [email, oauthProvider, oauthId]);
        console.log('Query result:', res.rows); // Debug log
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query:', err); // Debug log
        throw err; // Rethrow the error to handle it in the catch block of the calling function
    } finally {
        client.release();
    }
}

// Endpoint to handle saving user info after Firebase authentication
app.post('/auth/google/callback', async (req, res) => {
    console.log('Request received at /auth/google/callback');
    console.log('Request body:', req.body);

    const { email, oauthProvider, oauthId } = req.body;
    try {
        const user = await saveUser(email, oauthProvider, oauthId);
        if (user) {
            console.log('User saved:', user);
        } else {
            console.log('User already exists.');
        }
        req.session.user = { email, oauthProvider, oauthId }; // Save user to session
        res.status(200).send('User saved successfully');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Other routes...
app.get('/api/user', ensureAuthenticated, (req, res) => {
    res.json(req.session.user);
});

app.get('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM watchlist WHERE user_id = $1', [userId]);
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching watchlist:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/user/:userId/watchlist', ensureAuthenticated, async (req, res) => {
    const { userId } = req.params;
    const { itemId, itemName } = req.body;
    try {
        const client = await pool.connect();
        await client.query('INSERT INTO watchlist (user_id, item_id, item_name) VALUES ($1, $2, $3)', [userId, itemId, itemName]);
        client.release();
        res.status(201).send('Item added to watchlist');
    } catch (err) {
        console.error('Error adding to watchlist:', err);
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
        console.error('Error removing from watchlist:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
