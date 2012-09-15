#!env node

//var CONN_STRING = {
//    user: 'johnxxx',
//    password: 'QLCtWjNVMU3CU2q',
//    host: 'bataille',
//    port: '5432',
//    database: 'playground'
//};
var CONN_STRING = 'pg://johnxx:5432@localhost:5432/foo';

var http = require('http'),
    url = require ('url'),
    app = http.createServer(handler),
    fs = require('fs'),
    accounting = require('./accounting.js');

var accountingService = new accounting.AccountingService (CONN_STRING, function (err, client) {
    console.log (err);
    console.log (client);
});

app.listen(8000);

var HANDLERS =  {
    'list'  : accountingService.list,
    'put'   : accountingService.save
};

function handleRecord (req, res) {
    var f = req.url.substr (4);
    var fhandler = accountingService [f];

    fhandler (function (data) {
        res.writeHead (200);
        res.end (JSON.stringify (data));
    });
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
    //console.log (f);
    fs.readFile(f,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}

