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
    indexOf    = emptyArray.indexOf,
    forEach    = emptyArray.forEach;

function mix(target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
}

function each(elements, callback) {
    elements && forEach.call(elements, callback);
    return elements;
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