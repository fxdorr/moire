// +----------------------------------------------------------------------
// | Name 云纹框架
// +----------------------------------------------------------------------
// | Author 唐启云 <tqy@fxri.net>
// +----------------------------------------------------------------------
// | Copyright Copyright © 2017-2099 方弦研究所. All rights reserved.
// +----------------------------------------------------------------------
// | Link https://www.fxri.net
// +----------------------------------------------------------------------

/**
 * 云纹模具-视图-新增-皮肤
 */
fxView['machine']['deployer'](['mould', 'view', 'add', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({}, fxView['shelf']['view'])
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 执行视图
    fxView['machine']['caller'](['mould', 'view', 'edit', 'main'], [dark]);
});