#!env node

//var CONN_STRING = {
//    user: 'johnxxx',
//    password: 'QLCtWjNVMU3CU2q',
//    host: 'bataille',
//    port: '5432',
//    database: 'playground'
//};
var CONN_STRING = 'pg://johnxx:5432@localhost:5432/foo';

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var http = require('http'),
    qs = require ('querystring'),
    app = http.createServer(handler),
    fs = require('fs'),
    accounting = require('./accounting.js');

var accountingService = new accounting.AccountingService (CONN_STRING, function (err, client) {
    console.log ('Constructing accounting service');
    console.log (err);
    console.log (client);
    console.log ('-------------');
});

console.log (process.argv);

var port = process.argv[2] == null ? 15233 : process.argv [2];
app.listen(port);

var HANDLERS =  {
    'list'  : {
        fcn: function (cb, req) {
            accountingService.list (cb)
        }
    },
    'put'   : {
        fcn: function (cb, req) {
            //accountingService.save (cb, convert (req));
        //paramConverter : function (req) {


            

            var data = '';
            var data2;
            req.on ('data', function (d) {
                console.log ('getting data', d);
                data += d;
            });

            req.on ('end', function () {
                data2 = JSON.parse (data);
                console.log ('will send', data2);
                accountingService.save (cb, data2);
            });

        }
    }
};

function handleRequest (req, res) {
    console.log ('upon handling request,', HANDLERS);
    var f = req.url.substr (4);
    var fhandler = HANDLERS [f];

    if (!fhandler) {
        res.writeHead (500);
        res.end ('no such method ' + f);
        console.log ('Cannot handle request for', f, req.url);
        return;
    }

    fhandler.fcn (
        function (data) {
            res.writeHead (200);
            res.end (JSON.stringify (data));
        },
        //        fhandler.paramConverter === undefined ? null : fhandler.paramConverter (req)
        req
    );
}

function handler (req, res) {
    console.log (req.url);
    if (req.url.indexOf ('/op') == 0) {
        handleRequest (req, res);
        return;
    }

    if (req.url == '/') {
        req.url = '/index.html'
    }
    var f = __dirname +  '/../www' + req.url;
    //console.log (f);
    fs.readFile(f,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }
            if (req.url.endsWith ('html')) {
                res.setHeader("Content-Type", "text/html");
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}

