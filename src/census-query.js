var clone = require('clone');
var request = require('request');

var CensusJoin = require('./census-join');
var CensusTree = require('./census-tree');
var CensusArgument = require('./census-argument');

var HOST = 'census.daybreakgames.com';

var NAMESPACES = [
    'eq2',
    'ps2:v1',
    'ps2:v2',
    'ps2',
    'ps2ps4us:v2',
    'ps2ps4us',
    'ps2ps4eu:v2',
    'ps2ps4eu',
    'dcuo:v1',
    'dcuo'
];

var globalNamespace = null;
var globalKey = 'example';

var defaultSettings = {
    timing: false,
    exactMatchFirst: false,
    includeNull: false,
    'case': true,
    retry: true,
    limit: null,
    limitPerDB: null,
    start: null,
    show: [],
    hide: [],
    sort: [],
    has: [],
    resolve: [],
    join: [],
    tree: [],
    distinct: null,
    lang: null
};

module.exports.SetGlobalNamespace = function(namespace) {
    globalNamespace = namespace;
};

module.exports.SetGlobalServiceKey = function(key) {
    globalKey = key;
};

var CensusQuery = function(service, namespace, key) {
    var ns = namespace || globalNamespace;
    validateNamespace(ns);

    this.service = service;
    this.namespace = ns;
    this.key = key || globalKey;
    this.terms = [];
    this.settings = clone(defaultSettings);
};

var prototype = CensusQuery.prototype;

prototype.joinService = function(service) {
    var join = new CensusJoin(service);
    this.settings.join.push(join);
    return join;
};

prototype.treeField = function(field) {
    var tree = new CensusTree(field);
    this.settings.tree.push(tree);
    return tree;
};

prototype.where = function(field) {
    var arg = new CensusArgument(field);
    this.terms.push(arg);
    return arg.operand;
};

prototype.showFields = function(fields) {
    this.settings.show = fields;
};

prototype.hideFields = function(fields) {
    this.settings.hide = fields;
};

prototype.setLimit = function(limit) {
    this.settings.limit = limit;
};

prototype.setStart = function(start) {
    this.settings.start = start;
};

prototype.addResolve = function(resolve) {
    this.settings.resolve.push(resolve);
};

prototype.resolve = function(resolves) {
	if (!resolves.length || resolves.length === 0) {
		throw new Error('[Census query resolve requires at least one item');
	}

	for (var i = 0; i < resolves.length; i++) {
		this.addResolve(resolves[i]);
	}
};

prototype.setLanguage = function(lang) {
    this.settings.lang = lang;
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
    for (var i = 0; i < this.terms.length; i++) {
        stringArgs.push(this.terms[i].toString());
    }

    var args = this.getSetArgs();
    var keys = Object.keys(args);

    for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        var prefix = 'c:' + key + '=';

        stringArgs.push(prefix + args[key].toString());
    }

    var argStr = '';
    for (var i = 0; i < stringArgs.length; i++) {
        argStr += (i > 0 ? '&' : '?') + stringArgs[i];
    }

    return this.service + '/' + argStr;
};

prototype.toUrl = function() {
    return createQueryString('get', this);
};

prototype.get = function(callback) {
    executeQuery('get', this, callback);
};

prototype.count = function(callback) {
    executeQuery('count', this, callback);
};

function validateNamespace(namespace) {
    if (!namespace || NAMESPACES.indexOf(namespace.toLowerCase()) === -1)
        throw new Error('Namespace must be one of the following: ' + NAMESPACES.join(', '));
}

function executeQuery(queryType, query, callback) {
  var url = createQueryString(queryType, query);
  httpQuery(query.service, url, callback);
}

function createQueryString(queryType, query) {
    var encArgs = encodeURI(query.toString());
    return 'http://' + HOST + '/s:' + query.key + '/' + queryType + '/' + query.namespace + '/' + encArgs;
}

function httpQuery(service, url, callback) {
  request.get(url, function(error, response, body) {
	      if (error) {
            return callback('[CensusConnectionError]' + error)
        }
        
        var json;
        try {
            json = JSON.parse(body);
        } catch(ex) {
            return callback('[dbgcensusError] Failed to parse census response');
        }

        var root = service + '_list';

        if (!json[root]) {
            callback('[CensusQueryError] ' + (json.error || json.errorMessage));
        } else {
            callback(null, json[root]);
        }
	});
};

module.exports.Query = CensusQuery;
