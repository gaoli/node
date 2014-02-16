/**
 * @ignore
 * @file output
 * @author 莫争 <gaoli.gl@taobao.com>
 */

// ** Node 模块提供的快捷方式 **
//
// ```
// mix(S, {
//     node    : node,  // 参元类
//     Node    : $,     // 构造器
//     NodeList: $,     // 构造器
//     one     : $.one, // 获取 / 创建一个 Node 对象
//     all     : $.all  // 获取 / 创建一批 Node 对象
// });
// ```
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