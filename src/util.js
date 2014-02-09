/**
 * @ignore
 * @file util
 * @author 莫争 <gaoli.gl@taobao.com>
 */

var emptyArray = [],
    some       = emptyArray.some,
    every      = emptyArray.every,
    slice      = emptyArray.slice,
    filter     = emptyArray.filter,
    concat     = emptyArray.concat,
    indexOf    = emptyArray.indexOf,
    forEach    = emptyArray.forEach;

function mix(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
}

function map(els, cb) {
    var val,
        ret = [];

    els && forEach.call(els, function(el, index) {
        val = cb(el, index);
        if (val !== null) {
            ret.push(val);
        }
    });

    return ret.length ? concat.apply([], ret) : ret;
}

function each(els, callback) {
    els && forEach.call(els, callback);
    return els;
}

function isWindow(node) {
    return node && node == node.window;
}

function isDocument(node) {
    return node && node.nodeType === 9;
}

function isElement(node) {
    return node && node.nodeType === 1;
}

function likeArray(nodes) {
    return typeof nodes.length == 'number';
}

function isType(type) {
    return function(obj) {
        return {}.toString.call(obj) == '[object ' + type + ']';
    }
}

var isNumber   = isType('Number'),
    isString   = isType('String'),
    isObject   = isType('Object'),
    isArray    = Array.isArray || isType('Array'),
    isFunction = isType('Function');

var isPlainObject = function(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
};