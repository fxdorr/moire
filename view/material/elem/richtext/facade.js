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
 * 云纹物料-元素-富文本编辑器
 */
fxView['material']['elem']['richtext'] = function() {
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
            'data': '',
            // 默认
            'default': ['input', dark['title']],
            // 插件
            'plugin': {
                // 语言
                'lang': fxApp['view']['lang']
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
    };
    // 部署
    echo['deploy'] = function() {
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<textarea></textarea>');
        dark['elem'].attr({
            'type': 'text',
            'id': dark['id'],
            'name': dark['field'],
            'placeholder': dark['default'],
            'autocomplete': 'off'
        });
        dark['elem'].val(dark['data']);
        // 疏理皮肤
        switch (dark['skin']) {
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
                    'class': 'layui-textarea',
                    'lay-verify': dark['requireText']
                });
                // 识别IE浏览器兼容插件
                if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
                    // 设置语言
                    var echo = {};
                    switch (dark['plugin']['lang']) {
                        default:
                            // 默认
                        case 'zh-cn':
                            // 中文(简体)
                            echo['lang'] = 'zh_CN';
                            break;
                        case 'en-us':
                            // 英语(美式)
                            echo['lang'] = 'en_US';
                            break;
                    }
                    // 绘制富文本编辑器
                    tinymce.init({
                        // 元素
                        'selector': '#' + dark['id'],
                        // 语言
                        'language': echo['lang'],
                        // 移动端配置
                        'mobile': {
                            'toolbar_drawer': false
                        },
                        // 插件
                        'plugins': 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em lineheight axupimgs',
                        // 工具
                        'toolbar': [
                            'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | ' +
                            'styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | ' +
                            'table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight axupimgs'
                        ],
                        // 高度
                        'height': 600,
                        // 调整大小
                        'resize': false,
                        // 字号列表
                        'fontsize_formats': '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                        // 字体列表
                        'font_formats': '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;',
                        // 上传图片
                        'images_upload_handler': function(blobInfo, succFun, failFun) {
                            // 疏理数据
                            var data = new FormData();
                            var file = blobInfo.blob();
                            data.append('base[token]', fxApp['user']['base']['token']);
                            data.append('file', file, file.name);
                            // 处理数据
                            $.ajax({
                                'type': 'POST',
                                'url': '/v0/file/fileUpload',
                                'data': data,
                                'processData': false,
                                'contentType': false,
                                'success': success,
                                'error': error
                            });
                            // 成功回调
                            function success(data) {
                                if (data['code'] == 200) {
                                    // 请求成功
                                    succFun(data['data'][0]);
                                } else {
                                    // 请求失败
                                    failFun(data['message']);
                                }
                            }
                            // 失败回调
                            function error(data) {
                                // 请求失败
                                failFun(data['responseText']);
                            }
                        },
                        // 提示未保存变更内容
                        'autosave_ask_before_unload': false,
                        // 初始化回调
                        'init_instance_callback': function(editor) {
                            // 执行瀑布流
                            $('div[moire-elem=elem]').trigger('resize');
                        }
                    });
                }
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
        // 识别IE浏览器兼容插件
        if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
            dark['echo'] = tinymce.get(dark['id']).getContent();
        } else {
            dark['echo'] = dark['elem'].val();
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        // 识别IE浏览器兼容插件
        if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
            tinymce.get(dark['id']).setContent(dark['data']);
        } else {
            dark['elem'].val(dark['data']);
        }
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        // 识别IE浏览器兼容插件
        if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
            tinymce.get(dark['id']).setContent('');
        } else {
            dark['elem'].val(dark['data']);
        }
    };
    return echo;
};