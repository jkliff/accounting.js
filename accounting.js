
var pg = require ('pg');

var AccountingService = function (connString) {
    console.log ('fooo' + connString);
    this.client = new pg.Client (connString);
    this.client.connect();
    this.client.query ('set search_path to accounting_js;');
    console.log (this.client);
}

AccountingService.prototype = {
    list : function (cb) {
        console.log ('list', this, this.client);
        for (i in this) {
            console.log (i);
        }

        this.client.query ('select * from record;', cb);
    }
};

exports.AccountingService = AccountingService;
