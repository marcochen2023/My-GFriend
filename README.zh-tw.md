# MY GFRIEND：您的 AI 雲端女友 (v1.0 - 開源版)

[英文](README.md)  |  [簡體中文](README.zh-cn.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
想像您有一個專屬的女友，隨時隨地陪伴您，與您聊天、分享心情、送您甜蜜的訊息。現在，MY GFRIEND 讓這個夢想更近一步！這是一個 **開源** 的 AI 雲端女友專案，透過串接**本地 AI 模型**，旨在為您提供一個**私密、可自訂、且具備互動性**的聊天體驗。


![image](https://github.com/marcochen2023/My-GFriend/blob/main/example/MyGFriend.jpg)

[![點此觀看影片](https://img.youtube.com/vi/6lvPyDvDBfw/0.jpg)](https://www.youtube.com/watch?v=6lvPyDvDBfw)

## ✨ 功能特色

* **熟悉的聊天介面：** 仿 Line/WeChat 的 UI 設計，支援 PC 與行動裝置。
* **本地 LLM 驅動：** 透過串接本地執行的 **LM Studio** 的 LLM API，實現高品質、私密的對話。支援多種模型切換。
* **本地圖片生成：** 透過串接本地執行的 **Stable Diffusion WebUI** (或其他相容 API) 的繪圖 API，女友可以根據對話或您的要求（含文字描述）「自拍」傳送圖片。
* **個性化女友設定：** 可自訂女友的名稱、職業、個性、您對她的稱呼，以及補充設定，影響對話風格。
* **好感度系統：** 透過送禮和對話互動影響好感度，好感度會影響女友的回應語氣和行為。
* **動態互動：**
    * **主動訊息：** 可設定女友主動發起對話的頻率。
    * **行為選項：** 女友回應後會提供 4 個「用戶視角」的後續對話/行動建議。
* **多國語言：** 內建繁體中文、英文、日文介面。
* **對話記錄：** 自動儲存聊天記錄於本地 `data/chathistory.log`。
* **頭像管理：** 支援上傳並裁剪自訂頭像。
* **繪圖參數可調：** 可設定 SD 的 Sampler、Steps 及自訂正/負向提示詞、ADetailer 等。
* **開源 & 可擴展：** 歡迎社群一同改進和擴展功能！

## 🚀 技術棧

* **前端：** HTML, CSS, JavaScript (原生, 無框架)
* **後端：** PHP (需要 Web Server 環境，如 Apache/Nginx)
* **AI 模型 API (本地部署)：**
    * **LLM:** [LM Studio](https://lmstudio.ai/) (或其他提供類 OpenAI API 的本地模型伺服器)
    * **Image:** [Stable Diffusion WebUI (AUTOMATIC1111)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) (需啟用 API) 或其他相容的圖片生成 API (如 ComfyUI + API Wrapper, Together AI 等)
* **資料儲存：** 本地 JSON 檔案 (設定檔), Log 檔案 (聊天記錄), 本地圖片檔案

## 📋 環境要求 (Prerequisites)

在開始之前，請確保您的電腦環境滿足以下條件，本地同時運行LLM和WEBUI繪圖模組時，請確保顯卡的VRAM在16GB以上：

1.  **PHP 環境：**
    * 安裝 PHP (建議版本 7.4 或更高)。
    * 需要啟用 `curl` (用於 API 請求) 和 `gd` (用於圖片處理) PHP 擴充。
    * 需要一個 Web 伺服器 (如 XAMPP, WAMP, MAMP 中的 Apache, 或 Nginx + PHP-FPM)。
	* 推薦 XAMPP,下載最新版本安裝後運行,點擊Apache Start即可,將下載的檔案放到"xampp/htdocs/"資料夾中即可,可以將原本資料夾中檔安刪除。

2.  **LM Studio：**
    * 已安裝並運行 LM Studio。
    * 單獨運行LLM時, 裝置顯卡VRAM最好8GB以上。
    * 至少下載並載入了一個 GGUF 格式的 LLM 模型。
    * 啟動了 LM Studio 的 **Local Inference Server** (通常在 `http://127.0.0.1:1234/v1`)。
    * 推薦使用7B以上的LLM才可以獲得較良好的體驗。
    * 最完美體驗可使用Llama-3.3-70B-Instruct-Turbo, 可打開全新驚奇的體驗(多人)和各種姿勢。

3.  **Stable Diffusion WebUI AUTO1111 / Forge (或相容 API)：**
    * 已安裝並運行 AUTOMATIC1111 的 Stable Diffusion WebUI (或其他圖片生成服務)。
    * **必須** 啟用 API 功能 (通常需要在啟動 WebUI 時加入 `--api` 參數)。
    * API 服務正在運行 (通常在 `http://127.0.0.1:7860`)。
    * (可選) 安裝並啟用了 [ADetailer](https://github.com/Bing-su/adetailer) 擴充 (如果需要臉部修復功能)。
    * 任何SD,SDXL,PDXL,Illustrious,Flux,只要可以在AUTO1111/WEBUI_Forge上運行的模組都可以使用,推薦使用真實系Illustrious模組可以獲得最佳效果,以及較快的出圖速度。
    * 若本地裝置無法驅動, 推薦部屬runpod.io的GPU,方便又好用,runpod搜尋Stable Diffusion WebUI Forge即可找到runpod/forge:3.3.0
    * 若要使用Illustrious模組,可到我們的Tensor art頁面下載Gemini_ILMix Illustrious realistic:https://tensor.art/models/841406066609849364/Gemini_ILMix-Illustrious-realistic-Illustrious_V1

4.  **Web 瀏覽器：** Chrome, Firefox, Edge 等現代瀏覽器。

## ⚙️ 安裝與設定 (Setup & Installation)

1.  **下載/Clone 專案：**
    ```bash
    git clone https://github.com/marcochen2023/My-GFriend.git
    # 或者直接下載 ZIP 解壓縮
    ```
2.  **放置專案：** 將整個 `MYGFRIEND` 資料夾放置到您的 Web 伺服器的網站根目錄下 (例如 XAMPP 的 `htdocs` 目錄)。
3.  **設定權限：**
    * **非常重要：** 確保 Web 伺服器程序 (如 `www-data`, `apache`) 對以下目錄及其子目錄具有**讀取**和**寫入**權限：
        * `data/`
        * `image/avatar/`
        * `image/photo/`
    * 在 Linux/macOS 上可能需要使用 `chmod` 或 `chown` 命令。在 Windows 上通常權限較寬鬆，但也需留意。
4.  **設定 API 連接：**
    * **複製範本：** 將 `data/girlfriend_settings.json.template` 複製一份並命名為 `data/girlfriend_settings.json`。
    * **編輯 LLM 設定 (`LSLLMModel.json`)：**
        * 開啟根目錄下的 `LSLLMModel.json`。
        * 修改或添加模型條目。確保 `id` 是唯一的。
        * `displayName` 是顯示在介面上的名稱。
        * `model` 是 API 需要的模型標識符 (對於 LM Studio，通常是載入的模型文件名或 API 認得的 ID；對於外部 API，是其要求的模型名稱)。
        * `endpoint` 填寫您的 LLM API 位址 (本地 LM Studio 通常是 `http://127.0.0.1:1234/v1/chat/completions`)。
        * 如果您使用外部 API (如 Together AI)，請填寫其 `endpoint` 和 `API_KEY` (**注意：將金鑰直接放在此處有安全風險，請謹慎使用**)。本地 LM Studio 的 `API_KEY` 通常留空。
    * **AI繪圖模組API設定 (`IMAGEModel.json`)：**
        * 開啟根目錄下的 `IMAGEModel.json`。
        * 修改或添加圖片生成服務條目。確保 `id` 是唯一的。
        * `displayName` 是顯示在介面上的名稱。
        * `model` 是 SD WebUI 中您要使用的 Checkpoint 模型名稱 (或其他 API 服務的模型標識符)。
        * `SD_WEBUI_API_URL` 填寫您的圖片生成 API 位址 (本地 SD WebUI 通常是 `http://127.0.0.1:7860/sdapi/v1/txt2img`)。
        * 如果您使用外部服務，請填寫其 API 位址和 `API_KEY`。本地 SD WebUI 的 `API_KEY` 通常留空。
5.  **啟動服務：**
    * 確保您的 Web 伺服器 (Apache/Nginx) 和 PHP 正在運行。
    * 確保您的 LM Studio Local Inference Server 正在運行且已載入模型。
    * 確保您的 Stable Diffusion WebUI API 服務正在運行。
6.  **訪問應用：** 在瀏覽器中訪問 `index.php` 所在的 URL (例如 `http://localhost/MYGFRIEND/` 或 `http://127.0.0.1/MYGFRIEND/`)。

## 🔧 設定與自訂

* **語言：** 在右上角選擇介面語言。
* **模型：** 點擊右上角的設定圖標 (⚙️)，選擇要使用的 LLM 和圖片生成模型。
* **女友設定：** 點擊女友設定圖標 (通常是頭像左邊那個)，可以設定：
    * 女友名稱、您的名稱
    * 女友職業、個性 (選項來自 `data/occupation.json`, `data/personality.json`)
    * 其他補充說明 (會影響 LLM 的認知)
    * 繪圖參數 (Sampler, Steps, 正負向提示詞, ADetailer)
* **頭像：** 點擊左上角 Logo 或聊天介面中的女友頭像，打開頭像更換 Modal：
    * 點擊已有的縮圖可直接更換。
    * 點擊「選擇圖片」可上傳新頭像，支援裁剪。

## 📖 檔案結構

```
MYGFRIEND/
│
├── .git/              # Git 目錄 (自動生成)
├── .gitignore         # Git 忽略設定檔
├── index.php          # 主要 HTML 和 PHP 啟動點
├── funMYGF.php        # 後端 PHP 邏輯
├── MYGFstyle.css      # CSS 樣式
├── MYGFjs.js          # JavaScript 邏輯
├── LSLLMModel.json    # LLM 模型設定檔 (用戶需修改)
├── IMAGEModel.json    # 圖片模型設定檔 (用戶需修改)
├── languagepacks.json # 多國語言檔
├── LICENSE            # 開源授權文件 (MIT)
├── README.md          # 專案說明主文件
│
├── data/
│   ├── .gitignore     # 忽略此目錄下的 user data
│   ├── occupation.json  # 職業範例,可自行添加
│   ├── personality.json # 個性範例,可自行添加
│   ├── girlfriend_settings.json.template # 女友設定範本檔
│   └── sound/
│       └── gift.wav # 禮物音效
│
└── image/
    ├── .gitignore     # 忽略用戶上傳/生成的圖片目錄
    ├── GFriend.png    # Logo
    ├── setting.png    # 設定圖標
    ├── girlinfo.png   # 女友設定圖標
    ├── copyright.png  # 版權資訊圖標
    │
    ├── avatar/
    │   ├── .gitignore # 忽略用戶上傳的頭像內容
    │   └── default_avatar.png # 預設頭像
    │
    ├── photo/
    │   └── .gitignore # 忽略聊天生成的照片內容
    │
    └── gifts/         # (可選) 存放禮物圖片
        └── default.png   # 範例
        └── ...
```

## 📖 使用說明

1.  完成安裝與設定。
2.  (首次使用) 根據提示上傳或選擇一個女友頭像。
3.  (建議) 進入「女友設定」和「應用程式設定」，選擇您偏好的模型和角色設定。
4.  在下方的輸入框輸入訊息，按「傳送」(➤) 或 Enter 開始聊天。
5.  點擊「要求自拍」(📸) 按鈕，可以讓女友根據當前對話情境（以及您在輸入框額外輸入的文字描述）生成一張圖片。
6.  點擊「呼叫女友」按鈕可以快速發起一個問候。
7.  點擊「送禮」按鈕可以選擇禮物贈送給女友，增加好感度。
8.  觀察上方的好感度條變化，它會影響女友的語氣和行為。
9.  點擊訊息氣泡上的垃圾桶圖標可以刪除該條訊息（及其對應的回應，如果是用戶訊息）。

## 🤝 如何貢獻 (Contributing)

我們歡迎任何形式的貢獻！您可以：

* 回報 Bug 或提出建議：請至 GitHub Issues 頁面提交。
* 改進程式碼或新增功能：Fork 本專案，建立您的 Feature Branch (`git checkout -b feature/AmazingFeature`)，Commit 您的改動 (`git commit -m 'Add some AmazingFeature'`)，Push 到您的 Branch (`git push origin feature/AmazingFeature`)，然後開啟一個 Pull Request。
* 新增或改進翻譯。
* 分享您的使用體驗和自訂設定。

## 📜 授權條款 (License)

本專案採用 MIT 授權條款 - 詳情請見 `LICENSE` 文件。

## 🧑‍💻 開發者 (Developers)

* Sinsin Wang 
([https://www.facebook.com/WangSinsin](https://www.facebook.com/sinsinwang2004))
(https://x.com/Windgirl2003)

* Marco Chen 
(marcochen2023@gmail.com)

* Ethan Chen

## 💬 社群 (Community)

加入我們的開源討論社群：

[https://gemini.google.com/share/9e42a0365e90](https://gemini.google.com/share/9e42a0365e90)

---
