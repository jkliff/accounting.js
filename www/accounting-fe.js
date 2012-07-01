jQuery (function ($) {

var NewRecordDialog = function () {
    this.el = $('#t_RecordEdit').dialog ({autoOpen: false});
    this.el.css ('display: none;');
    this.data = this._bindToFields ({
        _id: null,
        title : null,
        date: null,
        locality: null,
        description: null,
        amount: null
    }, '#t_RecordEdit', {'description': 'textarea'});

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
    /**
     * Binding of data to form.
     *
     * _bindToFields binds the fields of a dictionary (this.data) to the direct children of a
     * given element as given by name (elName, in the form of '#myElement'); all fields are
     * of type input. Fields with other types (textarea, radio, etc) can have their types
     * defined in the dict extraFields, where key is field name and value its type.
     *
     * For each key in this.data (key must be iterable; it doesn't matter if it has a value)
     * try to locate a direct child element of the given parent. Bind its 'changed' event
     * to the corresponding entry on data.
     *
     * No validation is made.
     * All fields are presumed inputs unless defined in extraFields.
     *
     * The bound fields will be automatically nulled (in sync with this.data) by reset (along
     * with anything else in _elToReset.
     *
     * TODO: locate per name without type (unless required per name of event?)
     *
     */
    _elToReset : [],
    reset: function () {
        console.log (this.data, 'before', this._elToReset);
        for (i in this._elToReset) {
            var el = this._elToReset[i];
            console.log (el, el.value, this.data, el.name);
            el.value = this.data [el.name] = null;
        }
    },
    _bindToFields: function (data, elName, extraFields) {

        for (f in data) {
            console.log ('binding ' + f);
            var fieldType = 'input';
            if (extraFields.hasOwnProperty (f)) {
                console.log ('extra');
                fieldType = 'textarea';
            }
            var el = $(elName + ' ' + fieldType + '[name = \'' + f + '\']')[0];

            $(el).change (function (field, that) {
                return function (e) {
                    console.log('setting ', field, that);
                    that.data[field] = e.srcElement.value;
                }
            }(f, this));

            this._elToReset.push (el);
        }
        return data;
    }
};

var RecordList = function () {
    this._records = [];
    this._dt = $('#RecordsPlaceholder').dataTable(
        {'aoColumns' : [{'sTitle': 'Title'}, {'sTitle': 'Amount'}]}
    );
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
