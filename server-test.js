
import http from 'http';
const port = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('SUCCESS: The server infrastructure is working!');
});
server.listen(port, '0.0.0.0', () => {
    console.log('Test server running on port ' + port);
});
