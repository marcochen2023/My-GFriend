<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MY GFRIEND</title>
    <link rel="stylesheet" href="MYGFstyle.css">
    <link rel="icon" href="image/GFriend.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <div class="header-left">
                 <img src="image/GFriend.png" alt="Logo" class="logo girlfriend-avatar-clickable" title="更換頭像">
                 <span class="app-title">MY GFRIEND</span>
             </div>
            <div class="header-right">
                 <button id="girlfriend-settings-btn" class="icon-button header-icon" data-translate-key="girlfriendSettingsBtnTooltip" title="女友設定">
                    <img src="image/girlinfo.png" alt="Girlfriend Settings" style="width: 48px; height: 48px; vertical-align: middle;">
                 </button>
                 <button id="copyright-btn" class="icon-button header-icon" data-translate-key="copyrightBtnTooltip" title="版權資訊">
                    <img src="image/copyright.png" alt="Copyright" style="width: 48px; height: 48px; vertical-align: middle;">
				 </button>
                <select id="language-switcher">
                    <option value="zh-TW">繁體中文</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                </select>
                <button id="settings-btn" class="icon-button header-icon" data-translate-key="settingsBtnTooltip" title="應用程式設定">
                    <img src="image/setting.png" alt="Settings" style="width: 48px; height: 48px; vertical-align: middle;">
                </button>
            </div>
        </header>

        <div class="favorability-bar-container">
            <span data-translate-key="favorabilityLabel">好感度:</span>
            <progress id="favorability-bar" max="2000" value="1000"></progress>
            <span id="favorability-value">0 / 1000</span>
        </div>

        <main class="chat-interface" id="chat-interface">
            </main>

        <footer class="input-area">
             <div class="action-buttons-group">
                <button id="call-girlfriend-btn" data-translate-key="callGirlfriendBtn">呼叫女友</button>
                <div class="gift-button-container"> <button id="gift-btn" data-translate-key="giftBtn">送禮</button> </div>
                 <select id="active-frequency-select" title="主動頻率設定"> <option value="0" data-translate-key="activeFrequencyOff">關閉主動</option> <option value="300" data-translate-key="activeFrequency5min">5分鐘</option> <option value="900" data-translate-key="activeFrequency15min">15分鐘</option> <option value="1800" data-translate-key="activeFrequency30min">30分鐘</option> <option value="3600" data-translate-key="activeFrequency60min">60分鐘</option> <option value="10800" data-translate-key="activeFrequency3hr">3小時</option> <option value="21600" data-translate-key="activeFrequency6hr">6小時</option> <option value="43200" data-translate-key="activeFrequency12hr">12小時</option> <option value="86400" data-translate-key="activeFrequency24hr">24小時</option> </select>
             </div>
             <div class="message-input-container">
                 <textarea id="message-input" placeholder="" data-translate-key="messageInputPlaceholder" rows="1"></textarea>
                 <button id="selfie-btn" class="send-button" data-translate-key="selfieBtnTooltip" title="要求自拍">📸</button>
                 <button id="send-button" class="send-button" data-translate-key="sendBtnTooltip" title="傳送">➤</button>
             </div>
        </footer>
    </div>

    <div id="avatar-modal" class="modal" style="z-index: 1060;"> <div class="modal-content"> <span class="close-btn" data-modal-id="avatar-modal">&times;</span> <h2 id="avatar-modal-title" data-translate-key="avatarModalTitleChange">更換女友頭像</h2> <p><small>(點擊下方縮圖可直接更換)</small></p> <div id="existing-avatars" class="avatar-thumbnail-container"> </div> <hr> <div id="change-avatar-options"> <h3 data-translate-key="uploadAvatarTitle">上傳新頭像:</h3> <button id="upload-avatar-btn" data-translate-key="uploadAvatarBtn">選擇圖片</button> <input type="file" id="avatar-upload-input" accept="image/*" style="display: none;"> <div id="avatar-cropper-container" style="display: none; width: 300px; height: 300px; margin: 10px auto;"></div> <button id="confirm-crop-btn" style="display: none;" data-translate-key="confirmCropBtn">確認裁剪並上傳</button> </div> </div> </div>
    <div id="settings-modal" class="modal" style="z-index: 1050;"> <div class="modal-content"> <span class="close-btn" data-modal-id="settings-modal">&times;</span> <h2 data-translate-key="settingsModalTitle">應用程式設定</h2> <div class="setting-item"> <label for="llm-model-select" data-translate-key="llmModelLabel">LLM 模型:</label> <select id="llm-model-select"></select> </div> <div class="setting-item"> <label for="image-model-select" data-translate-key="imageModelLabel">繪圖模型:</label> <select id="image-model-select"></select> </div> <button id="save-app-settings-btn" data-translate-key="saveAppSettingsBtn">儲存設定</button> </div> </div>
    <div id="girlfriend-settings-modal" class="modal" style="z-index: 1055;"> <div class="modal-content large"> <span class="close-btn" data-modal-id="girlfriend-settings-modal">&times;</span> <h2 data-translate-key="girlfriendSettingsModalTitle">女友設定</h2> <div class="settings-section"> <h3 data-translate-key="basicInfoSectionTitle">基本資料</h3> <div class="setting-item"> <label for="girlfriend-name-input" data-translate-key="girlfriendNameLabel">女友名稱:</label> <input type="text" id="girlfriend-name-input"> </div> <div class="setting-item"> <label for="user-name-input" data-translate-key="userNameLabel">你的名稱:</label> <input type="text" id="user-name-input"> </div> <div class="setting-item"> <label for="girlfriend-occupation-select" data-translate-key="occupationLabel">女友職業:</label> <select id="girlfriend-occupation-select"></select> </div> <div class="setting-item"> <label for="girlfriend-personality-select" data-translate-key="personalityLabel">女友個性:</label> <select id="girlfriend-personality-select"></select> </div> <div class="setting-item"> <label for="girlfriend-notes-input" data-translate-key="additionalNotesLabel">其他補充:</label> <textarea id="girlfriend-notes-input" rows="3"></textarea> </div> </div> <hr> <div class="settings-section"> <h3 data-translate-key="drawingParamsSectionTitle">繪圖參數</h3> <div class="setting-item"> <label for="drawing-sampler-select" data-translate-key="samplerLabel">繪圖 Sampler:</label> <select id="drawing-sampler-select"> <option value="Euler a">Euler a Simple</option> <option value="Euler">Euler</option> <option value="LMS">LMS</option> <option value="Heun">Heun</option> <option value="DPM2">DPM2</option> <option value="DPM2 a">DPM2 a</option> <option value="DPM++ 2S a">DPM++ 2S a</option> <option value="DPM++ 2M">DPM++ 2M</option> <option value="DPM++ SDE">DPM++ SDE</option> <option value="DPM++ 2M SDE">DPM++ 2M SDE</option> <option value="DPM++ 2M Karras">DPM++ 2M Karras</option><option value="DPM++ 2S a Karras">DPM++ 2S a Karras</option> <option value="DPM++ SDE Karras">DPM++ SDE Karras</option> <option value="DPM++ 2M SDE Karras">DPM++ 2M SDE Karras</option> <option value="DDIM">DDIM</option> <option value="PLMS">PLMS</option> <option value="UniPC">UniPC</option> </select> </div> <div class="setting-item"> <label for="drawing-steps-input" data-translate-key="stepsLabel">繪圖 Steps:</label> <input type="number" id="drawing-steps-input" value="20" min="1" max="150"> </div> <div class="setting-item"> <label for="drawing-custom-prompt-input" data-translate-key="customPromptLabel">繪圖自訂提示詞:</label> <textarea id="drawing-custom-prompt-input" rows="3">Realistic photograph, Movie light, film grain, vivid colors, depth of field, masterpiece, 4k, high quality, </textarea> </div> <div class="setting-item"> <label for="drawing-negative-prompt-input" data-translate-key="negativePromptLabel">繪圖負向提示詞:</label> <textarea id="drawing-negative-prompt-input" rows="3">worst quality,low quality,worst detail,low detail,bad anatomy, bad hands,error,missing fingers,cropped,signature,watermark,username,blurry,</textarea> </div> <div class="setting-item checkbox-item"> <input type="checkbox" id="adetailer-checkbox"> <label for="adetailer-checkbox" data-translate-key="enableAdetailerLabel">啟用 ADetailer (臉部修復)</label> </div> <div id="adetailer-options" style="display: none; padding-left: 20px; border-left: 2px solid #eee; margin-left: 10px;"> <p><small>使用模型: face_yolov8n.pt, Inpaint Denoising: 0.4</small></p> <div class="setting-item"> <label for="adetailer-custom-prompt-input" data-translate-key="adetailerPromptLabel">ADetailer 正向提示詞:</label> <textarea id="adetailer-custom-prompt-input" rows="3">(score_10, score_9_up, score_9, score_8_up, score_7_up, score_6, score_5, score_4, source_anime), masterpiece, 4k, high quality, (best quality:1.1), beautiful detailed face, high details, fine details, </textarea> </div> </div> </div> <button id="save-girlfriend-settings-btn" data-translate-key="saveGirlfriendSettingsBtn">儲存女友設定</button> </div> </div>
    <div id="copyright-modal" class="modal" style="z-index: 1050;"> <div class="modal-content"> <span class="close-btn" data-modal-id="copyright-modal">&times;</span> <h2 data-translate-key="copyrightModalTitle">版權與開發者資訊</h2> <div class="copyright-content"> <h3 data-translate-key="mitLicenseLabel">開源授權 (MIT License):</h3> <p data-translate-key="mitLicenseTextP1">本軟體依據 MIT 授權條款發布。</p> <p data-translate-key="mitLicenseTextP2">被授權人被授予以下權利，且無任何限制：使用、複製、修改、合併、發布、散佈、再授權及/或銷售本軟體的副本，並允許獲得本軟體的人士進行上述操作，但須滿足以下條件：</p> <p data-translate-key="mitLicenseTextP3">上述版權聲明和本許可聲明應包含在本軟體的所有副本或主要部分中。</p> <p data-translate-key="mitLicenseTextP4">本軟體以「原樣」提供，不作任何明示或暗示的保證...</p> <hr style="margin: 15px 0;"> <h3 data-translate-key="developersLabel">開發者:</h3> <p data-translate-key="developerNames">Sinsin Wang, Marco Chen, Ethan Chen</p> <p><small>Current Date/Time: <span id="current-date-time"></span></small></p> </div> </div> </div>
    <div id="gift-modal" class="modal" style="z-index: 1050;"> <div class="modal-content large"> <span class="close-btn" data-modal-id="gift-modal">&times;</span> <h2 data-translate-key="giftModalTitle">選擇禮物</h2> <div id="gift-list-container" class="gift-list-grid"></div> </div> </div>

    <div id="loading-overlay" class="loading-overlay" style="display: none;"> <div class="loading-spinner"></div> <p id="loading-text">Loading...</p> </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"></script>
    <script src="MYGFjs.js"></script>
</body>
</html>