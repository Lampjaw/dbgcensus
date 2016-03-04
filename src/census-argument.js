var CensusOperand = require('./census-operand');

var CensusArgument = function(field) {
    this.field = field;
    this.operand = new CensusOperand();
};

var prototype = CensusArgument.prototype;

prototype.type = function() {
    return 'CensusArgument';
};

prototype.toString = function() {
    return this.field + this.operand.toString();
};

module.exports = CensusArgument;
