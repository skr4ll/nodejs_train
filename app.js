const express = require('express');
const app = express();
const { readFile } = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

//Für statische Dateien z.B .css frontend .js
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/entries', (req, res) => {
    const sql = 'SELECT date, amount FROM entries ORDER BY date DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        //console.log(rows);
        const responseData = { data: rows };
        //console.log("Response data: %j", responseData);
        res.json(responseData);
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