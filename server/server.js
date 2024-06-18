const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const PgSession = require('connect-pg-simple')(session);

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
    store: new PgSession({
        pool: pool, // Connection pool
        tableName: 'session' // Use another table-name if you want
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));


app.use(cors({
    origin: 'http://localhost:3001', // Ensure this matches your frontend URL
    credentials: true
}));

app.use(express.json());

function ensureAuthenticated(req, res, next) {
    console.log('ensureAuthenticated middleware called');
    if (req.session.user) {
        console.log('User is authenticated');
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




// Function saving user info to db
async function saveUser(email, oauthProvider, oauthId) {
    const client = await pool.connect();
    console.log('Database connected'); // Debug log
    try {
        const queryText = 'INSERT INTO users(email, oauth_provider, oauth_id) VALUES($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *';
        const res = await client.query(queryText, [email, oauthProvider, oauthId]);
        console.log('Insert query result:', res.rows); // Debug log

        if (res.rows.length > 0) {
            // User was inserted, return the new user
            return res.rows[0];
        } else {
            // User already exists, fetch the existing user
            const fetchUserQuery = 'SELECT * FROM users WHERE email = $1';
            const fetchUserResult = await client.query(fetchUserQuery, [email]);
            console.log('Fetch user query result:', fetchUserResult.rows); // Debug log
            return fetchUserResult.rows[0];
        }
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
            req.session.user = { id: user.id, email, oauthProvider, oauthId }; // Save user ID to session
            console.log('Session user set:', req.session.user); // Debug log
            console.log('Session ID:', req.sessionID); // Log session ID
            req.session.save(err => {
                if (err) {
                    console.error('Session save error:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.status(200).send('User saved successfully');
                }
            });
        } else {
            console.log('User already exists.');
            res.status(200).send('User already exists');
        }
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to fetch user data from session
app.get('/api/user', ensureAuthenticated, (req, res) => {
    console.log('GET /api/user route hit');
    console.log('Session user:', req.session.user); // Debug log
    res.json(req.session.user);
});



// Other routes...
app.get('/api/user', ensureAuthenticated, (req, res) => {
    console.log('GET /api/user route hit');
    console.log('Session user:', req.session.user); // Debug log
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
