# Ring Deck Demo

这是 RingRemix 的第一版 DJ 电子音乐环形可视化 demo。

## 打开方式

直接打开：

```text
demo/ring-deck/index.html
```

如果浏览器限制本地文件，也可以在本目录启动一个静态服务：

```text
python -m http.server 5173
```

然后访问：

```text
http://127.0.0.1:5173/index.html
```

## 发给组员

把 `ring-deck-demo.zip` 发给组员即可。对方解压后可以直接打开 `index.html`；如果浏览器限制本地播放，就在解压目录里运行：

```text
powershell -ExecutionPolicy Bypass -File .\start-share-server.ps1
```

脚本会显示一个局域网访问地址，同一 Wi-Fi 下的电脑或手机可以打开这个地址查看 demo。

## 当前功能

- 正常播放时，内置 Web Audio 合成器会生成 drums / bass / chords / lead 四层电子音乐。
- Canvas 会生成参考图风格的环形数据视觉。
- 六个 DJ 输入都会同时影响音乐和视觉：
  - 音轨音量
  - 高低通滤波
  - 采样触发
  - 1/2/4/8 beat loop
  - 唱盘 jog / scratch
  - 混响 wet/dry

## 后续替换真实音乐

当前 demo 没有加载外部音频文件，便于快速验证交互。后续如果使用真实 stems，可以把 `app.js` 中的实时合成调度替换成音频 buffer 播放，但保留这些控制事件：

```text
track.select
track.volume
filter.change
sample.trigger
loop.set
jog.rotate
reverb.change
```

