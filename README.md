# 七奈按钮 / NANA BUTTON

项目地址: https://kaguranana.moe/

音源来自VTuber神乐七奈

相关链接：
* [Youtube](https://www.youtube.com/channel/UCbfv8uuUXt3RSJGEwxny5Rw)
* [Twitter](https://twitter.com/nana_kaguraaa)
* [Bilibili](https://live.bilibili.com/21304638)

## 参与完善本项目

您可以在[Issues](https://github.com/blacktunes/kaguranana-button/issues)提出您的建议。

如果您可以进行开发，那么请Fork本项目进行修改，完成修改后在本项目中发起一个`Pull Request`，详细说明如下：

### 添加或修改音频

音频文件推荐使用mp3格式，音量平衡至89db，储存在`public/voices/`目录下。

所有的音频信息都存储在`public/translate/voices.json`中，要添加或修改音频，你同样需要修改这个文件中对应的内容。

添加`usePicture`字段可以添加鼠标悬浮时显示的表情包。

如果需要对现有音频进行修改，建议将原音频文件删除，重新命名一个新文件，这样可以避免浏览器缓存问题。

### 参与翻译

请帮助进行日语翻译！
暂未添加英语翻译。

`public/translate/locales.json`为网页的翻译。
`public/translate/voices.json`为音频信息的翻译。

### 参与网页开发

本项目使用`Vue3.0`进行开发，并使用`yarn2`进行包管理。要部署本地开发环境，请先安装最新版的`Node`。

1. Fork 并 Clone 代码到本地
2. 进入代码目录，运行`yarn`以安装依赖项目
3. 开启本地开发服务器，运行`yarn serve`，这将会在`localhost:8080`启动，在代码修改过程中，本地开发服务器可以即时反映修改的结果。
4. 要编译可供部署的文件，请运行`yarn build`，这将会在`dist`目录下生成可以直接部署到静态网站托管（GitHub Pages等）的文件。

### 使用模板

项目的主要配置在`src/setting`目录。
若要使用需要修改该目录以及`public`下的几乎所有文件。

### 贡献者

感谢辣辣七奈军剪辑语音

### TODO
* 新语音标识
* 直播计划
* 表情包搜索（测试中）
