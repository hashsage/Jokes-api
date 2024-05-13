const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Dummy database
let db = [];

// Middleware
app.use(bodyParser.json());

// Routes
// GET all jokes
app.get('/', (req, res) => {
    res.json(db);
});

// POST a joke
app.post('/', (req, res) => {
    const { title, comedian, year } = req.body;
    const id = db.length + 1; // Generate id
    const joke = { id, title, comedian, year };
    db.push(joke);
    res.json(db);
});

// PATCH a joke
app.patch('/joke/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, comedian, year } = req.body;

    db = db.map(joke => {
        if (joke.id === id) {
            joke.title = title || joke.title;
            joke.comedian = comedian || joke.comedian;
            joke.year = year || joke.year;
        }
        return joke;
    });

    const updatedJoke = db.find(joke => joke.id === id);
    res.json(updatedJoke);
});

// DELETE a joke
app.delete('/joke/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const deletedJoke = db.find(joke => joke.id === id);
    db = db.filter(joke => joke.id !== id);
    res.json(deletedJoke);
});

// Start the server using nodemon
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
