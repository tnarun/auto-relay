const { GET_WITH_COOKIE, POST_WITH_COOKIE } = require('./base')

// 获取直播推流信息
const getStreamByRoomId = async ({ roomId, cookie }) => {
  let base = `https://api.live.bilibili.com`
  let path = `${ base }/live_stream/v1/StreamList/get_stream_by_roomId?room_id=${ roomId }`
  return await GET_WITH_COOKIE({ path, cookie })
}

const _buildFormData = ({ roomId, cookie }) => {
  let csrf = cookie.match(/bili_jct=([a-f0-9]+);/)[1]
  let data = {
    room_id: roomId,
    platform: 'pc',
    area_v2: 236,
    csrf_token: csrf,
    csrf
  }
  return Object.keys(data).map(key => `${key}=${data[key]}`).join('&')
}

const startLive = async ({ roomId, cookie }) => {
  let base = `https://api.live.bilibili.com`
  let path = `${ base }/room/v1/Room/startLive`
  return await POST_WITH_COOKIE({ path, cookie, formdata: _buildFormData({ roomId, cookie }) })
}

const stopLive = async ({ roomId, cookie }) => {
  let base = `https://api.live.bilibili.com`
  let path = `${ base }/room/v1/Room/stopLive`
  return await POST_WITH_COOKIE({ path, cookie, formdata: _buildFormData({ roomId, cookie }) })
}

module.exports = {
  getStreamByRoomId,
  startLive,
  stopLive
}