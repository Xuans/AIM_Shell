# CAMA - Vue 项目

## 使用

### 安装依赖包
```
npm install
```

### 开发 - 纯前端热更新开发

在 `src/pages` 文件夹下，新建 `dlPoc` 子项目。
```
  |- src
     |- pages
         |- 子项目名称 //例如”dlPoc“
               |- 子模块 //例如”dyncForm“
                    |- 子模块入口文件，例如 ”main.js“
                    |- 子模块业务组件，例如 ”index.vue“,
                    |- 子模块视图文件，例如 ”index.html“
```

具体编写方法可以参考`example`模块（实际上直接复制模块代码即可，根据具体业务修改 `index.vue` 文件即可，一般不需要改 `main.js` 和 `index.html`）。

在开发过程中，使用 webpack 动态打包调试：
```
npm run serve
```

假设开发的是`dlPoc`子项目下的`example`页面，访问路径为 `/dlPoc/example.html`，如：`http://localhost:8081/dlPoc/example.html`，具体端口根据实际情况确定。

### 编译部署代码并复制到AWEB项目
```
npm run build && gulp
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### 自定义打包配置
参数 [Configuration Reference](https://cli.vuejs.org/config/)。

在项目中根据项目文件夹打包。

例如，新建大连POC（dlPoc）的子项目，在 `vue.config.js` 的 `pattern` 属性中配置：
```javascript
  pattern: [
    //大连 POC
    "src/pages/dlPoc/*"
  ]
```

执行 `npm run build && gulp` 后会自动打包到 AWEB 项目中。

其中 `dist` 的目录结构为：

```
    |- dist 打包目录结构
        |- chunk-vendors //第三方依赖库
        |   |- js        //第三方依赖库 JS 文件
        |   |- css      //第三方依赖库 CSS 文件
        |- fonts        //字体库
        |- pages        //所有页面
            |- 子项目模块   //例如poc
                |- 页面模块 //例如example
                    |- index.html   //视图文件 
                    |- script.js    //脚本
                    |- style.css    //样式
```