/** 
 * @author Abhishek Kumar
 * @license This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

var enzinak = {};

enzinak.Singleton = function (Class) {
    var instance;
    return {
        getInstance: function () {
            if (!instance) {
                instance = new Class();
            }
            return instance;
        }
    };
};

enzinak.Drshya = function () {
    var hasClass = function (el, className) {
        if (el.classList)
            el.classList.contains(className);
        else
            new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    };
    var addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };
    var removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };
    this.hide = function (ref) {
        if (ref.length == undefined) {
            addClass(ref, 'hide');
        } else {
            for (var i = 0; i < ref.length; i++)
                addClass(ref[i], 'hide');
        }
    };
    this.show = function (ref) {
        if (ref.length == undefined) {
            removeClass(ref, 'hide');
        } else {
            for (var i = 0; i < ref.length; i++)
                removeClass(ref[i], 'hide');
        }
    };
};

enzinak.VrttAnta = function () {
    this.getEvent = function (evento, payload) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(evento, true, true, payload);
        return event;
    };
};

enzinak.ViewStack = function () {
    var container,
        proceedOnUnload,
        proceedOnLoad,
        activeId,
        oDrshya,
        oVrttAnta;

    var _constructor = function () {
        oDrshya = new enzinak.Drshya();
        oVrttAnta = new enzinak.VrttAnta();
    }();
    var deactivateAll = function () {
        for (var i = 0, len = container.childElementCount; i < len; i++) {
            oDrshya.hide(container.children[i]);
        }
    };
    var onUnload = function (e) {
        if (proceedOnUnload != undefined) {
            proceedOnUnload(e);
        }
    };
    var onLoad = function (e) {
        if (proceedOnLoad != undefined) {
            proceedOnLoad(e);
        }
    };

    this.setContainer = function (id) {
        container = document.getElementById(id);
    };
    this.setProceedOnUnload = function (method) {
        proceedOnUnload = method;
    };
    this.setProceedOnLoad = function (method) {
        proceedOnLoad = method;
    };
    this.initialize = function () {
        container.addEventListener('sectionunload', onUnload);
        container.addEventListener('sectionload', onLoad);
    };
    this.destroy = function () {
        container.removeEventListener('sectionunload', onUnload);
        container.removeEventListener('sectionload', onLoad);
    };
    this.activate = function (id) {
        container.dispatchEvent(oVrttAnta.getEvent('sectionunload', activeId));
        deactivateAll();
        activeId = id;
        oDrshya.show(container.children[activeId]);
        container.dispatchEvent(oVrttAnta.getEvent('sectionload', activeId));
    };
};

enzinak.ObjectList = function () {
    var list;
    this.fetchItemByKey = function (key, val) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i][key] == val) {
                return list[i];
            }
        }
        return null;
    };
    this.removeItemByKey = function (key, val) {
        var item = fetchItemByKey('id', id);
        if (item != null) {
            return delete item;
        }
        return false;
    };
    this.removeItem = function (index) {
        return list.splice(index, 1);
    };
    this.getItem = function (index) {
        return list[index];
    };
    this.setItem = function (item) {
        list.push(item);
    };
    this.initialize = function () {
        list = [];
    };
};

enzinak.Controller = function () {
    var objectList;

    var _constructor = function () {
        objectList = new enzinak.ObjectList();
    }();

    this.register = function (id, instance) {
        objectList.setItem({
            id: id,
            instance: instance
        });
    };
    this.unregister = function (id) {
        return objectList.removeItemByKey('id', id);
    };
    this.module = function (id) {
        var item = objectList.fetchItemByKey('id', id);
        if (item != null) {
            return item.instance;
        }
        return null;
    };
    this.initialize = function () {
        objectList.initialize();
    };
};

enzinak.Templator = {
    /**
     *  Usage:
     *      enzinak.Templator.fitIn('<a href="#[0]" title="[1]">[1]</a>', ['test1.html', 'Test1']);
     *  Result:
     *      <a href="#test1.html" title="Test1">Test1</a>
     **/
    fitIn: function (template, arglist) {
        var output = template;
        for (var i = 0; i < arglist.length; i++) {
            output = output.replace(new RegExp('\\[' + i + '\\]', 'g'), arglist[i]);
        }
        return output;
    },
    /**
     *  Usage:
     *      enzinak.Templator.fixIn('<a href="#[Link]" title="[Content]">[Content]</a>', { Link: 'test1.html', Content: 'Test1' });
     *  Result:
     *      <a href="#test1.html" title="Test1">Test1</a>
     **/
    fixIn: function (template, hashtable) {
        var tag, output = template;
        for (var key in hashtable) {
            tag = new RegExp("\\[" + key + "\\]", 'g')
            output = output.replace(tag, hashtable[key]);
        }
        return output;
    }
};

