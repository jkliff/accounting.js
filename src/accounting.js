var exec = require ('child_process').exec,
    util = require ('util');

var DAO = function () {
}

DAO.prototype = {
    //command : 'pgcrud.py',
    //profile : 'accounting.js-prod',
    //entity : 'record',
    _ : function (method, cb, data) {
        if (!method) {
            console.log ('Invalid or empty method given.');
        }
        var cmd = util.format ('pgcrud.py accounting.js %s accounting.expense', method);
        if (data !== undefined) {
            cmd += util.format (" \'%j\'", {
                e_value         : data.amount,
                e_title         : data.title,
                e_description   : data.description,
                e_locality      : data.locality,
                e_date          : data.date
            });
        }
        console.log (util.format ('issuing command [%s]', cmd));

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
                    date:           v[i]['e_date'],
                    description:    v[i]['e_description'],
                    locality:       v[i]['e_locality']
                });
            }
            cb (o);
        });
    },

    list : function (cb) {
        return this._ ('list', cb);
    },

    save : function (cb, data) {
        console.log ('on save', data);
        return this._ ('create', cb, data);
    }
}

var AccountingService = function () {
}

AccountingService.DAO = new DAO ();

AccountingService.prototype = {

    list : function (cb, discarded) {
        AccountingService.DAO.list (cb);
    },

    save: function (cb, data) {
        AccountingService.DAO.save (cb, data);
    }
};

exports.AccountingService = AccountingService;
