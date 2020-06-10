const N = module.exports = {}
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'News'
var client, db, news
const ObjectId = require('mongodb').ObjectId
const dateFormat = require('dateformat')

N.open = async function () {
    client = await MongoClient.connect(url,{useUnifiedTopology: true, useNewUrlParser: true})
    db = client.db(dbName) 
    news = db.collection('news')
    console.log('test') 
}

N.list = async function (){
    let data = await news.find()
    return data
}

N.get = async function (id){
    let data = await news.findOne({_id: ObjectId(id)})
    console.log('db.get:',data)
    return data
}

N.add = async function (n_data){
    // let newDate = dateFormat(new Date(), 'yyyy-mm-dd')
    let data = await news.insertOne({
        'date': dateFormat(new Date(), 'yyyy-mm-dd'),
        'type': n_data.type,
        'title': n_data.title,
        'content': n_data.content,
    })
    console.log('add !')
    return data
}

N.update = async function (n_data){
    let data = await news.updateOne(
        {'_id': ObjectId('n_data'._id)},
        {$set: {'type': n_data.type, 'title': n_data.title, 'content': n_data.connect}}
    )
}

N.remove = async function (id){
    let data = await news.remove({_id:ObjectId(id)})
    console.log('db.remove')
    return data
}