enzinak.Communicator = function () {
    var requests = [], crossDomain = false;
    var call = function () {
        var package = requests.shift();
        //console.log('Communicator -> call: ', package);
        $.ajax({
            url: package.service,
            type: 'POST',
            dataType: (crossDomain) ? 'jsonp' : 'json',
            crossDomain: true,
            data: {
                cmd: package.command,
                pl: JSON.stringify(package.payload),
                ak: package.authkey
            },
            success: function (response, textStatus, xOptions) {
                //console.log("Communicator -> Success: ", response);
                if (requests.length > 0) {
                    this.call();
                }
                package.success(response);
            },
            error: function onError(xOptions, textStatus, errorThrown) {
                //console.log("Communicator -> Failed: ", xOptions, textStatus, errorThrown);
                package.failure(xOptions, textStatus, errorThrown);
            }
        });
    };
    this.request = function (package) {
        requests.push(package);
        if (requests.length == 1) {
            call();
        }
    };
    this.isCrossDomain = function (bool) {
    	crossDomain = bool;
    };
};

enzinak.DatePattern = {
    culture: {
        en_US: '[M]/[D]/[Y]',
        fr_FR: '[D]/[M]/[Y]',
        ja_JP: '[Y]/[M]/[D]'
    },
    objectify: function (date) {
        var dateObj;
        if (typeof (date) != 'object') {
            var tarikh = date.split('-');
            dateObj = {
                Y: parseInt(tarikh[0]),
                M: parseInt(tarikh[1]),
                D: parseInt(tarikh[2])
            };
        } else {
            dateObj = date;
        }
        return dateObj;
    },
    format: function (pattern, date) {
        var dateObj = this.objectify(date);
        return enzinak.Templator.fixIn(pattern, dateObj);
    }
};

enzinak.HashMap = function (map) {
    var self = this,
        list;
    var _constructor = function (iMap) {
        //list = (map != undefined) ? ((typeof(map) == 'string') ? JSON.parse(map) : map) : {};
        list = (iMap != undefined) ? iMap : {};
    }(map);
    this.isEmpty = function () {
        return (Object.getOwnPropertyNames(list).length === 0);
    };
    this.heap = function () {
        return list;
    };
    this.add = function (key, value) {
        list[key] = value;
    };
    this.remove = function (key) {
        delete list[key];
    };
    this.fetch = function (key) {
        return list[key];
    };
    this.find = function (value) {
        for (var o in list) {
            if (list[o] == value) {
                return o;
            }
        }
        return null;
    };
    this.findAll = function (value) {
        var a = [];
        for (var o in list) {
            if (list[o] == value) {
                a.push(o);
            }
        }
        return (a.length > 0) ? a : null;
    };
};

