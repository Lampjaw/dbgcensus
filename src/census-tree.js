var clone = require('clone');

var defaultSettings = {
    list: false,
    prefix: null,
    start: null,
    tree: []
};

var CensusTree = function(field) {
    this.settings = clone(defaultSettings);
    this.settings.start = field;
    this.tree = [];

    this.isList = function(isList) {
        this.settings.list = isList;
    };

    this.groupPrefix = function(prefix) {
        this.settings.prefix = prefix;
    };

    this.startField = function(field) {
        this.settings.start = field;
    };

    this.treeField = function(field) {
        var tree = new CensusTree(field);
        this.settings.tree.push(tree);
        return tree;
    };
};

var prototype = CensusTree.prototype;

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

    if (this.tree.length > 0) {
        argStr += '(';
        for(var j = 0; j < this.tree.length; j++) {
            argStr += this.tree[j].toString();
        }
        argStr += ')';
    }

    return argStr;
}

prototype.type = function() {
    return 'CensusTree';
};

module.exports = CensusTree;
