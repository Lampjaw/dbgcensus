var clone = require('clone');

var CensusArgument = require('./census-argument');

var defaultSettings = {
    list: false,
    outer: true,
    show: [],
    hide: [],
    terms: [],
    on: null,
    to: null,
    inject_at: null
};

var CensusJoin = function(service) {
    this.service = service;
    this.settings = clone(defaultSettings);
    this.join = [];
};

var prototype = CensusJoin.prototype;

prototype.isList = function(isList) {
    this.settings.list = isList;
};

prototype.isOuterJoin = function(isOuter) {
    this.settings.outer = isOuter;
};

prototype.showFields = function(fields) {
    this.settings.show = fields;
};

prototype.hideFields = function(fields) {
    this.settings.hide = fields;
};

prototype.onField = function(field) {
    this.settings.on = field;
};

prototype.toField = function(field) {
    this.settings.to = field;
};

prototype.injectAt = function(name) {
    this.settings.inject_at = name;
};

prototype.where = function(field) {
    var arg = new CensusArgument(field);
    this.settings.terms.push(arg);
    return arg.operand;
};

prototype.joinService = function(service) {
    var join = new CensusJoin(service);
    this.join.push(join);
    return join;
};

prototype.getSetArgs = function() {
    var keys = Object.keys(defaultSettings);

    var setSettings = {};
    for (var k = 0; k < keys.length; k++) {
        var key = keys[k];

        var defaultSetting = defaultSettings[key];
        var customSetting = this.settings[key];

        if (defaultSetting instanceof Array && customSetting instanceof Array) {
            if (defaultSetting.length !== customSetting.length) {
                setSettings[key] = customSetting;
            }
        } else if (defaultSetting !== customSetting) {
            setSettings[key] = customSetting;
        }
    }

    return setSettings;
};

prototype.toString = function() {
    var stringArgs = [];
    var args = this.getSetArgs();
    var keys = Object.keys(args);

    for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        var prefix = '^' + key + ':';

        if (args[key] instanceof Array) {
            var argArr = args[key];
            var arrStr = '';
            for (var i = 0; i < argArr.length; i++) {
                if (i !== 0) {
                    arrStr += '\'';
                }
                arrStr += argArr[i];
            }
            stringArgs.push(prefix + arrStr);
        } else {
            stringArgs.push(prefix + args[key].toString());
        }
    }

    var argStr = '';
    for (var i = 0; i < stringArgs.length; i++) {
        argStr += stringArgs[i];
    }

    if (this.join.length > 0) {
        argStr += '(';
        for(var j = 0; j < this.join.length; j++) {
            argStr += this.join[j].toString();
        }
        argStr += ')';
    }

    return this.service + argStr;
}

prototype.type = function() {
    return 'CensusJoin';
};

module.exports = CensusJoin;
