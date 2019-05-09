#!/bin/bash
# 虎牙直播信号推流转播

# 参数格式检查
if [[ ! -n "$1" ]]; then
  echo "usage: $0 huyaId target [format] [loop|once] [interval]"
  exit 1
fi

HUYA_ROOM="www.huya.com/$1"
RTMP_URL=$(cat $2.rtmp)
INTERVAL="10"

echo $HUYA_ROOM
echo $RTMP_URL
echo $INTERVAL


while true; do
  # 监控源直播间开播情况
  unset M3U8_URL
  while true; do
    LOG_PREFIX=$(date +"[%Y-%m-%d %H:%M:%S]")
    echo "$LOG_PREFIX 尝试获取直播流。Try to get current live stream of twitch.tv/$1"

    # 获取直播源 m3u8 地址
    # Get the m3u8 address with streamlink
    M3U8_URL=$(streamlink --stream-url "$HUYA_ROOM" "best")
    echo "直播流：$M3U8_URL"
    (echo "$M3U8_URL" | grep -q ".m3u8") && break

    echo "$LOG_PREFIX 源直播间没有开播。The stream is not available now."
    echo "$LOG_PREFIX 稍后重试。Retry after $INTERVAL seconds..."
    sleep $INTERVAL
  done

  # 如果开播了，开始转播推流
  echo "ffmpeg -i $M3U8_URL -vcodec copy -acodec aac -strict -2 -f flv $RTMP_URL"
  ffmpeg -i "$M3U8_URL" -vcodec copy -acodec aac -strict -2 -f flv "$RTMP_URL"

  # # Exit if we just need to record current stream
  # LOG_PREFIX=$(date +"[%Y-%m-%d %H:%M:%S]")
  # echo "$LOG_PREFIX Live stream recording stopped."
  # sleep $INTERVAL
done