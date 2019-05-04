#!/bin/bash
# Twitch 直播录像转播脚本
# https://github.com/printempw/live-stream-recorder

# 参数格式检查
if [[ ! -n "$1" ]]; then
  echo "usage: $0 twitch_id rtmp [format] [loop|once] [interval]"
  exit 1
fi

# 默认画质和循环间隔参数
# Record the highest quality available by default
TWITCH_ID="$1"
BILI_ROOM="$2"
RTMP_URL="$3"
FORMAT="${4:-best}"
LOOP="${5:-loop}"
INTERVAL="${6:-10}"

echo $TWITCH_ID
echo $BILI_ROOM
echo $RTMP_URL
echo $FORMAT
echo $LOOP
echo $INTERVAL

while true; do
  # 监控源直播间开播情况
  # Monitor live streams of specific channel
  while true; do
    LOG_PREFIX=$(date +"[%Y-%m-%d %H:%M:%S]")
    echo "$LOG_PREFIX 尝试获取直播流。Try to get current live stream of twitch.tv/$1"

    # 获取直播源 m3u8 地址
    # Get the m3u8 address with streamlink
    M3U8_URL=$(streamlink --stream-url "twitch.tv/$TWITCH_ID" "$FORMAT")
    (echo "$M3U8_URL" | grep -q ".m3u8") && break

    echo "$LOG_PREFIX 源直播间没有开播。The stream is not available now."
    echo "$LOG_PREFIX 稍后重试。Retry after $INTERVAL seconds..."
    sleep $INTERVAL
  done

  # 如果开播了，开始转播推流

  # 开启 bili 直播间
  node ../web/start.js "$BILI_ROOM"

  # 录像参数
  # Record using MPEG-2 TS format to avoid broken file caused by interruption
  # FNAME="twitch_${1}_$(date +"%Y%m%d_%H%M%S").ts"
  # echo "$LOG_PREFIX Start recording, stream saved to \"$FNAME\"."
  # echo "$LOG_PREFIX Use command \"tail -f $FNAME.log\" to track recording progress."
  # 开始录像
  # Start recording
  # ffmpeg -i "$M3U8_URL" -codec copy -f mpegts "$FNAME" > "$FNAME.log" 2>&1

  # 转播
  ffmpeg -i "$M3U8_URL" \
    -vcodec copy -acodec aac -strict -2 -f flv "$RTMP_URL" & echo $! > "$BILI_ROOM.ffmpeg.pid"

  # Exit if we just need to record current stream
  LOG_PREFIX=$(date +"[%Y-%m-%d %H:%M:%S]")
  echo "$LOG_PREFIX Live stream recording stopped."
  [[ "$LOOP" == "once" ]] && break
done