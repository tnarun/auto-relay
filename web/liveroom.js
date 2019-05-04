const { exec, spawnSync } = require('child_process')
const fs = require('fs')
const biliAPI = require('../lib/api')

// 获取当前所有转播进程
const getLiving = async () => {
  let pidFiles = fs.readdirSync('.')
    .filter(x => x.match(/\.live\.pid$/))
    .map(x => {
      let fileName = x
      let biliRoom = x.split('.live.pid')[0]
      let pid = (fs.readFileSync(x) + '').trim()
      let data = JSON.parse(fs.readFileSync(`${ biliRoom }.live.json`))
      return { fileName, biliRoom, pid, data }
    })

  return new Promise(resolve => {
    resolve(pidFiles)
  })
}

const _getRtmpUrl = async ({ biliRoom, cookie }) => {
  let res = await biliAPI.getStreamByRoomId({ roomId: biliRoom, cookie })
  return res.data.rtmp.addr + res.data.rtmp.code
}

// 开启转播进程
const startWatch = async ({ twitchId, biliRoom, cookie }) => {
  // 获取 rtmp url
  let rtmpUrl = await _getRtmpUrl({ biliRoom, cookie })

  // 记录转播信息
  let data = { from: twitchId, to: biliRoom, rtmpUrl, cookie }
  fs.writeFileSync(`${ biliRoom }.live.json`, JSON.stringify(data))

  // 启动转播监控 shell 脚本，记录 pid
  // let shFile = `../shell/test-cmd.sh`
  let shFile = `../shell/twitch-bili.sh ${ twitchId } ${ biliRoom } "${ rtmpUrl }"`
  let cmd = `nohup sh ${ shFile } > ${ biliRoom }.live.log & echo $! > ${ biliRoom }.live.pid`
  exec(cmd, { 
    detached: true,
  })

  return {
    twitchId, biliRoom, cookie, rtmpUrl
  }
}

// 停止转播进程
const stopWatch = async ({ biliRoom }) => {
  let pidFile = `${ biliRoom }.live.pid`
  let pid = (fs.readFileSync(pidFile) + '').trim()
  let cmd = `kill ${pid}`
  exec(cmd, { 
    detached: true,
  })
  fs.unlinkSync(pidFile)
  return {
    biliRoom
  }
}

module.exports = { getLiving, startWatch, stopWatch }