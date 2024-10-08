const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

//Für statische Dateien z.B .css frontend .js
app.use(express.static('./public'));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); 

// Route to fetch entries from the SQLite database
app.get('/entries', (req, res) => {
    const sql = 'SELECT date, amount FROM entries ORDER BY date DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        //console.log(rows);
        const responseData = { data: rows }; // Store the response data
        //console.log("Response data: %j", responseData); // Log the JSON response
        res.json(responseData); // Send the response to the client
    });
});

app.get('/update', (req, res) => {
    res.send("NOTHING TO SEE HERE");
});

app.post('/submit', (req, res) => {
// Variablen aus dem HTML FORM
	const date = req.body.date;
	const amount = req.body.amount;
	const sql = 'INSERT INTO entries (date, amount) VALUES (?, ?)';
	
    db.run(sql, [date, amount], (err) => {
        if (err) {
            // Check for unique constraint violation
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ message: 'DATUM EXISTIERT BEREITS' });
            }
        }
        res.redirect('/');            
    })
    
});


app.get('/', async (request, response) => {

    response.send( await readFile('./public/tracker.html', 'utf8') );

});

app.listen(process.env.PORT || 3000,
() => console.log(`App available on http://localhost:3000`))