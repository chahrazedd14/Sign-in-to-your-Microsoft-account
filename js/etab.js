(function ($, window, document, undefined) {
    var pluginName = "editable",
        defaults = {
            keyboard: true,
            dblclick: true,
            button: true,
            buttonSelector: ".edit",
            maintainWidth: true,
            dropdowns: {},
            edit: function () {
            },
            save: function () {
            },
            cancel: function () {
            }
        };

    function editable(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    editable.prototype = {
        init: function () {
            this.editing = false;

            if (this.options.dblclick) {
                $(this.element)
                    .css('cursor', 'pointer')
                    .bind('dblclick', this.toggle.bind(this));
            }

            if (this.options.button) {
                $(this.options.buttonSelector, this.element)
                    .bind('click', this.toggle.bind(this));
            }
        },

        toggle: function (e) {
            e.preventDefault();

            this.editing = !this.editing;

            if (this.editing) {
                this.edit();
            } else {
                this.save();
            }
        },

        edit: function () {
            var instance = this,
                values = {};

            $('td[data-field]', this.element).each(function () {
                var input,
                    field = $(this).data('field'),
                    value = $(this).text(),
                    width = $(this).width();

                values[field] = value;

                $(this).empty();

                if (instance.options.maintainWidth) {
                    $(this).width(width);
                }

                if (field in instance.options.dropdowns) {
                    input = $('<select></select>');

                    for (var i = 0; i < instance.options.dropdowns[field].length; i++) {
                        $('<option></option>')
                            .text(instance.options.dropdowns[field][i])
                            .appendTo(input);
                    }
                    input.val(value)
                        .data('old-value', value)
                        .dblclick(instance._captureEvent);
                } else {
                    input = $('<input type="text" />')
                        .val(value)
                        .data('old-value', value)
                        .dblclick(instance._captureEvent);
                }

                input.appendTo(this);

                if (instance.options.keyboard) {
                    input.keydown(instance._captureKey.bind(instance));
                }
            });

            this.options.edit.bind(this.element)(values);
        },

        save: function () {
            var instance = this,
                values = {};

            values["id"] = this.element.getAttribute('data-id');

            $('td[data-field]', this.element).each(function () {
                var value = $(':input', this).val();

                values[$(this).data('field')] = value;
                if ($(this).data('field') == "status") {
                    if (value.trim().toLocaleLowerCase() == "active") {
                        $(this).empty().append("<span class=\"status-indicator active " +
                            (values["id"] == null ? "new" : "") + "\"></span>" + value.trim());
                    } else {
                        $(this).empty().text(value.trim());
                    }
                } else {
                    $(this).empty().text(value.trim());
                }
            });

            console.log('save');
            this.options.save.bind(this.element)(values);
        },

        cancel: function () {
            var instance = this,
                values = {};

            $('td[data-field]', this.element).each(function () {
                var value = $(':input', this).data('old-value');

                values[$(this).data('field')] = value;

                $(this).empty()
                    .text(value);
            });

            this.options.cancel.bind(this.element)(values);
        },

        _captureEvent: function (e) {
            e.stopPropagation();
        },

        _captureKey: function (e) {
            if (e.which === 13) {
                this.editing = false;
                this.save();
            } else if (e.which === 27) {
                this.editing = false;
                this.cancel();
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                    new editable(this, options));
            }
        });
    };

})(jQuery, window, document);

editTable();

//custome editable starts
function editTable() {

    $(function () {
        var pickers = {};

        $('table tr').editable({
            dropdowns: {
                sex: ['Male', 'Female']
            },
            edit: function (values) {
                $(".edit i", this)
                    .removeClass('fa-pencil')
                    .addClass('fa-save')
                    .attr('title', 'Save');
            },
            save: function (values) {
                $(".edit i", this)
                    .removeClass('fa-save')
                    .addClass('fa-pencil')
                    .attr('title', 'Edit');
                console.log(values);
                if (values.id == null) {
                    delete values["id"];
                    addNewEtab(values, this);
                } else {
                    updateEtab(values);
                }
            },
            cancel: function (values) {
                $(".edit i", this)
                    .removeClass('fa-save')
                    .addClass('fa-pencil')
                    .attr('title', 'Edit');

            }
        });
    });

}

$(".add-row").click(function () {
    $("#editableTable").find("tbody tr:first").before("<tr><td data-field='name'></td><td data-field='genre'></td><td data-field='etab_id'></td><td data-field='status'><span class=\"status-indicator active new\"></span>Active</td><td><a class='button button-small edit' title='Edit'><i class='fa fa-pencil'></i></a> <a class='button button-small' title='Delete'><i class='fa fa-trash'></i></a></td></tr>");
    editTable();
    setTimeout(function () {
        $("#editableTable").find("tbody tr:first td:last a[title='Edit']").click();
    }, 200);

    setTimeout(function () {
        $("#editableTable").find("tbody tr:first td:first input[type='text']").focus();
    }, 300);

    $("#editableTable").find("a[title='Delete']").unbind('click').click(function (e) {
        $(this).closest("tr").remove();
        deleteItem(this.getAttribute("data-id"));
    });

});

$("#messages2-tab").click(() => {
    getEtab();
});


function getEtab(offset = 0) {
    $.post("../Views/etab.php",
        {
            offset: offset,
            type: "getEtab"
        },
        (data, status) => {
            let json = JSON.parse(data);
            console.log(json);
            if (status === "success") {
                if (json.status === "ok") {
                    $("#editableTable").find("tbody").empty();
                    for (let item of json.data) {
                        if (item.status === null) {
                            item.status = "";
                        }
                        if (item.genre === null) {
                            item.genre = "";
                        }
                        if (item.etab_id === null) {
                            item.etab_id = "";
                        }
                        if (item.name === null) {
                            item.name = "";
                        }
                        $("#editableTable").find("tbody").append("<tr data-id='" + item.id + "'><td data-field='name'>"
                            + item.name + "</td><td data-field='genre'>" + item.genre +
                            "</td><td data-field='etab_id'>" + item.etab_id +
                            "</td><td data-field='status'><span class=\"status-indicator " +
                            (item.status !== null && (item.status.trim().toLocaleLowerCase() == "active" ? "active" : "")) +
                            "\"></span>" + item.status + "</td><td><a class='button button-small edit' title='Edit'><i class='fa fa-pencil'></i></a> <a class='button button-small' title='Delete'><i class='fa fa-trash'></i></a></td></tr>");
                        editTable();
                        $("#editableTable").find("a[title='Delete']").unbind('click').click(function (e) {
                            deleteItem($(this).closest("tr").data("id"));
                            $(this).closest("tr").remove();
                        });
                    }
                }
            }
        });
}


function updateEtab(values) {
    $.post("../Views/etab.php",
        {
            ...values,
            type: "updateEtab"
        },
        (data, status) => {
            let json = JSON.parse(data);
            console.log(json);
            if (status === "success") {
                if (json.status === "ok") {

                }
            }
        });
}

function addNewEtab(values, elm) {
    $.post("../Views/etab.php",
        {
            ...values,
            type: "addEtab"
        },
        (data, status) => {
            let json = JSON.parse(data);
            console.log(json);
            if (status === "success") {
                if (json.status === "ok") {
                    elm.setAttribute("data-id", json.id);
                }
            }
        });
}

function deleteItem(id) {
    if (id == null) {
        return;
    }
    $.post("../Views/etab.php",
        {
            id: id,
            type: "deleteEtab"
        },
        (data, status) => {
            let json = JSON.parse(data);
            console.log(json);
            if (status === "success") {
                if (json.status === "ok") {

                }
            }
        });
}