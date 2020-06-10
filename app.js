const Koa = require('koa')
var serve = require('koa-static')
const session = require('koa-session')
var Router = require('koa-router')
var koaLogger = require('koa-logger')
const koaBody = require('koa-body')
const views = require('koa-views')
const N = require('./models/news')

var app = new Koa()
const router = new Router()

app.use(views('views', {map:{html:'ejs'}})) 
app.use(koaLogger())
app.use(koaBody())
app.keys = ['*@&))9kdjafda;983'] 
const CONFIG = { 
  key: 'd**@&(_034k3q3&@^(!$!',
  maxAge: 86400000
}
app.use(session(CONFIG, app)) 

app.use(router.routes())
app.use(serve(__dirname + '/views'))

router
.get('/', async (ctx) => {
    
    let data = []
    let linePerPage = 5
    let pageNow

    if (ctx.query.pageNow){
        pageNow = Number(ctx.query.pageNow)
    }
    else{
        pageNow = 1
    }

    let news = await N.list()
    await news.forEach(element => {
        data.push(element)
    })

    let totalLine = data.length
    let totalPage = Math.ceil(totalLine/linePerPage)

    let result = data.slice(5*pageNow-5,5*pageNow)

    await ctx.render('index', {
         data:result, pageNow, totalLine, totalPage, linePerPage
    })
})
.get('/news', async (ctx) => {
    let n_id = ctx.query._id
    let op = ctx.query.op
    switch (op) {
        case 'view':
            var data = await N.get(n_id)
            await ctx.render('view',{
                data
            })
            break;
            
        case 'edit':
            var data = await N.get(n_id)
            let pageNow = ctx.query.pageNow
            await ctx.render('edit',{
                data, pageNow
            })
            break;
    }
})
.post('/createNews', async (ctx) => {
    let data = ctx.request.body
    console.log(data)
    await N.add(data)
    ctx.redirect('/')
})
.post('/updateNews', async (ctx) => {
    let data = ctx.request.body
    console.log(data)
    await N.update(data)
    ctx.redirect(`/?pageNow=${data.pageNow}`)
})
.post('/removeNews', async (ctx) => {
    let n_id = ctx.request.body
    await N.remove(n_id)
    ctx.response.body = `${n_id} remove!`
});

(async function () {
    await N.open()
    app.listen(3000)
    console.log("server run at http://localhost:3000")
}())