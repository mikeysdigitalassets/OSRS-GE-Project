const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"worlds",
    password:"kali",
    port: 5432,
});

app.use(express.json());
app.use(cors());

app.get("/api/items", async (req, res) => {
    const searchQuery = req.query.q;
    try {
        let result;
        if (searchQuery) {
            result = await pool.query(
                `SELECT id, name FROM osrs_items where name ILIKE $1 LIMIT 10`,
                [`%${searchQuery}%`]
            );
        } else {
            result = await pool.query(`SELECT id, name FROM osrs_items LIMIT 10`)
        }
        res.json(result.rows);
        
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server error`);
    }
});






app.listen(port, () => {
    console.log(`Server is running on port ${port}. `)
})