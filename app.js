#!env node

var http = require('http'),
    url = require ('url'),
    app = http.createServer(handler),
    fs = require('fs'),
    accounting = require('./accounting.js');

app.listen(8000);

function handleRecord (req, res) {
    console.log (req);
    console.log (res);
}

function handler (req, res) {
    console.log (req.url);
    if (req.url.indexOf ('/op') == 0) {
        handleRecord (req, res);
        return;
    }

    if (req.url == '/') {
        req.url = '/index.html'
    }
    var f = __dirname +  '/www' + req.url;
    console.log (f);
    fs.readFile(f,
        function (err, data) {
            console.log ('foo' + err);
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}


