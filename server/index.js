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

// // Create the necessary tables if they don't exist
// db.serialize(() => {
//     db.run(`DROP TABLE IF EXISTS skills`);
//     db.run(`DROP TABLE IF EXISTS experience`);
//     db.run(`DROP TABLE IF EXISTS education`);
//     db.run(`DROP TABLE IF EXISTS resumes`);
//     db.run(`DROP TABLE IF EXISTS users`);
// });

db.serialize(() => {
    // Create the users table with updated columns
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        address TEXT,
        summery TEXT
    )`);


    // Create the resumes table with a default value for themeColor
    db.run(`CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        title TEXT,
        userId INTEGER,
        themeColor TEXT DEFAULT '#ff6666',
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);

    // Create the education table
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

    // Create the experience table
    db.run(`CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resumeId TEXT,
        title TEXT,
        companyName TEXT,
        city TEXT,
        state TEXT,
        startDate TEXT,
        endDate TEXT,
        workSummary TEXT,
        FOREIGN KEY (resumeId) REFERENCES resumes (id)
    )`);

    // Create the skills table
    db.run(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resumeId TEXT,
        name TEXT,
        rating INTEGER,
        FOREIGN KEY (resumeId) REFERENCES resumes (id)
    )`);
});


app.post('/api/update-resume', (req, res) => {
    const { resumeId, firstName, lastName, jobTitle, address, phone, email, summery, themeColor, education, experience, skills } = req.body;

    if (!resumeId) {
        return res.status(400).send('Resume ID is required');
    }

    const updateResumeQuery = `
        UPDATE resumes
        SET title = ?, themeColor = ?, userId = (
            SELECT id FROM users WHERE email = ?
        )
        WHERE id = ?
    `;

    const updateUserQuery = `
        UPDATE users
        SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, summery = ?
        WHERE email = ?
    `;

    // Queries for updating related records
    const updateEducationQuery = `
        UPDATE education
        SET universityName = ?, startDate = ?, endDate = ?, degree = ?, major = ?, description = ?
        WHERE id = ? AND resumeId = ?
    `;

    const updateExperienceQuery = `
        UPDATE experience
        SET title = ?, companyName = ?, city = ?, state = ?, startDate = ?, endDate = ?, workSummary = ?
        WHERE id = ? AND resumeId = ?
    `;

    const updateSkillsQuery = `
        UPDATE skills
        SET name = ?, rating = ?
        WHERE id = ? AND resumeId = ?
    `;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Update resume
        db.run(updateResumeQuery, [jobTitle, themeColor, email, resumeId], function(err) {
            if (err) {
                console.error('Error updating resume:', err);
                db.run('ROLLBACK');
                return res.status(500).send('Server error');
            }

            // Update user
            db.run(updateUserQuery, [firstName, lastName, email, phone, address, summery, email], function(err) {
                if (err) {
                    console.error('Error updating user:', err);
                    db.run('ROLLBACK');
                    return res.status(500).send('Server error');
                }

                // Helper function to update records
                const updateRecords = (tableName, data, updateQuery, callback) => {
                    let count = data.length;
                    if (count === 0) return callback();

                    data.forEach(item => {
                        const { id, ...values } = item;
                        db.run(updateQuery, [...Object.values(values), id, resumeId], err => {
                            if (err) {
                                console.error(`Error updating ${tableName}:`, err);
                            }
                            if (--count === 0) callback();
                        });
                    });
                };

                // Update education records
                updateRecords('education', education || [], updateEducationQuery, () => {
                    
                    // Update experience records
                    updateRecords('experience', experience || [], updateExperienceQuery, () => {

                        // Update skills records
                        updateRecords('skills', skills || [], updateSkillsQuery, () => {
                            
                            // Commit transaction
                            db.run('COMMIT', err => {
                                if (err) {
                                    console.error('Error committing transaction:', err);
                                    db.run('ROLLBACK');
                                    return res.status(500).send('Server error');
                                }
                                console.log("data committed");
                                res.send({ message: 'Resume and related details updated successfully' });
                            });
                        });
                    });
                });
            });
        });
    });
});



app.get("/", (req, res) => {
    res.send("Hello world");
});
app.post('/api/get-resume-ids', (req, res) => {
    const { userEmail } = req.body;
    console.log(userEmail);

    // Find userId from email
    db.get('SELECT id FROM users WHERE email = ?', [userEmail], (err, user) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).send('Server error');
            return;
        }
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const userId = user.id;

        // Fetch all resume IDs for the user
        db.all('SELECT id FROM resumes WHERE userId = ?', [userId], (err, resumes) => {
            console.log(resumes);
            if (err) {
                console.error('Error fetching resume IDs:', err);
                res.status(500).send('Server error');
                return;
            }
            res.send(resumes);
        });
    });
});

app.get('/api/get-resume-details', (req, res) => {
    const { resumeId } = req.query; // Use req.query to get query parameters
    console.log("I got the id", resumeId);

    if (!resumeId) {
        return res.status(400).send('Resume ID is required');
    }

    // Fetch resume basic details
    db.get(`
        SELECT u.firstName, u.lastName, u.email, r.title AS jobTitle, 
               address, phone, themeColor, summery
        FROM resumes r
        JOIN users u ON r.userId = u.id
        WHERE r.id = ?
    `, [resumeId], (err, resume) => {
        if (err) {
            console.error('Error fetching resume details:', err);
            res.status(500).send('Server error');
            return;
        }
        if (!resume) {
            res.status(404).send('Resume not found');
            return;
        }

        // Fetch experience
        db.all('SELECT id, title, companyName, city, state, startDate, endDate, workSummary FROM experience WHERE resumeId = ?', [resumeId], (err, experience) => {
            if (err) {
                console.error('Error fetching experience:', err);
                res.status(500).send('Server error');
                return;
            }

            // Fetch education
            db.all('SELECT id, universityName, startDate, endDate, degree, major, description FROM education WHERE resumeId = ?', [resumeId], (err, education) => {
                if (err) {
                    console.error('Error fetching education:', err);
                    res.status(500).send('Server error');
                    return;
                }

                // Fetch skills
                db.all('SELECT id, name, rating FROM skills WHERE resumeId = ?', [resumeId], (err, skills) => {
                    if (err) {
                        console.error('Error fetching skills:', err);
                        res.status(500).send('Server error');
                        return;
                    }

                    // Format the experience data
                    const formattedExperience = experience.map(exp => ({
                        id: exp.id,
                        title: exp.title,
                        companyName: exp.companyName,
                        city: exp.city,
                        state: exp.state,
                        startDate: exp.startDate,
                        endDate: exp.endDate || '', // Default to empty string if endDate is missing
                        currentlyWorking: !exp.endDate, // Determine if currently working based on endDate
                        workSummery: exp.workSummary || 'No work summary provided' // Default if workSummary is missing
                    }));

                    // Send the response
                    res.send({
                        resumeId: resumeId,
                        firstName: resume.firstName || null,
                        lastName: resume.lastName || null,
                        jobTitle: resume.jobTitle || null,
                        address: resume.address || null,
                        phone: resume.phone || null,
                        email: resume.email,
                        themeColor: resume.themeColor || '#ff6666',
                        summery: resume.summery || 'No summary provided',
                        experience: formattedExperience,
                        education,
                        skills
                    });
                });
            });
        });
    });
});

app.post('/api/check-or-create-user', (req, res) => {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
        return res.status(400).send('Email and fullName are required');
    }

    console.log('Received data:', { email, fullName });

    // Query to check if a user exists with the same email and fullName
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? AND firstName = ?';
    // Query to create a new user
    const createUserQuery = 'INSERT INTO users (firstName, email) VALUES (?, ?)';

    // Check if user exists
    db.get(checkUserQuery, [email, fullName], (err, user) => {
        if (err) {
            console.error('Error checking user:', err);
            res.status(500).send('Server error');
            return;
        }

        if (user) {
            // User exists
            res.send({ message: 'User exists', user });
        } else {
            // User does not exist, create a new one
            db.run(createUserQuery, [fullName, email], function(err) {
                if (err) {
                    console.error('Error creating user:', err);
                    res.status(500).send('Server error');
                    return;
                }
                res.send({ message: 'User created', user: { id: this.lastID, firstName: fullName, email } });
            });
        }
    });
});


// API endpoint to create a new resume
app.post('/api/create-resume', (req, res) => {
    const { title, resumeId, userEmail, userName } = req.body;

    // Find userId from email
    db.get('SELECT id FROM users WHERE email = ?', [userEmail], (err, user) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).send('Server error');
            return;
        }
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        const userId = user.id;

        // Insert new resume
        console.log("About to insert resume");
        const createResumeQuery = 'INSERT INTO resumes (id, title, userId) VALUES (?, ?, ?)';
        db.run(createResumeQuery, [resumeId, title, userId], function(err) {
            if (err) {
                console.error('Error creating resume:', err);
                res.status(500).send('Server error');
                return;
            }
            console.log("Resume added");
            res.status(201).send({ message: 'Resume created', resumeId });
        });
    });
});

app.listen(3001, () => {
    console.log("Server is running on 3001");
});
