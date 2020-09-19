const Koa = require('koa')
var Router = require('koa-router')
var serve = require('koa-static')
const session = require('koa-session')
const koaBody = require('koa-body')
const views = require('koa-views')
const N = require('./models/news')

var app = new Koa()
const router = new Router()

app.use(views('views', { map: { html: 'ejs' } }))
app.use(koaBody())
app.keys = ['*@&))9kdjafda;983']
const CONFIG = {
    key: 'd**@&(_034k3q3&@^(!$!',
    maxAge: 86400000
}
app.use(session(CONFIG, app))

app.use(serve(__dirname + '/views'))

router
    .get('/', async (ctx) => {

        let datas = []
        let linePerPage = 5
        let pageNow

        if (ctx.query.pageNow) {
            pageNow = Number(ctx.query.pageNow)
        } else {
            pageNow = 1
        }

        let news = await N.list()
        await news.forEach(element => {
            datas.push(element)
        })

        let totalLine = datas.length
        let totalPage = Math.ceil(totalLine / linePerPage)

        let result = datas.slice(5 * pageNow - 5, 5 * pageNow)
        console.log('pageNow:', pageNow)
        console.log('totalPage:', totalPage)
        await ctx.render('index', {
            datas: result, pageNow, totalLine, totalPage, linePerPage
        })
    })

    .get('/news', async (ctx) => {
        let n_id = ctx.query._id
        let op = ctx.query.op
        if (n_id && op) {
            switch (op) {
                case 'view':
                    var data = await N.get(n_id)
                    await ctx.render('view', {
                        data
                    })
                    break;

                case 'edit':
                    var data = await N.get(n_id)
                    let pageNow = ctx.query.pageNow
                    await ctx.render('edit', {
                        data, pageNow
                    })
                    break;
            }
        }
        else {
            ctx.status = 404
        }
    })

    .post('/createNews', async (ctx) => {
        let data = ctx.request.body
        if (data) {
            console.log(data)
            await N.add(data)
            ctx.status = 201
            ctx.redirect('/')
        } else {
            ctx.status = 404
        }
    })

    .post('/updateNews', async (ctx) => {
        let data = ctx.request.body
        if (data) {
            await N.update(data)
            ctx.status = 201
            ctx.redirect(`/?pageNow=${data.pageNow}`)
        } else {
            ctx.status = 404
        }
    })

    .post('/removeNews', async (ctx) => {
        let n_id = ctx.request.body
        if (n_id) {
            await N.remove(n_id)
            ctx.response.body = `${n_id} remove!`
        } else {
            ctx.status = 404
        }
    });

app.use(router.routes())

app.listen(3000, async() => {
    await N.open()
    console.log("server run at http://localhost:3000")
})