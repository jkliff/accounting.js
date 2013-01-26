var exec = require ('child_process').exec;

var DAO = function () {
}

DAO.prototype = {
    //command : 'pgcrud.py',
    //profile : 'accounting.js-prod',
    //entity : 'record',
    _ : function (method, cb) {
        var cmd = 'pgcrud.py accounting.js list accounting.expense';
        console.log ('issuing command', cmd);
        exec (cmd , function (error, stdout, stderr) {
            console.log (error, stdout, stderr);
            if (error) {
                console.log ('there was an error calling pgcrud');
            }
            var v = eval (stdout);
            var o = new Array;

            for (i in v) {
                o.push ({
                    _id:            v[i]['e_id'],
                    amount:         v[i]['e_value'],
                    title:          v[i]['e_title'],
                    date:           v[i]['e_created'],
                    description:    v[i]['e_description'],
                    locality:       v[i]['e_locality']
                });
            }
            cb (o);
        });
    },
    list : function (cb) {
        return this._ ('list', cb);
    }
}


var AccountingService = function () {
}

AccountingService.DAO = new DAO ();

AccountingService.prototype = {

    list : function (cb) {
        AccountingService.DAO.list (cb);
    },

    save: function (cb) {
        console.log ('save');
    }
};

exports.AccountingService = AccountingService;
