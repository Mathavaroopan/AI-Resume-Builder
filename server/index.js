const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// Create and connect to the SQLite database
const db = new sqlite3.Database('./resumes.db', (err) => {
    if (err) {
        console.error('Error connecting to the SQLite database:', err);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// Create the necessary tables if they don't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    // Add other necessary tables like education, experience, etc. here
    db.run(`CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resumeId TEXT,
        universityName TEXT,
        startDate TEXT,
        endDate TEXT,
        degree TEXT,
        major TEXT,
        description TEXT,
        FOREIGN KEY (resumeId) REFERENCES resumes (id)
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resumeId TEXT,
        title TEXT,
        companyName TEXT,
        city TEXT,
        state TEXT,
        startDate TEXT,
        endDate TEXT,
        workSummery TEXT,
        FOREIGN KEY (resumeId) REFERENCES resumes (id)
    )`);
});

app.get("/", (req, res) => {
    res.send("Hello world");
});

// API endpoint to check and create user
app.post('/api/check-or-create-user', (req, res) => {
    const { email, fullName } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    const createUserQuery = 'INSERT INTO users (fullName, email) VALUES (?, ?)';

    db.get(checkUserQuery, [email], (err, user) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).send('Server error');
            return;
        }

        if (user) {
            // User exists
            res.send({ message: 'User exists', user });
            console.log(user);
        } else {
            // User does not exist, create a new one
            db.run(createUserQuery, [fullName, email], function(err) {
                if (err) {
                    console.error('Error creating user:', err);
                    res.status(500).send('Server error');
                    return;
                }
                res.send({ message: 'User created', user: { id: this.lastID, fullName, email } });
                console.log("Successfully created");
            });
        }
    });
});

app.listen(3001, () => {
    console.log("Server is running on 3001");
});
