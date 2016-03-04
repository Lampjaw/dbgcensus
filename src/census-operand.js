var CensusOperand = function() {
    this.value = null;
    this.operator = null;
};

var prototype = CensusOperand.prototype;

prototype.equals = function(value) {
    this.operator = 'Equals';
    this.value = value;
};

prototype.notEquals = function(value) {
    this.operator = 'NotEquals';
    this.value = value;
};

prototype.isLessThan = function(value) {
    this.operator = 'IsLessThan';
    this.value = value;
};

prototype.isLessThanOrEquals = function(value) {
    this.operator = 'IsLessThanOrEquals';
    this.value = value;
};

prototype.isGreaterThan = function(value) {
    this.operator = 'IsGreaterThan';
    this.value = value;
};

prototype.isGreaterThanOrEquals = function(value) {
    this.operator = 'IsGreaterThanOrEquals';
    this.value = value;
};

prototype.startsWith = function(value) {
    this.operator = 'StartsWith';
    this.value = value;
};

prototype.contains = function(value) {
    this.operator = 'Contains';
    this.value = value;
};

prototype.type = function() {
    return 'CensusOperand';
};

prototype.toString = function() {
    var str = '=';
    switch (this.operator) {
        case 'NotEquals':
            str += '!';
            break;
        case 'IsLessThan':
            str += '<';
            break;
        case 'IsLessThanOrEquals':
            str += '[';
            break;
        case 'IsGreaterThan':
            str += '>';
            break;
        case 'IsGreaterThanOrEquals':
            str += ']';
            break;
        case 'StartsWith':
            str += '^';
            break;
        case 'Contains':
            str += '*';
            break;
    }
    str += this.value;
    return str;
};

module.exports = CensusOperand;