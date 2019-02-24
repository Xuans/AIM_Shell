# AWEB 性能优化

可用于 AWEB IDE 4.3 或以上版本。

## 安装
- 安装 nodejs

- 将该模块复制到跟WebContent同级下，使用终端打开模块文件夹，使用 `npm i` 初始化项目。


## 使用

1. 修改 bootloaderTemplate.js （如果不需要合并项目样式这个步骤可以省略，具体见下面）；

2. 编译部署项目；

3. 执行 `gulp` 或 `run.cmd`，完毕后，将在 `WebContent` 的同级文件生成 `WebContent2`；打包完毕后，会将 WebContent 中的文件 复制、合并、压缩到 WebCotent2；

4. 因为压缩需要一点的时候，平时如果只需要合并代码的话，打开gulpfile.js ，将第一行的 `isUglify` 改为 `false` 即可。



## 原理

1. 读取项目下的bootloader.js ，将项目引用样式队列 cssLoaderList 压缩为 style.css 文件；
2. 读取项目下的bootloader.js，将项目引用脚本队列jsLoaderList中的组件压缩为一个 component.js 文件，并修改其引用路径；
3. 读取项目下的aweb 框架脚本（dependence/AWEB/js/aweb.*.js），压缩为一个script.js，并修改bootloader.js对应模块的路径。
4. 将项目下所有的JS都进行压缩。

## TODO
1. 压缩HTML、CSS - 因为目前css和html基本都是编译或者预编译生成的压缩优化意义不大；



## 注意

这里使用 ES6 或 TypeScript 语法转换工具不怎么完善，如果报错了，请手动更改对应报错的代码，或者跟我联系；


## 修改 bootloaderTemplate

1.修改位于正在使用中的bootloaderTemplate.js;
- AWEB IDE 4.3版本位于项目`WebContent`下；
- AWEB IDE 5 版本位于 、`AUI2/config` 下；
- AWEB IDE 6 位于 项目`src/main`下；

2.由于样式合并成一个style.css，因此我们需要将被合并的样式文件名，映射改为同一个，在
```javascript
"IDETAG";
    //do something to edit the vars above
"IDETAG";
```
下面加入
```javascript
var cssLoadMap=(function(cssLoadList){
    var map={};

    for(var item,i=cssLoadList.length;item=cssLoadList[--i];){
        map[item]='style.css';
    }

    return map;
}(cssLoadList));
```

将 `transformCssConfig` 改为：
```javascript
transformCssConfig: function (cssLoadList) {
	//css config
	for (_i = cssLoadList.length; _item = cssLoadList[--_i];) {
		if(_item in cssLoadMap){
            cssLoadList[_i] = 'requireCss!' + cssLoadMap[_item];
        }else{
            if (!/^(?:\.)?dependence/.test(_item)) {
			    _item = 'dependence/' + _item;
		    }
            cssLoadList[_i] = 'requireCss!' + _item;
        }
		
	}
	return cssLoadList;
},
```

3. 关闭国际化

将
```javascript
if(aweb.translate){
	queue.push(function(){
		$._ajax({
			url:'NSL/nls_' + widget.getCurrentLanguage() + '.json',
			success:function (data) {
				widget.viewer.nsl = data || {};
			},
			error:function(){
				$AW.viewer.nsl  = {};
			},
			complete:next
		});
	});
}
```
替换为：

```javascript
$AW.viewer.nsl  = {};
next();
```

4. 关闭预加载(将以下代码注释掉)
```javascript
//require(aweb.transformJsConfig(jsLoadList));
//require(aweb.transformCssConfig(cssLoadList));
```

5. 重新编译部署项目即可


## 更新日志

- V6.0.1
    - 修复自定义组件没有被压缩的问题；
    - 添加整个项目的JS压缩功能（不压缩min.js、500kb以上文件）；



---


## 针对东莞微网点的改造
### 1. 不重复加载页面的JS、HTML
#### 修改文件

- AUI2
    - 运行时
        - AUI2/config/bootloaderTemplate.js   修改实例化部分；

        - AUI2/script/spa/compileJS.js    将页面JS的包裹多一层function，实现多例；

    - 配置开发时
        - AUI2/script/spa/index.js      修改预览时实例化部分；
        - AUI2/virtualizer.html         修改预览窗口时实例化部分；

- 项目
    - 在依赖配置中添加 mobile.SoYLayout.mobileLayout.css 防止打包编译提示空文件问题；
    - 修改 首页布局--> 配置定义-->应用接口-->AWEB 核心框架 --> AWEB 核心 SPA 框架  ：
        - 取消了所有的时间戳；
        - 在 stepTo 方法中，加入实例化页面功能；
    - 修改首页布局-->样式->修改了 soy.less 1314行，将 margin 改为 0 0.25em 1em; (给alert提示文字加边距，纯属样式美化)

---

### 2. 压缩、合并 AWEB运行平台、组件代码

#### 配置 Nodejs
1. 将 plugin.zip 解压，假设放置在

```
    D:\AWEB-20180323-V5.0\VSCode2\plugins\nodejs
```

2. 设置环境变量，在系统环境变量的path的最后加入：(开头有一个分号)

```
    ;D:\AWEB-20180323-V5.0\VSCode2\plugins\nodejs
```

3. 添加 NODE_PATH 的系统环境变量，在 系统环境变量中添加 NODE_PATH

```
    D:\AWEB-20180323-V5.0\VSCode2\plugins\nodejs
```

4. 打开CMD，输入 `node --version` 查看是否安装成功；


5. 安装VSCode

6. 将aweb-cli 解压到项目下，（与 WebContent 同目录），如：

```
    D:\MBS2Space\mbs2_app\aweb-cli
```