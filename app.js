#!env node

var CONN_STRING = 'tcp://john:QLCtWjNVMU3CU2q@bataille/playground';

var http = require('http'),
    url = require ('url'),
    app = http.createServer(handler),
    fs = require('fs'),
    accounting = require('./accounting.js');

var accountingService = new accounting.AccountingService (CONN_STRING);

app.listen(8000);

var HANDLERS =  {
            'list': accountingService.list
};

function handleRecord (req, res) {
    accountingService [req.url.substr(4)](function (data) {
        res.writeHead (200);
        console.log ('returning...', data);
        res.end (data);
    });
    //res.end(HANDLERS[req.url.substr (4)] ());
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

