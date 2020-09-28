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
 * 云纹物料-元素-开关
 */
fxView['material']['elem']['switch'] = function() {
    // 初始化变量
    var dark,
        echo = {};
    // 数据
    echo['dark'] = dark = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['elem'](dark, arguments[0]);
        dark = fxBase['param']['merge'](dark, {
            // 数据
            'data': ''
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = [];
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
        dark['shelf']['data'] = fxBase['text']['implode']('|', dark['shelf']['data'].reverse());
    };
    // 部署
    echo['deploy'] = function() {
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<input>');
        dark['elem'].attr({
            'type': 'checkbox',
            'id': dark['id'],
            'name': dark['field'],
            'lay-skin': 'switch',
            'lay-text': dark['shelf']['data']
        });
        dark['elem'].prop('checked', !!parseInt(dark['data']));
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    var tray = {};
                    tray['echo'] = '';
                    if (!isBlank(dark['shelf']['data'][data[dark['field']]])) {
                        tray['echo'] = $('<input>');
                        tray['echo'].attr({
                            'type': 'checkbox',
                            'name': dark['field'],
                            'value': data[dark['mould']['base']['model']['key']],
                            'lay-skin': 'switch',
                            'lay-text': dark['shelf']['data'],
                            'lay-filter': dark['field'],
                            'checked': data[dark['field']] == 1 ? 'checked' : null
                        });
                        tray['echo'].text(dark['shelf']['data'][data[dark['field']]]);
                        tray['echo'] = tray['echo'].prop('outerHTML');
                    }
                    return tray['echo'];
                };
                break;
            case 'view':
                // 视图
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'layui-input',
                    'lay-verify': dark['requireText']
                });
                break;
        }
        // 疏理视图
        if (isFunction(dark['view'])) {
            dark['view'](dark);
        }
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
        dark['echo'] = dark['elem'].prop('checked') ? 1 : 0;
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', !!parseInt(dark['data']));
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', false);
    };
    return echo;
};