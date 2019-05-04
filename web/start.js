// 启动直播间
const fs = require('fs')
const api = require('../lib/api')

const run = async () => {
  let roomId = process.argv[2]
  let data = JSON.parse(fs.readFileSync(`./${ roomId }.live.json`))
  let { cookie } = data

  // 开播
  let res = await api.startLive({ roomId, cookie })
  console.log({ res })
}

run().then()