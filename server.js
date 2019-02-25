//lib
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');

const fs = require('fs');
const router=require('koa-router')();
const koaBody = require('koa-body');



const config={
	port:7008,
	path:path.join(__dirname,'./dist')
};

const app = new Koa();

//redirect index
router.get('/',async (ctx,next)=> {
	ctx.response.type = 'html';
	ctx.response.body = await fs.readFileSync(path.join(config.path,'./pages/dlPoc/dyncForm/index.html') , 'utf8');
});


//parser
app.use(koaBody({
	multipart: true
}));

//static server
const main = serve(config.path);
app.use(main);
app.use(router.routes());


//异常处理
//app.use(error404);
//捕获异常记录错误日志
app.on("error",(err,ctx)=>{console.log(new Date(),":",err);});


app.listen(config.port);

//success
console.log(`启动 http://localhost:${config.port} ${config.path} 成功！`);
