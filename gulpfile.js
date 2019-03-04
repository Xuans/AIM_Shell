//打包目录
const DEST = 'D:\\workspace_xian\\Cama4\\WebContent';
const SRC_FLODER = 'dist';
const SRC = `./${SRC_FLODER}`;

const PAGES_FLODER = 'pages';

const CHUNK_FLODER='chunk-vendors';

const JS_FILE_NAME='script.js';
const STYLE_FILE_NAME='style.css';

const CLASS_PREFIX='body';

const gulp = require('gulp');
const through2 = require('through2');

const fs = require('fs');
const path = require('path');

const Queue = require('./packager/queue');

const mvvm = `{
    "views": {
        "index": {
            "template": "index.html",
            "js": "index.js"
        }
    },
    "models": {},
    "flows": [{
        "id": "index"
    }],
    "stepBar": false
}`;
const html = `<div data-role="vueCtn"></div>`;

//common methods

// 递归创建目录 同步方法
const mkdir = (dirname) => {

    let list = [];
    let parent;

    list.push(dirname);
    while (
        (parent = path.dirname(list[list.length - 1])) !== list[list.length - 1] &&
        parent
    ) {
        list.push(parent);
    }

    list.reverse().forEach(p => {
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    });
}
//拷贝文件
const copyFile=function(src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}
const copyCssFile=function(src,dst){
    const file=fs.readFileSync(`${src}`).toString();

    mkdir(path.dirname(dst));

    fs.writeFileSync(dst,new Buffer(file.replace(/\.el-/g,`${CLASS_PREFIX} .el-`)));
}

const generateModule = function (queue) {
    const diliver = [SRC_FLODER, PAGES_FLODER].join(path.sep);

    let cssList=[];
    gulp
        .src([
            `${SRC}/${PAGES_FLODER}/**/*.html`], { allowEmpty: true })
        .pipe(through2.obj(function (chunk, enc, callback) {
            const content = chunk.contents.toString();
            const moduleName = chunk.dirname.split(diliver)[1];

            const moduleDir = path.join(DEST, 'module', moduleName);
            const upToRootDir = '../'.repeat(moduleDir.replace(/[\\\/]/g,path.sep).replace(DEST.replace(/[\\\/]/g,path.sep), '').split(path.sep).length - 1);

            //防止没有目录报错
            mkdir(moduleDir);

            //生成JSON
            fs.writeFile(path.join(moduleDir, 'mvvm.json'), mvvm, err => {
                if (err) {
                    console.error(err);
                }
            });

            //js
            const jsDeps = Array.from(new Set((content.match(/script src=[^\s>]+/g) || [])))//去重
                .map(script => {
                    script = script.match(/src=([^\s>]+)/)[1] || '';

                   
                    if(!script || script==='/'||script.indexOf('http')===0){
                        console.log(script);
                        return '';
                    }else if(script.indexOf(PAGES_FLODER) !== -1){
                        //拷贝页面js
                        copyFile(path.join(chunk.dirname,JS_FILE_NAME),path.join(moduleDir,JS_FILE_NAME));

                        return `"./${path.join('./', script.replace(path.join(PAGES_FLODER, moduleName), './'))}"`;
                    }else{
                        return `"${path.join(upToRootDir, script)}"`
                    }
                }).filter(script=>!!script);
            

            //css
            const cssDeps = Array.from(new Set((content.match(/<link href=[^\s$]+/g) || [])))//去重
                .filter(link => link.indexOf('.css') !== -1)//过滤掉非css文件
                .map(link => {
                    link = link.match(/href=([^\s$]+)/)[1] || '';

                    if(link.indexOf(PAGES_FLODER) !== -1){
                         //拷贝页面style
                         copyFile(path.join(chunk.dirname,STYLE_FILE_NAME),path.join(moduleDir,STYLE_FILE_NAME));

                        return `"requireCss!./${path.join('./', link.replace(path.join(PAGES_FLODER, moduleName), './'))}"` ;
                    }else{
                        //特殊处理公用样式，加类名前缀
                        cssList.push({
                            src:path.join(chunk.dirname,upToRootDir,link),
                            dst:path.join(moduleDir,upToRootDir,link)
                        });
        
                        

                        return `"requireCss!${path.join(upToRootDir, link)}"`;
                    }
                });
            const jsExports = '';
            const deps = jsDeps.concat(cssDeps);
            const js = `define([${deps.join(',\n\t\t')}],function(${jsExports}){
    return {
        load:function($el,scope,handler){
            var $vueCtn=$('[data-role=vueCtn]',$el);
            var id='vue-'+app.global.getUniqueId();

            $vueCtn.attr('id',id);

            app${moduleName.split(path.sep).join('.')}(id);
        },
        pause:function($el,scope,handler){},
        resume:function($el,scope,handler){},
        unload:function($el,scope,handler){},
    }
})`;
            fs.writeFile(path.join(moduleDir, 'index.js'), js, err => {
                if (err) {
                    console.error(err);
                }
            });

            //html
            chunk.contents = Buffer.from(html);


            this.push(chunk);
            callback();
        }))
        .pipe(gulp.dest(`${DEST}/module`))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            
            let map={};
            cssList.forEach(css=>map[css.src]=css.dst);

            for(let i in map){
                if(map.hasOwnProperty(i)){
                    console.log(map);
                    copyCssFile(i,map[i]);
                }
            }


            console.log(new Date().toString() + '\t:复制生成模块成功！');



            queue.next();
        });
};

const copy = function (queue) {
    gulp.src([
        `${SRC}/**/*`,
        `${SRC}/*`,
        `!${SRC}/pages`,
        `!${SRC}/pages/**/*`,
        `!${SRC}/${CHUNK_FLODER}/css/*`,
        // `!${SRC}/fakeData`,
        // `!${SRC}/fakeData/**/*`,
        `!${SRC}/fonts`,
        `!${SRC}/fonts/**/*`
    ], { allowEmpty: true })
        .pipe(gulp.dest(DEST))
        .on('error', function (error) {
            console.log(error);
        })
        .on('end', function () {
            console.log(new Date().toString() + '\t:复制文件完成！');
            queue.next();
        });

    gulp.src([
        `${SRC}/fonts/**/*`
    ] ,{ allowEmpty: true })
    .pipe(gulp.dest(path.join(DEST,CHUNK_FLODER,'fonts')))
    .on('error', function (error) {
        console.log(error);
    })
    .on('end', function () {
        console.log(new Date().toString() + '\t:复制字体文件完成！');
        queue.next();
    });s
};


//tasks
gulp.task('copy', async () => {
    (new Queue()).then(copy).start();
});


gulp.task('generateModule', async () => {
    (new Queue()).then(generateModule).start();
});

gulp.task('default', async function () {
    (new Queue())
        .then(copy)
        .then(generateModule)
        //.then(combineFiles)
        //.then(combineAWEBCore)
        .start();
});