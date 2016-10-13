/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

var nistush = function () {

    var config = {
        webServiceUrl: enzinak.Templator.fixIn('http://[Host]/doc/ws/service.php', {
            Host: window.location.href.split('/')[2]
        })
    };

    var cache = {
        Session: enzinak.Singleton(function () {
            var SESSION = "doc_session";
            this.clear = function (data) {
                localStorage.removeItem(SESSION);
            };
            this.store = function (data) {
                localStorage.setItem(SESSION, JSON.stringify(data));
            };
            this.retrieve = function () {
                if (localStorage.getItem(SESSION) !== null) {
                    return JSON.parse(localStorage.getItem(SESSION));
                }
                return null;
            };
            this.admittance = function (proceed) {
                if (this.retrieve() !== null) {
                    proceed();
                }
            };
        }),
        Storage: enzinak.Singleton(function () {
            var STORAGE = "doc_storage",
                id;
            this.setId = function (uid) {
                id = '_' + uid;
            };
            this.clear = function (data) {
                localStorage.removeItem(STORAGE + id);
            };
            this.store = function (data) {
                localStorage.setItem(STORAGE + id, JSON.stringify(data));
            };
            this.retrieve = function () {
                if (localStorage.getItem(STORAGE + id) !== null) {
                    return JSON.parse(localStorage.getItem(STORAGE + id));
                }
                return null;
            };
            this.admittance = function (proceed) {
                if (this.retrieve() !== null) {
                    proceed();
                }
            };
        }),
    };

    var app = {
        mode: {
            MOB: 'mob',
            WEB: 'web',
            CRX: 'crx'
        },
        initialize: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        onDeviceReady: function () {
            app.receivedEvent('deviceready');
        },
        receivedEvent: function (id) {
            console.log('app.receivedEvent', id);
            oViews.activate('addNewTransaction');
        }
    };

    var utility = {
        changeView: function (e) {
            e.preventDefault();
            var element = $(e.currentTarget);
            var url = element.attr('href');
            if (url == '#') {
                var link = element.data('link');
                if (link != undefined && link != '') {
                    Views.getInstance().activate(link);
                }
            } else {
                window.location.href = url;
            }
        },
        getFormFieldHashMap: function (form) {
            var values = {};
            $.each(form.serializeArray(), function (i, field) {
                if (field.name.lastIndexOf('[]') < 0) {
                    values[field.name] = field.value;
                } else {
                    var fieldname = field.name.substr(0, field.name.lastIndexOf('[]'));
                    if (!values.hasOwnProperty(fieldname)) {
                        values[fieldname] = [];
                    }
                    values[fieldname].push(field.value);
                }
            });
            return values;
        },
        date: {
            locale: function (s) {
                var tz = new Date().getTimezoneOffset();// * 60000;
                var cd = new Date(s.replace('T', ' ').replace('Z', ''));
                var ld = new Date(cd - tz);
                return ld;
            },
            monyear: function (s) {
                if (!/[a-zA-Z]{3}\s[0-9]{4}/.test(s)) {
                    var t = this.locale(s);
                    var d = t.toString().substr(4, 11).split(' ');
                    return d[0] + ' ' + d[2];
                }
                return s;
            },
            short: function (s) {
                var t = this.locale(s);
                var d = t.toString().substr(4, 11).split(' ');
                return d[0] + ' ' + d[1] + ', ' + d[2];
            },
            long: function (s) {
                var t = this.locale(s);
                var d = t.toString().substr(4, 17).split(' ');
                return d[0] + ' ' + d[1] + ', ' + d[2] + ' ' + d[3];
            },
            sentence: function (s) {
                var t = this.locale(s);
                var d = t.toString().substr(4, 17).split(' ');
                return d[0] + ' ' + d[1] + ', ' + d[2] + ' at ' + d[3];
            },
            input: function (s) {
                var t = this.locale(s);
                var d = t.toISOString();
                return d.substring(0, d.indexOf('T'));
            },
            enUS: function (d) {
                return (d) ? enzinak.DatePattern.format(enzinak.DatePattern.culture.en_US, d) : d;
            },
        },
        instancia: function (claz) {
            return new claz();
        }
    };

    var widgets = {
        Field: function () {
            var containers = {};
            this.reset = function () {
                containers.form.trigger('reset');
                var fields = containers.form.find('div.mdl-textfield');
                fields.removeClass('is-dirty');
                fields.removeClass('is-invalid');
                fields.find('label.mdl-radio').removeClass('is-checked');
                fields.find('label.mdl-checkbox').removeClass('is-checked');
                fields.find('span.mdl-textfield__error').html('');
            };
            this.spotInvalid = function (fieldname, bool, message) {
                //console.log('Widgets.Field spotInvalid', fieldname, bool, message);
                if (!bool) {
                    var field = containers.form.find("[name='" + fieldname + "']").parent();
                    if (field.find('span.mdl-textfield__error').length > 0) {
                        field.addClass('is-invalid');
                        field.find('span.mdl-textfield__error').html(message);
                    } else {
                        field = field.parent();
                        field.addClass('is-invalid');
                        field.find('span.mdl-textfield__error').html(message);
                    }
                }
            };
            this.initialize = function (holder) {
                containers.form = holder;
            };
        },
        Feedback: function () {
            var containers = {},
                self = this,
                oDrshya;
            var _constructor = function () {
                oDrshya = new enzinak.Drshya();
            }();
            var clearStyles = function () {
                var types = [self.type.DANGER, self.type.INFO, self.type.SUCCESS, self.type.WARNING];
                containers.self.removeClass(types.join(' '));
            };
            var doffListeners = function () {
                containers.self.off('click', this.hide);
            };
            this.type = {
                SUCCESS: 'success',
                INFO: 'info',
                WARNING: 'warning',
                DANGER: 'danger'
            };
            this.show = function (type, message) {
                clearStyles();
                doffListeners();
                containers.self.addClass(type);
                containers.self.html(message);
                oDrshya.show(containers.self);
                containers.self.on('click', this.hide);
            };
            this.hide = function () {
                clearStyles();
                containers.self.html('');
                oDrshya.hide(containers.self);
                doffListeners();
            };
            this.danger = function (message) {
                this.show(self.type.DANGER, message);
            };
            this.info = function (message) {
                var prefix = (message.indexOf('wait') > -1) ? '<img class="doc-wait">' : '';
                this.show(self.type.INFO, prefix + message);
            };
            this.success = function (message) {
                this.show(self.type.SUCCESS, message);
            };
            this.warning = function (message) {
                this.show(self.type.WARNING, message);
            };
            this.initialize = function (holder) {
                //console.log('Widgets.Feedback.initialize');
                containers.self = holder;
            };
        }
    }

    var modules = {
        Drawer: enzinak.Singleton(function () {
            var self = this;
            var proceed = null;
            var containers = {};
            var controls = {
                onclick: function (e) {
                    e.preventDefault();
                    var link = $(e.target).attr('href');
                    self.activate(link);
                    if (proceed != null) {
                        proceed(link);
                    }
                }
            };
            var submodules = {
                setActiveTab: function (link) {
                    containers.navlinks.removeClass('active');
                    var navlink = containers.navigation.find('a.mdl-navigation__link[href="' + link + '"]');
                    navlink.addClass('active');
                },
                getCurrentHash: function () {
                    var url = window.location.href;
                    return ((url.indexOf('#') > -1) ? url.substr(url.indexOf('#'), url.length) : null);
                }
            };
            this.activate = function (link) {
                if (link.indexOf('#') == -1) {
                    link = '#' + link;
                }
                submodules.setActiveTab(link);
            };
            this.binding = function (callback) {
                proceed = callback;
            };
            this.destroy = function () {
                containers.navlinks.off('click', controls.onclick);
            };
            this.initialize = function () {
                containers.self = $('div.mdl-layout__drawer');
                containers.navigation = containers.self.find('nav.mdl-navigation');
                containers.navlinks = containers.navigation.find('a.mdl-navigation__link');
                containers.navlinks.on('click', controls.onclick);
            };
        }),
        AddNewTransaction: enzinak.Singleton(function () {
            var uid = 'addNewTransaction',
                feedback, field, 
                containers = {},
                controls = {},
                templates = {},
                i18n = {
                    "validations": {
                        "failed": "Try again!",
                        "required_YourName": "Please enter your name",
                        "required_MaterialExchanged": "Please enter the material exchanged",
                        "required_ActionPerformed": "Please enter the action performed",
                        "required_OtherPersonName": "Please select the other person's name",
                    },
                    "sessionexpired": "Session expired!",
                    "loading": "Please wait while we process your request.",
                    "addnotesucceed": "Review saved",
                    "addnotefailed": "Failed to save note.",
                    "error": {
                        "null": "Something went wrong",
                        "timeout": "Request timeout",
                        "error": "Error occurred",
                        "abort": "Request aborted",
                        "parsererror": "Parser error"
                    }
                },
                validations = {
                    YourName: {
                        Required: i18n.validations.required_YourName
                    },
                    MaterialExchanged: {
                        Required: i18n.validations.required_MaterialExchanged
                    },
                    ActionPerformed: {
                        Required: i18n.validations.required_ActionPerformed
                    },
                    OtherPersonName: {
                        Required: i18n.validations.required_OtherPersonName
                    }
                };
            var _constructor = function () {
                feedback = new widgets.Feedback();
                field = new widgets.Field();
            }();

            controls.anchor = utility.changeView;
            controls.submit = function (e) {
                e.preventDefault();

                var onSuccess = function (e) {
                    console.log('modules.AddNewTransaction controls.submit onSuccess', e);
                    if (e.status == 'success') {
                        field.reset();
                        feedback.info(e.response);
                    } else {
                        feedback.danger(e.response);
                    }
                    containers.submit.attr('disabled', false);
                };
                var onFailure = function (jqXHR, textStatus, errorThrown) {
                    console.log('modules.AddNewTransaction controls.submit onFailure', jqXHR, textStatus, errorThrown);
                    containers.submit.attr('disabled', false);
                    feedback.danger(i18n.error[textStatus]);
                };

                feedback.info(i18n.loading);
                containers.submit.attr('disabled', true);

                var validator = new enzinak.FormValidator();
                validator.setErrorCallback(field.spotInvalid);
                validator.setFields(validations);

                var values = utility.getFormFieldHashMap(containers.form);

                if (validator.isValid(values)) {
                    if (navigator.onLine) {
                        Communicator.getInstance().request({
                            service: config.webServiceUrl,
                            command: 'addNewTransaction',
                            payload: values,
                            authkey: '',
                            success: onSuccess,
                            failure: onFailure
                        });
                    } else {
                        feedback.warning(i18n.offline);
                        containers.submit.attr('disabled', false);
                    }
                } else {
                    feedback.danger(i18n.validations.failed);
                    containers.submit.attr('disabled', false);
                }
            };

            this.destroy = function () {
                console.log('modules.AddNewTransaction.destroy');
                containers.anchor.off('click', controls.anchor);
                containers.submit.off('click', controls.submit);
            };
            this.initialize = function () {
                console.log('modules.AddNewTransaction.initialize');
                containers.self = $('#' + uid);

                modules.Drawer.getInstance().activate('addNewTransaction');

                getmdlSelect.init('.getmdl-select');

                containers.anchor = containers.self.find('a[href="#"]');
                containers.anchor.on('click', controls.anchor);

                containers.form = containers.self.find('form');
                containers.form.show();

                containers.submit = containers.form.find('button[type="submit"]');
                containers.submit.on('click', controls.submit);
                containers.submit.attr('disabled', false);

                containers.message = $('.app-ribbon .doc-feedback');

                field.initialize(containers.form);
                field.reset();

                feedback.initialize(containers.message);
                feedback.hide();
            };
        }),
        ListAllTransactions: enzinak.Singleton(function () {
            var uid = 'listAllTransactions',
                feedback, seance, account, 
                containers = {},
                controls = {},
                section = {},
                templates = {},
                i18n = {
                    "section": {},
                    "offline": "No internet connection.",
                    "sessionexpired": "Session expired!",
                    "loading": "Please wait while we process your request.",
                    "error": {
                        "null": "Something went wrong",
                        "timeout": "Request timeout",
                        "error": "Error occurred",
                        "abort": "Request aborted",
                        "parsererror": "Parser error"
                    }
                };
            var _constructor = function () {
                feedback = new widgets.Feedback();
            }();

            section.transaction = utility.instancia(function () {
                var stockage;
                var _constructor = function () {
                    stockage = cache.Storage.getInstance();
                }();
                var tabulate = function (o) {
                    var rows = '';
                    for (var i = 0; i < o.length; i++) {
                        var tmp = {};
                        tmp.Id = o[i].Id;
                        tmp.YourName = o[i].YourName;
                        tmp.MaterialExchanged = o[i].MaterialExchanged;
                        tmp.ActionPerformed = o[i].ActionPerformed;
                        tmp.OtherPersonName = o[i].OtherPersonName;
                        tmp.Timestamp = utility.date.sentence(o[i].Timestamp);
                        rows += enzinak.Templator.fixIn(templates.tbody, tmp);
                    }
                    return rows;
                };
                var populate = function () {
                    templates.tbody = (templates.tbody == undefined) ? containers.tbody.html() : templates.tbody;
                    containers.tbody.html(tabulate(stockage.retrieve()));
                    containers.table.show();
                    containers.detail = containers.tbody.find('td.doc-detail');
                    containers.detail.on('click', controls.detail);
                };
                var onSuccess = function (e) {
                    console.log('Modules.ListAllTransactions section.transaction.onSuccess', e);
                    if (e.status == 'success') {
                        feedback.hide();
                        stockage.store(e.response);
                        populate();
                    } else {
                        feedback.danger(i18n.section.transaction + e.response);
                    }
                };
                var onFailure = function (jqXHR, textStatus, errorThrown) {
                    console.log('Modules.ListAllTransactions section.transaction.onFailure', jqXHR, textStatus, errorThrown);
                    feedback.danger(i18n.error[textStatus]);
                };
                var fetch = function () {
                    if (navigator.onLine) {
                        Communicator.getInstance().request({
                            service: config.webServiceUrl,
                            command: 'listAllTransactions',
                            payload: {},
                            authkey: '',
                            success: onSuccess,
                            failure: onFailure
                        });
                        feedback.info(i18n.loading);
                    } else {
                        feedback.warning(i18n.offline);
                        content.resumeUi();
                    }
                };
                this.init = function () {
                    fetch();
                };
            });

            controls.anchor = utility.changeView;
            controls.detail = function (e) {
                console.log('modules.ListAllTransactions.controls.detail');
                var rid = $(e.currentTarget).data('id');
                modules.ViewReview.getInstance().setReviewId(rid);
                Views.getInstance().activate('viewReview');
            };
            controls.refresh = function (e) {
                containers.table.hide();
                containers.tbody.html(templates.tbody);
                content.clean();
                content.init();
            };

            this.destroy = function () {
                console.log('modules.ListAllTransactions.destroy');
                containers.tbody.html(templates.tbody);
                containers.anchor.off('click', controls.anchor);
                containers.refresh.off('click', controls.refresh);
                if (containers.detail != undefined) {
                    containers.detail.off('click', controls.detail);
                }
            };
            this.initialize = function () {
                console.log('modules.ListAllTransactions.initialize');
                containers.self = $('#' + uid);

                modules.Drawer.getInstance().activate('listAllTransactions');

                containers.anchor = containers.self.find('a[href="#"]');
                containers.anchor.on('click', controls.anchor);

                containers.table = containers.self.find('table.doc-table');
                containers.tbody = containers.table.find('tbody');

                containers.refresh = containers.self.find('button.doc-refresh');
                containers.refresh.on('click', controls.refresh);

                containers.message = containers.self.find('div.doc-feedback');

                containers.progressbar = containers.self.find('div.doc-progress');
                containers.progressbar.hide();

                feedback.initialize(containers.message);
                feedback.hide();

                containers.table.hide();

                section.transaction.init();
            };
        })
    };

    var Controllers = enzinak.Singleton(enzinak.Controller);
    var Views = enzinak.Singleton(enzinak.ViewStack);
    var Communicator = enzinak.Singleton(enzinak.Communicator);
    Communicator.getInstance().isCrossDomain(false);

    var ViewToProceed = {
        onUnload: function (e) {
            console.log('ViewToProceed.onUnload', e.detail);
            if (e.detail != undefined) {
                Controllers.getInstance().module(e.detail).destroy();
            }
        },
        onLoad: function (e) {
            console.log('ViewToProceed.onLoad', e.detail);
            if (e.detail != undefined) {
                Controllers.getInstance().module(e.detail).initialize();
            }
        }
    };

    console.log('main -> initialized');

    var oControllers = Controllers.getInstance();
    oControllers.initialize();
    oControllers.register('addNewTransaction', modules.AddNewTransaction.getInstance());
    oControllers.register('listAllTransactions', modules.ListAllTransactions.getInstance());

    var oViews = Views.getInstance();
    oViews.setContainer('sections');
    oViews.setProceedOnUnload(ViewToProceed.onUnload);
    oViews.setProceedOnLoad(ViewToProceed.onLoad);
    oViews.initialize();

    var oDrawer = modules.Drawer.getInstance();
    oDrawer.binding(function (link) {
        oViews.activate(link.substr(1));
    });
    oDrawer.initialize();

    if (window.APP_MODE == app.mode.MOB) {
        app.initialize();
    } else {
        oViews.activate('addNewTransaction');
    }
};

$(nistush);