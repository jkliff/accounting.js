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
            // copy the object
            var d = jQuery.extend (true, {}, that.data);
            that.close();
            submit (d);
        };
    } (this));

    $('button#record_edit_cancel').click (function (that) {
        return function () {
            that.close();
        };
    }(this));
}

NewRecordDialog.prototype = {
    open : function (data) {
        console.log ('open', data);
        if (data != undefined) {
            console.log (data);
            this.reset (data);
        }
        this.el.dialog ('open');
    },
    close : function () {
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
    reset: function (newData) {
        console.log ('resetting', newData);
        for (i in this._elToReset) {
            var el = this._elToReset[i];
            var v = null;
            if (newData != null) {
                v = newData[el.name];
            }
            el.value = this.data [el.name] = v;
        }
    },
    _bindToFields: function (data, elName, extraFields) {

        for (f in data) {
            var fieldType = 'input';
            if (extraFields.hasOwnProperty (f)) {
                console.log ('extra');
                fieldType = 'textarea';
            }
            var el = $(elName + ' ' + fieldType + '[name = \'' + f + '\']')[0];

            $(el).change (function (field, that) {
                return function (e) {
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
    this._dt = null;
    this.recordEditDialog;
};

RecordList.prototype = {
    add: function (d) {
        console.log ('adding...', d, this._records);
        this._records.push (d);
        this._dt.fnAddData ([d.title, d.amount]);
        console.log ('after add', this._records);
    },

    __formatRow: function (list) {
        console.log ('running format row;');
        return function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            console.log ('running generator function', nRow, aData, iDisplayIndex, iDisplayIndexFull);
            $('td:eq(1)', nRow).html('<a href="javascript:">' + $('td:eq(1)', nRow).html() + '</a>')
                .click (
                    function () {
                        console.log ('handling click that was set on row callback', this, list, 
                                    iDisplayIndex, list._records [iDisplayIndex]);
                        list.recordEditDialog.open (list._records [iDisplayIndex]);
                    }
                );
        }
    },

    refresh : function () {

        console.log ('refresh', this._dt);
        $.getJSON ('op/list')
            .success(function (that) {
                console.log ('fa',  that);
                return function (data) {
                    console.log ('returned', data, that);
                    that._records = data;
                    if (that._dt != null) {
                        that._dt.fnDestroy()
                    }
                    console.log ('success');
                    that._dt = $('#RecordsPlaceholder').dataTable({
                        'aoColumns' : [{'sTitle': 'Title'}, {'sTitle': 'Amount'}],
                        'aaData': data.map (function (i) {
                            return [i.title, i.amount];
                        }),
                        // don't sort
                        'aaSorting': [],
                        'fnRowCallback': that.__formatRow(that)}
                    );
                    console.log (that._records);
                }
            } (this))
            .error (function (e) {
                console.log ('error ' + e);
                // FIXME: warn the ui that was a failure
                alert ('could not fetch initial list.');
            });
    }
}

/**
 * Main application controller.
 *
 */

var AccountabilityApp = function () {

    var recordEditDialog = new NewRecordDialog;
    var recordList = new RecordList;

    recordList.recordEditDialog = recordEditDialog;
    recordList.refresh();

    $('button#cmd_new_record').click (function () {
        recordEditDialog.reset();
        recordEditDialog.open();
    });

    $('button#cmd_refresh_list').click (function () {
        recordList.refresh();
    });

    submit = function (data) {
        console.log ('will submit ', data);
        recordList.add (data);

        // FIXME: make REST-y with PUT on resource Record.
        $.ajax ({
            url : 'op/put',
            type: 'post',
            data: JSON.stringify (data)
        });
    };

    console.log ('accountability ok');
}

window.App = new AccountabilityApp;

console.log ('scripts initialized.');

})
