# MY GFRIEND：您的 AI 云端女友 (v1.0 - 开源版)

[英文](README.md)  |  [繁體中文](README.zh-tw.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
想像您有一个专属的女友，随时随地陪伴您，与您聊天、分享心情、送您甜蜜的讯息。现在，MY GFRIEND 让这个梦想更近一步！这是一个 **开源** 的 AI 云端女友专案，透过串接**本地 AI 模型**，旨在为您提供一个**私密、可自订、且具备互动性**的聊天体验。


![image](https://github.com/marcochen2023/My-GFriend/blob/main/example/MyGFriend.jpg)


## ✨ 功能特色

* **熟悉的聊天介面：** 仿 Line/WeChat 的 UI 设计，支援 PC 与行动装置。
* **本地 LLM 驱动：** 透过串接本地执行的 **LM Studio** 的 LLM API，实现高品质、私密的对话。支援多种模型切换。
* **本地图片生成：** 透过串接本地执行的 **Stable Diffusion WebUI** (或其他相容 API) 的绘图 API，女友可以根据对话或您的要求（含文字描述）「自拍」传送图片。
* **个性化女友设定：** 可自订女友的名称、职业、个性、您对她的称呼，以及补充设定，影响对话风格。
* **好感度系统：** 透过送礼和对话互动影响好感度，好感度会影响女友的回应语气和行为。
* **动态互动：**
 * **主动讯息：** 可设定女友主动发起对话的频率。
 * **行为选项：** 女友回应后会提供 4 个「用户视角」的后续对话/行动建议。
* **多国语言：** 内建繁体中文、英文、日文介面。
* **对话记录：** 自动储存聊天记录于本地 `data/chathistory.log`。
* **头像管理：** 支援上传并裁剪自订头像。
* **绘图参数可调：** 可设定 SD 的 Sampler、Steps 及自订正/负向提示词、ADetailer 等。
* **开源 & 可扩展：** 欢迎社群一同改进和扩展功能！

## 🚀 技术栈

* **前端：** HTML, CSS, JavaScript (原生, 无框架)
* **后端：** PHP (需要 Web Server 环境，如 Apache/Nginx)
* **AI 模型 API (本地部署)：**
 * **LLM:** [LM Studio](https://lmstudio.ai/) (或其他提供类 OpenAI API 的本地模型伺服器)
 * **Image:** [Stable Diffusion WebUI (AUTOMATIC1111)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) (需启用 API) 或其他相容的图片生成 API (如 ComfyUI + API Wrapper, Together AI 等)
* **资料储存：** 本地 JSON 档案 (设定档), Log 档案 (聊天记录), 本地图片档案

## 📋 环境要求 (Prerequisites)

在开始之前，请确保您的电脑环境满足以下条件，本地同时运行LLM和WEBUI绘图模组时，请确保显卡的VRAM在16GB以上：

1.  **PHP 环境：**
 * 安装 PHP (建议版本 7.4 或更高)。
 * 需要启用 `curl` (用于 API 请求) 和 `gd` (用于图片处理) PHP 扩充。
 * 需要一个 Web 伺服器 (如 XAMPP, WAMP, MAMP 中的 Apache, 或 Nginx + PHP-FPM)。
 * 推荐 XAMPP,下载最新版本安装后运行,点击Apache Start即可,将下载的档案放到"xampp/htdocs/"资料夹中即可,可以将原本资料夹中档安删除。

2.  **LM Studio：**
 * 已安装并运行 LM Studio。
 * 单独运行LLM时, 装置显卡VRAM最好8GB以上。
 * 至少下载并载入了一个 GGUF 格式的 LLM 模型。
 * 启动了 LM Studio 的 **Local Inference Server** (通常在 `http://127.0.0.1:1234/v1`)。
 * 推荐使用7B以上的LLM才可以获得较良好的体验。
 * 最完美体验可使用Llama-3.3-70B-Instruct-Turbo, 可打开全新惊奇的体验(多人)和各种姿势。

3.  **Stable Diffusion WebUI AUTO1111 / Forge (或相容 API)：**
 * 已安装并运行 AUTOMATIC1111 的 Stable Diffusion WebUI (或其他图片生成服务)。
 * **必须** 启用 API 功能 (通常需要在启动 WebUI 时加入 `--api` 参数)。
 * API 服务正在运行 (通常在 `http://127.0.0.1:7860`)。
 * (可选) 安装并启用了 [ADetailer](https://github.com/Bing-su/adetailer) 扩充 (如果需要脸部修复功能)。
 * 任何SD,SDXL,PDXL,Illustrious,Flux,只要可以在AUTO1111/WEBUI_Forge上运行的模组都可以使用,推荐使用真实系Illustrious模组可以获得最佳效果,以及较快的出图速度。
 * 若本地装置无法驱动, 推荐部属runpod.io的GPU,方便又好用,runpod搜寻Stable Diffusion WebUI Forge即可找到runpod/forge:3.3.0
 * 若要使用Illustrious模组,可到我们的Tensor art页面下载Gemini_ILMix Illustrious realistic:https://tensor.art/models/841406066609849364/Gemini_ILMix-Illustrious-realistic-Illustrious_V1

4.  **Web 浏览器：** Chrome, Firefox, Edge 等现代浏览器。

## ⚙️ 安装与设定 (Setup & Installation)

1.  **下载/Clone 专案：**
 ```bash
 git clone [https://github.com/您的用户名/MYGFRIEND.git](https://github.com/您的用户名/MYGFRIEND.git)
 # 或者直接下载 ZIP 解压缩
 ```
2.  **放置专案：** 将整个 `MYGFRIEND` 资料夹放置到您的 Web 伺服器的网站根目录下 (例如 XAMPP 的 `htdocs` 目录)。
3.  **设定权限：**
 * **非常重要：** 确保 Web 伺服器程序 (如 `www-data`, `apache`) 对以下目录及其子目录具有**读取**和**写入**权限：
 * `data/`
 * `image/avatar/`
 * `image/photo/`
 * 在 Linux/macOS 上可能需要使用 `chmod` 或 `chown` 命令。在 Windows 上通常权限较宽松，但也需留意。
4.  **设定 API 连接：**
 * **复制范本：** 将 `data/girlfriend_settings.json.template` 复制一份并命名为 `data/girlfriend_settings.json`。
 * **编辑 LLM 设定 (`LSLLMModel.json`)：**
 * 开启根目录下的 `LSLLMModel.json`。
 * 修改或添加模型条目。确保 `id` 是唯一的。
 * `displayName` 是显示在介面上的名称。
 * `model` 是 API 需要的模型标识符 (对于 LM Studio，通常是载入的模型文件名或 API 认得的 ID；对于外部 API，是其要求的模型名称)。
 * `endpoint` 填写您的 LLM API 位址 (本地 LM Studio 通常是 `http://127.0.0.1:1234/v1/chat/completions`)。
 * 如果您使用外部 API (如 Together AI)，请填写其 `endpoint` 和 `API_KEY` (**注意：将金钥直接放在此处有安全风险，请谨慎使用**)。本地 LM Studio 的 `API_KEY` 通常留空。
 * **AI绘图模组API设定 (`IMAGEModel.json`)：**
 * 开启根目录下的 `IMAGEModel.json`。
 * 修改或添加图片生成服务条目。确保 `id` 是唯一的。
 * `displayName` 是显示在介面上的名称。
 * `model` 是 SD WebUI 中您要使用的 Checkpoint 模型名称 (或其他 API 服务的模型标识符)。
 * `SD_WEBUI_API_URL` 填写您的图片生成 API 位址 (本地 SD WebUI 通常是 `http://127.0.0.1:7860/sdapi/v1/txt2img`)。
 * 如果您使用外部服务，请填写其 API 位址和 `API_KEY`。本地 SD WebUI 的 `API_KEY` 通常留空。
5.  **启动服务：**
 * 确保您的 Web 伺服器 (Apache/Nginx) 和 PHP 正在运行。
 * 确保您的 LM Studio Local Inference Server 正在运行且已载入模型。
 * 确保您的 Stable Diffusion WebUI API 服务正在运行。
6.  **访问应用：** 在浏览器中访问 `index.php` 所在的 URL (例如 `http://localhost/MYGFRIEND/` 或 `http://127.0.0.1/MYGFRIEND/`)。

## 🔧 设定与自订

* **语言：** 在右上角选择介面语言。
* **模型：** 点击右上角的设定图标 (⚙️)，选择要使用的 LLM 和图片生成模型。
* **女友设定：** 点击女友设定图标 (通常是头像左边那个)，可以设定：
 * 女友名称、您的名称
 * 女友职业、个性 (选项来自 `data/occupation.json`, `data/personality.json`)
 * 其他补充说明 (会影响 LLM 的认知)
 * 绘图参数 (Sampler, Steps, 正负向提示词, ADetailer)
* **头像：** 点击左上角 Logo 或聊天介面中的女友头像，打开头像更换 Modal：
 * 点击已有的缩图可直接更换。
 * 点击「选择图片」可上传新头像，支援裁剪。

## 📖 档案结构

MYGFRIEND/
│
├── .git/              # Git 目录 (自动生成)
├── .gitignore         # Git 忽略设定档
├── index.php          # 主要 HTML 和 PHP 启动点
├── funMYGF.php        # 后端 PHP 逻辑
├── MYGFstyle.css      # CSS 样式
├── MYGFjs.js          # JavaScript 逻辑
├── LSLLMModel.json    # LLM 模型设定档 (用户需修改)
├── IMAGEModel.json    # 图片模型设定档 (用户需修改)
├── languagepacks.json # 多国语言档
├── LICENSE            # 开源授权文件 (MIT)
├── README.md          # 专案说明主文件
│
├── data/
│   ├── .gitignore     # 忽略此目录下的 user data
│   ├── occupation.json  # 职业范例,可自行添加
│   ├── personality.json # 个性范例,可自行添加
│   └── girlfriend_settings.json.template # 女友设定范本档
│
└── image/
 ├── .gitignore     # 忽略用户上传/生成的图片目录
 ├── GFriend.png    # Logo
 ├── setting.png    # 设定图标
 ├── girlinfo.png   # 女友设定图标
 ├── copyright.png  # 版权资讯图标
 │
 ├── avatar/
 │   ├── .gitignore # 忽略用户上传的头像内容
 │   └── default_avatar.png # 预设头像
 │
 ├── photo/
 │   └── .gitignore # 忽略聊天生成的照片内容
 │
 └── gifts/         # (可选) 存放礼物图片
 └── default.png   # 范例
 └── ...

## 📖 使用说明

1.  完成安装与设定。
2.  (首次使用) 根据提示上传或选择一个女友头像。
3.  (建议) 进入「女友设定」和「应用程式设定」，选择您偏好的模型和角色设定。
4.  在下方的输入框输入讯息，按「传送」(➤) 或 Enter 开始聊天。
5.  点击「要求自拍」(📸) 按钮，可以让女友根据当前对话情境（以及您在输入框额外输入的文字描述）生成一张图片。
6.  点击「呼叫女友」按钮可以快速发起一个问候。
7.  点击「送礼」按钮可以选择礼物赠送给女友，增加好感度。
8.  观察上方的好感度条变化，它会影响女友的语气和行为。
9.  点击讯息气泡上的垃圾桶图标可以删除该条讯息（及其对应的回应，如果是用户讯息）。

## 🤝 如何贡献 (Contributing)

我们欢迎任何形式的贡献！您可以：

* 回报 Bug 或提出建议：请至 GitHub Issues 页面提交。
* 改进程式码或新增功能：Fork 本专案，建立您的 Feature Branch (`git checkout -b feature/AmazingFeature`)，Commit 您的改动 (`git commit -m 'Add some AmazingFeature'`)，Push 到您的 Branch (`git push origin feature/AmazingFeature`)，然后开启一个 Pull Request。
* 新增或改进翻译。
* 分享您的使用体验和自订设定。

## 📜 授权条款 (License)

本专案采用 MIT 授权条款 - 详情请见 `LICENSE` 文件。

## 🧑‍💻 开发者 (Developers)

* Sinsin Wang
(https://www.facebook.com/WangSinsin)
(https://x.com/Windgirl2003)

* Marco Chen
(marcochen2023@gmail.com)

* Ethan Chen

## 💬 社群 (Community)

加入我们的开源讨论社群：

您已被邀请加入「My GFriend 我的云端女友开源讨论群」！请点选以下连结加入社群！
![image](https://github.com/marcochen2023/My-GFriend/blob/main/example/QrCode.jpg)

https://line.me/ti/g2/sYbY0s982DuzdBu_qPu4u2MogNE1rmK_Im1ihg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default

---