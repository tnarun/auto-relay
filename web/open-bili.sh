#!/bin/bash
# 循环启动 bili 直播间

while true; do
  # 开启 bili 直播间
  node ../web/start.js 38593
  sleep 30
done