/**
 * @ignore
 * @file output
 * @author 莫争 <gaoli.gl@taobao.com>
 */

mix(S, {
    node    : node,
    Node    : $,
    NodeList: $,
    one     : $.one,
    all     : $.all
});

S.add && S.add('node', function (S) {
    return $;
});