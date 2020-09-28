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
 * 云纹模具-视图-编辑
 */
fxView['mould']['view']['edit'] = function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({
            // 皮肤
            'skin': 'view'
        }, fxView['shelf']['view'])
    };
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (isNull(dark['base']['api']['elem'])) {
        parent.layui.layer.closeAll();
        return fxView['mould']['tool']['message']({ 'text': ['elem', 'not configured'] });
    }
    // 识别类型
    tray['view'] = dark;
    if (dark['base']['elem'] == 'edit') {
        tray['view']['url'] = dark['base']['api']['edit'];
    } else {
        tray['view']['url'] = dark['base']['api']['add'];
    }
    // 疏理基础
    tray['view'] = fxBase['param']['merge'](tray['view'], {
        // 数据
        'data': null,
        // 标题
        'title': null,
        // 窗口
        'window': {
            // 标题
            'title': false
        },
        // 成功
        'success': function() {
            if (self != top && $(parent.document).find('.moire-table').length > 0) {
                parent.layui.table.reload('moire-table');
                parent.layui.layer.closeAll();
            }
        },
        // 工具栏
        'toolbar': {
            0: fxBase['base']['template']({
                'elem': 'tool',
                'type': 'view-edit',
                'cell': 'submit,reset,clear'
            }).html(),
            1: fxBase['base']['template']({
                'elem': 'tool',
                'type': 'view-edit',
                'cell': 'close'
            }).html()
        }
    }, tray['view']);
    // 判断顶页面
    if (tray['view']['window']['title'] && self != top) {
        // 替换标题
        $(top.document).find('title').html(fxApp['view']['title'] + ' - ' + top.fxApp['env']['title']);
    }
    // 检查配置
    if (!isFunction(tray['view']['data'])) {
        parent.layui.layer.closeAll();
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 识别类型
    tray['echo'] = {};
    if (dark['base']['elem'] == 'edit') {
        // 请求数据
        tray['echo'] = {
            'url': dark['base']['api']['elem'],
            'async': false,
            'data': {
                'data': {}
            },
            'extend': {
                'tips': false
            }
        };
        tray['echo']['data']['data'][dark['base']['model']['key']] = fxApp['data'][dark['base']['model']['key']];
        tray['echo'] = fxView['store']['deal'](tray['echo']);
        if (tray['echo']['code'] != 200) {
            parent.layui.layer.closeAll();
            return fxView['mould']['tool']['message']({ 'text': tray['echo']['message'] });
        } else if (tray['echo']['data'].length == 0) {
            parent.layui.layer.closeAll();
            return fxView['mould']['tool']['message']({ 'text': ['data', 'not', 'exists'] });
        }
    } else {
        tray['echo']['data'] = {};
    }
    // 疏理视图
    $('.moire-wapper').append(fxBase['base']['template']({ 'elem': 'view', 'type': 'edit' }).html());
    // 疏理按钮
    $.each(tray['view']['toolbar'], function(key, value) {
        $('.moire-view .moire-button').eq(key).append(value);
    });
    // 成功回调
    tray['elem'] = $('.moire-view .moire-table');
    // 疏理标题
    if (!isNull(tray['view']['title'])) {
        tray['elem'].find('.moire-tbody').before('<div class="moire-thead"><div moire-elem="title">' + tray['view']['title'] + '</div></div>');
    }

    // 疏理数据
    tray['list'] = fxView['deploy']['cache'][dark['base']['elem']] = {};
    tray['echo']['data']['_worldline'] = fxBase['text']['mtime']();
    $.each(tray['view']['data'](tray['echo']['data']), function(key, value) {
        // 解析数据
        value['id'] = fxBase['text']['explode'](',', value['id']);
        value['type'] = fxBase['text']['explode'](',', value['type']);
        $.each(value['type'], function(key2, value2) {
            // 配置数据
            tray['data'] = fxBase['param']['merge'](1, {
                'field': key,
                'skin': dark['base']['skin']
            }, value);
            tray['data']['mould'] = dark;
            tray['data']['pack'] = tray['elem'].find('.moire-tbody');
            tray['data']['id'] = !isBlank(value['id'][key2]) ? value['id'][key2] : key + '-' + key2;
            tray['data']['type'] = value2;
            tray['list'][tray['data']['id']] = fxView['material']['elem'][value2]();
            tray['list'][tray['data']['id']]['init'](tray['data']);
        })
    });
    // 渲染数据
    tray['layedit'] = {};
    tray['sortable'] = {};
    $.each(tray['list'], function(key, value) {
        // 执行部署
        value['deploy']();
    });
    // 渲染表单
    layui.form.render();
    // 提交请求
    layui.form.on('submit(moire-submit)', function(data) {
        // 初始化变量
        var elem = $(this);
        try {
            elem.attr('disabled', true);
            // 渲染数据
            tray['data'] = {};
            $.each(tray['list'], function(key, value) {
                // 执行输出
                value['echo']();
                if (isNull(value['dark']['echo'])) return true;
                // 疏理输出
                $.each(fxBase['text']['explode']('-', value['dark']['field']).reverse(), function(key2, value2) {
                    var data = {};
                    data[value2] = value['dark']['echo'];
                    value['dark']['echo'] = data;
                });
                tray['data'] = fxBase['param']['merge'](tray['data'], value['dark']['echo']);
            });
            // 渲染数据
            $.each(tray['data'], function(key, value) {
                // 初始化变量
                if (!isArray(value) && !isObject(value)) return true;
                tray['data'][key] = JSON.stringify(value);
            });
            // 处理数据
            tray['echo'] = fxView['store']['deal']({
                'url': tray['view']['url'],
                'async': false,
                'data': {
                    'data': tray['data']
                },
                'extend': {
                    'tips': false
                }
            });
            // 处理回调
            if (tray['echo']['code'] == -1) {
                // 系统异常
                tray['echo']['message'] = fxBase['base']['lang'](['system', 'abend']);
            }
            if (tray['echo']['code'] == 200) {
                // 请求成功
                layui.layer.msg(tray['echo']['message'], {
                    'icon': 1,
                    'time': 800
                }, function() {
                    // 执行成功回调
                    tray['view']['success']();
                    elem.attr('disabled', false);
                });
            } else {
                // 处理错误
                if (isObject(tray['echo']['extend']['error'])) {
                    tray['echo']['message'] = [];
                    $.each(tray['echo']['extend']['error']['data'], function(key, value) {
                        key = !isNull(tray['list'][key + '-0']) ? fxBase['base']['lang'](tray['list'][key + '-0']['title']) : key;
                        if (tray['echo']['message'].length > 0) {
                            tray['echo']['message'].push('and2');
                        }
                        // 疏理信息
                        switch (tray['echo']['extend']['error']['name']) {
                            default:
                                // 默认
                                tray['echo']['message'].push(['[', key, ']']);
                                break;
                            case 'exist':
                                // 已存在
                                tray['echo']['message'].push(['[', key, ':', value, ']']);
                                break;
                        }
                    });
                    // 疏理信息
                    switch (tray['echo']['extend']['error']['name']) {
                        default:
                            // 默认
                            tray['echo']['message'] = fxBase['base']['lang']([tray['echo']['message']]);
                            break;
                        case 'exist':
                            // 已存在
                            tray['echo']['message'] = fxBase['base']['lang']([tray['echo']['message'], 'existed']);
                            break;
                        case 'lack':
                            // 缺少
                            tray['echo']['message'] = fxBase['base']['lang'](['cannot be empty', tray['echo']['message']]);
                            break;
                    }
                }
                layui.layer.msg(tray['echo']['message'], {
                    'icon': 2,
                    'time': 2000
                }, function() {
                    elem.attr('disabled', false);
                });
            }
        } catch (err) {
            // 捕获异常
            layui.layer.msg(fxBase['base']['lang'](['system', 'abend']), {
                'icon': 2,
                'time': 2000
            }, function() {
                elem.attr('disabled', false);
            });
        }
        // 没有父页面则直接取消禁用
        if (self == top) {
            elem.attr('disabled', false);
        }
        return false;
    });
    // 重置条件
    $('.moire-view.layui-form .moire-reset').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行重置
            value['reset']();
        });
        // 渲染表单
        layui.form.render();
    });
    // 清理条件
    $('.moire-view.layui-form .moire-clean').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行清理
            value['clean']();
        });
        // 渲染表单
        layui.form.render();
    });
    // 关闭弹窗
    $('.moire-button .moire-close').on('click', function() {
        parent.layui.layer.closeAll();
    });
    // 执行图片加载器
    tray['elem'].find('div[moire-cell]').viewer({
        'title': false,
        'zIndex': fxBase['base']['maxZIndex']()
    });
    // 执行瀑布流
    $('div[moire-elem=elem]').on('resize', function() {
        // 文件容器
        $('div[moire-cell=file]>.moire-div .moire-elem-inline').masonry({
            'itemSelector': 'div[moire-cell=file]>.moire-div .moire-elem-inline>div'
        });
        // 主容器
        $('.moire-tbody').masonry({
            'itemSelector': 'div[moire-elem=elem]'
        });
    });
    $('div[moire-elem=elem]').trigger('resize');
};