enzinak.FormValidator = function () {
    var fields = [],
        fieldprefix = null,
        proceedOnError = null,
        oDrshya;
    var regexpPattern = {
        insensitive: {
            fullname: "^[a-z\\'\\.\\- ]+$",
            email: "^[_a-z0-9-\\+]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9]+)*(\\.[a-z]{2,})$",
            telephone: "^[\\+\\-\\#\\*\\(\\)\\.\\s]*([0-9][\\+\\-\\#\\*\\(\\)\\.\\s]*){7,15}$",
            alphanum: "^[\\w\\d]+$"
        }
    };
    var regexpModifier = {
        insensitive: 'i',
        global: 'g',
        multiline: 'm'
    };

    var _constructor = function () {
        oDrshya = new enzinak.Drshya();
    }();
    var NotNull = function (value) {
        if (null === value || 'undefined' === typeof value)
            return false;
        return true;
    };
    var NotBlank = function (value) {
        if ('string' !== typeof value) {
            if ('object' === typeof value) {
                return true;
            }
            return false;
        } else if ('' === value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
            return false;
        }
        return true;
    };
    var Required = function (value) {
        return NotBlank(value);
    };
    var Alphanum = function (value) {
        var pattern = new RegExp(regexpPattern.insensitive.alphanum, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var FullName = function (value) {
        var pattern = new RegExp(regexpPattern.insensitive.fullname, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var Email = function (value) {
        var pattern = new RegExp(regexpPattern.insensitive.email, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var Telephone = function (value) {
        var pattern = new RegExp(regexpPattern.insensitive.telephone, regexpModifier.insensitive);
        return pattern.test(value);
    };
    var MinLength = function (value, minlen) {
        return (value.length >= minlen);
    };
    var error = function (fieldname, bool, message) {
        if (proceedOnError != null) {
            proceedOnError(fieldname, bool, message);
        } else {
            var fieldwrapper = document.querySelectorAll('div#' + fieldprefix + fieldname + ' div.error');
            if (!bool) {
                oDrshya.show(fieldwrapper);
                fieldwrapper[0].innerHTML = message;
            } else {
                oDrshya.hide(fieldwrapper);
                fieldwrapper[0].innerHTML = '';
            }
        }
        return bool;
    };
    this.setErrorCallback = function (callback) {
        proceedOnError = callback;
    };
    this.setFields = function (list) {
        fields = list;
    };
    this.setFieldPrefix = function (prefix) {
        fieldprefix = prefix;
    };
    this.isValid = function (values) {
        var totalerrors = [];
        for (i in fields) {
            var status = null,
                isrequired = false;
            for (j in fields[i]) {
                switch (j) {
                case 'Required':
                    isrequired = true;
                    status = error(i, Required(values[i]), fields[i][j]);
                    break;
                case 'FullName':
                    if (isrequired || NotBlank(values[i])) {
                        status = error(i, FullName(values[i]), fields[i][j]);
                    }
                    break;
                case 'Alphanum':
                    if (isrequired || NotBlank(values[i])) {
                        status = error(i, Alphanum(values[i]), fields[i][j]);
                    }
                    break;
                case 'Email':
                    if (isrequired || NotBlank(values[i])) {
                        status = error(i, Email(values[i]), fields[i][j]);
                    }
                    break;
                case 'Telephone':
                    if (isrequired || NotBlank(values[i])) {
                        status = error(i, Telephone(values[i]), fields[i][j]);
                    }
                    break;
                case 'MinLength':
                    if (isrequired || NotBlank(values[i])) {
                        status = error(i, MinLength(values[i], fields[i][j][0]), fields[i][j][1]);
                    }
                    break;
                }
                if (status !== null && !status) {
                    totalerrors.push('x');
                    break;
                }
            }
        }
        return (totalerrors.join('').length > 0) ? false : true;
    };
};

enzinak.UrlChurner = {
    // #!x&y=3 -> { x:null, y:3 }
    getHashBang: function (url) {
        url = url || window.location.href;
        var pos = url.indexOf('#!'),
            vars = {};
        if (pos >= 0) {
            var hashes = url.slice(pos + 2).split('&');
            for (var i = hashes.length; i--;) {
                var hash = hashes[i].split('=');
                vars[hash[0]] = hash.length > 1 ? hash[1] : null;
            }
        }
        return vars;
    },
    // ?x=&y=3 -> { x:undefined, y:3 }
    getParams: function (url, decode) {
        var s = url || window.location.search,
            t = s.match(/([^&?]*?=[^&?]*)/g),
            o = {};
        if (t != null) {
            for (var i = 0; i < t.length; i++) {
                var k = t[i].substring(0, t[i].indexOf('='));
                var v = t[i].substr(t[i].indexOf('=') + 1);
                o[k] = ((decode) ? decodeURIComponent(v) : v);
            }
        }
        return o;
    }
};