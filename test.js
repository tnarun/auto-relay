const api = require('./lib/api')

const { roomId, cookie } = require('./room.json')

const run = async () => {
  // 获取直播推流信息
  // let res = await api.getStreamByRoomId({ roomId, cookie })
  // console.log({ res })

  // 开播
  // let res = await api.startLive({ roomId, cookie })
  // console.log({ res })

  // 关播
  let res = await api.stopLive({ roomId, cookie })
  console.log({ res })
}

run().then()