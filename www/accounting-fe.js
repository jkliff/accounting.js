jQuery (function ($) {


var NewRecordDialog = function () {
    this.el = $('#t_RecordEdit').dialog ({autoOpen: false});
    this.el.css ('display: none;');
    this.data = {
        _id: null,
        title : null,
        date: null,
        locality: null,
        description: null,
        amount: null
    };

    for (f in this.data) {
        var el = $('#t_RecordEdit input[name = \'' + f + '\']')[0];
        console.log ('binding ' + f);


        $(el).change (function (field, that) {
            return function (e) {
                console.log('setting ', field, that);
                that.data[field] = e.srcElement.value;
            }
        }(f, this));
    }

    $('button#record_edit_submit').click (function (that) {
        return function (e) {
            var d = that.data;
            that.close();
            submit (d);
            console.log (e, 'antes ', d);
            //recordList.add (d);
        };
    } (this));

    
    $('button#record_edit_cancel').click (function (that) {
        return function () {
            that.close();
        };
    }(this));

}

NewRecordDialog.prototype = {
    open : function () {
        this.el.dialog ('open');
    },
    close : function () {
        console.log ('there', this.data);
        this.el.dialog('close');
    },
    reset: function () {
        console.log('reset');
        this.data = {
            _id: null,
            title : null,
            date: null,
            locality: null,
            description: null,
            amount: null
        };
        console.log (this.data);

        for (f in this.data) {
            var el = $('#t_RecordEdit input[name = \'' + f + '\']')[0];
            if (!el) {
                continue;
            }
            el.value = this.data [f];
        }
    }
};

var RecordList = function () {
    this._records = [];
    this._dt = $('#RecordsPlaceholder').dataTable({'aoColumns' : [{'sTitle': 'Title'}, {'sTitle': 'Amount'}]});
};

RecordList.prototype = {
    add: function (d) {
        this._records.push (d);
        console.log ([d.title, d.amount]);
        console.log ($('#RecordsPlaceholder').dataTable().fnAddData ([d.title, d.amount]));
    }
}

var AccountabilityApp = function () {
    var recordEditDialog = new NewRecordDialog;
    var recordList = new RecordList;

    $('button#cmd_new_record').click (function () {
        recordEditDialog.reset();
        recordEditDialog.open();
    });
    submit = function (data) {
        console.log ('will submit ', data);
        recordList.add (data);

    };

    console.log ('accountability ok');
}


window.App = new AccountabilityApp;

console.log ('scripts initialized.');

})
