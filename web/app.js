const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const liveroom = require('./liveroom')

app.use(bodyParser.json())

app.all('*', (req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "*")
  resp.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
  resp.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  resp.header("X-Powered-By",' 3.2.1')
  if (req.method=="OPTIONS") {
    resp.sendStatus(200)
  } else {
    next()
  }
})

// 握手
app.get('/hello', (req, resp) => {
  resp.send({ hello: 'hello' })
})

// 开启转播进程
app.post('/startWatch', (req, resp) => {
  let { twitchId, biliRoom, cookie } = req.body
  liveroom.startWatch({ twitchId, biliRoom, cookie }).then(res => {
    resp.send({ call: 'startWatch', res })
  })
})

// 停止转播进程
app.post('/stopWatch', (req, resp) => {
  let { biliRoom } = req.body
  liveroom.stopWatch({ biliRoom }).then(res => {
    resp.send({ call: 'stopWatch', res })
  })
})

// 获取当前转播进程
app.get('/getLiving', (req, resp) => {
  liveroom.getLiving().then(res => {
    resp.send({ call: 'living', res })
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})