const http = require('http');
const url = require('url');
const querystring = require('querystring');
const PORT = 3000;

// Dummy database
let db = [];

// Create server
const server = http.createServer((req, res) => {
    const { method, url: reqUrl } = req;
    const parsedUrl = url.parse(reqUrl, true);

    // Parse query parameters
    const { pathname, query } = parsedUrl;

    // Parse POST data
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        let postData = {};
        if (body) {
            postData = querystring.parse(body);
        }

        // Routes
        if (method === 'GET' && pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db));
        } else if (method === 'POST' && pathname === '/') {
            const { title, comedian, year } = postData;
            const id = db.length + 1;
            const joke = { id, title, comedian, year };
            db.push(joke);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db));
        } else if (method === 'PATCH' && pathname.startsWith('/joke/')) {
            const id = parseInt(pathname.split('/')[2]);
            const { title, comedian, year } = postData;
            const index = db.findIndex(joke => joke.id === id);
            if (index !== -1) {
                db[index].title = title || db[index].title;
                db[index].comedian = comedian || db[index].comedian;
                db[index].year = year || db[index].year;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(db[index]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Joke not found' }));
            }
        } else if (method === 'DELETE' && pathname.startsWith('/joke/')) {
            const id = parseInt(pathname.split('/')[2]);
            const index = db.findIndex(joke => joke.id === id);
            if (index !== -1) {
                const deletedJoke = db.splice(index, 1);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(deletedJoke[0]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Joke not found' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Route not found' }));
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

