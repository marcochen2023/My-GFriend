// MYGFjs.js - Complete Final Version (v8 - Fixing JS Response Handling for Avatar Status/List)
// --- Global Variables & Constants ---
const API_ENDPOINT = 'funMYGF.php';
const ACTION_COOLDOWN = 6000;
const MAX_HISTORY_CONTEXT = 10;
let currentLanguage = 'zh-TW';
let languagePacks = {};
let appSettings = { llmModels: [], imageModels: [], selectedLlmModelId: null, selectedImageModelId: null };
let girlfriendSettings = { favorability: 0, currentAvatar: null };
let chatHistory = [];
let activeFrequencyInterval = null;
let isSending = false;
let cropperInstance = null;
let actionButtons = []; // Define globally

// --- DOM Element References (Declared globally, assigned after DOM load) ---
let chatInterface, messageInput, sendButton, selfieBtn, callGirlfriendBtn, languageSwitcher,
    loadingOverlay, loadingText, favorabilityBar, favorabilityValue, llmModelSelect,
    imageModelSelect, settingsModal, girlfriendSettingsModal, avatarModal, giftModal,
    closeButtons, settingsBtn, girlfriendSettingsBtn, giftBtn, copyrightBtn,
    girlfriendNameInput, userNameInput, girlfriendOccupationSelect, girlfriendPersonalitySelect,
    girlfriendNotesInput, drawingSamplerSelect, drawingStepsInput, drawingCustomPromptInput,
    drawingNegativePromptInput, adetailerCheckbox, adetailerOptions, adetailerCustomPromptInput,
    saveAppSettingsBtn, saveGirlfriendSettingsBtn, activeFrequencySelect, girlfriendNameDisplays,
    avatarModalTitle, existingAvatarsContainer, uploadAvatarBtn, avatarUploadInput,
    avatarCropperContainer, confirmCropBtn, changeAvatarOptionsDiv, giftListContainer,
    copyrightModal, currentDateTimeSpan;

// --- DOM Element References Helper ---
const getElement = (id) => document.getElementById(id);

// --- Helper Functions ---
async function fetchData(action, data = {}, method = 'POST') { const url = `${API_ENDPOINT}?action=${action}`; const options = { method: method, headers: {} }; if (method === 'POST' || method === 'PUT' || method === 'PATCH') { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(data); } try { const response = await fetch(url, options); const responseText = await response.text(); if (!response.ok) { console.error(`HTTP error! Status: ${response.status}, Action: ${action}, Details: ${responseText}`); let errorMsg = `HTTP error ${response.status} for action ${action}`; try { const errorJson = JSON.parse(responseText); errorMsg = errorJson.message || errorMsg; } catch (e) {} throw new Error(errorMsg); } try { return JSON.parse(responseText); } catch (e) { console.warn(`Received non-JSON response for action: ${action}`, responseText); return responseText; } } catch (error) { console.error(`Workspace error for action ${action}:`, error); if (typeof translate === 'function') { alert(translate('errorTitle') + ': ' + (error.message || translate('fetchError'))); } else { alert('Error: ' + (error.message || 'Request failed')); } throw error; } }
function showLoading(messageKey = 'loadingText') { if(loadingOverlay && loadingText) { loadingText.textContent = translate(messageKey) || 'Loading...'; loadingOverlay.style.display = 'flex'; } }
function hideLoading() { if(loadingOverlay) loadingOverlay.style.display = 'none'; }
function showModal(modalId) { const modal = getElement(modalId); if (modal) { modal.style.display = 'block'; if (modalId === 'gift-modal') populateGiftModal(); else if (modalId === 'avatar-modal') loadExistingAvatars(); else if (modalId === 'copyright-modal') updateCopyrightTime(); } else console.error(`Modal with ID ${modalId} not found.`); }
function hideModal(modalId) { const modal = getElement(modalId); if (modal) { modal.style.display = 'none'; if (modalId === 'avatar-modal') { if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; } if(avatarCropperContainer) { avatarCropperContainer.style.display = 'none'; avatarCropperContainer.innerHTML = ''; } if(confirmCropBtn) confirmCropBtn.style.display = 'none'; } } }
function translate(key, replacements = {}) { let text = languagePacks[currentLanguage]?.[key] || key; for (const placeholder in replacements) { text = text.replace(`{${placeholder}}`, replacements[placeholder]); } return text; }
function translateUI() { document.querySelectorAll('[data-translate-key]').forEach(el => { const key = el.getAttribute('data-translate-key'); const translation = translate(key); const isButtonOrInput = el.tagName === 'INPUT' || el.tagName === 'BUTTON'; if (el.hasAttribute('title')) { el.title = translation; } if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { if (el.type === 'button' || el.type === 'submit' || el.type === 'reset') el.value = translation; else if (el.placeholder !== undefined) el.placeholder = translation; } else if (el.tagName === 'BUTTON' && !el.innerHTML.match(/<img|<svg/i) && !el.classList.contains('send-button') && !el.classList.contains('icon-button')) { el.textContent = translation; } else if (el.tagName === 'OPTION' && el.dataset.translateKey) { el.textContent = translation; } else if (!isButtonOrInput && !el.innerHTML.match(/<img|<svg/i)) { if (el.children.length === 0 || el.textContent.trim() === el.innerHTML.trim()) el.textContent = translation; } }); document.title = translate('appTitle'); if(girlfriendNameInput) girlfriendNameInput.placeholder = translate('defaultGirlfriendName'); if(userNameInput) userNameInput.placeholder = translate('defaultUserName'); if (girlfriendSettings.occupations && girlfriendOccupationSelect) populateDropdown(girlfriendOccupationSelect, girlfriendSettings.occupations, 'occupation'); if (girlfriendSettings.personalities && girlfriendPersonalitySelect) populateDropdown(girlfriendPersonalitySelect, girlfriendSettings.personalities, 'personality'); if (giftModal && giftModal.style.display === 'block') populateGiftModal(); }

// --- Language Handling ---
async function loadLanguagePacks() { try { const response = await fetch('languagepacks.json'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); languagePacks = await response.json(); console.log("Lang packs loaded."); } catch (error) { console.error('Failed load lang packs:', error); alert('Could not load lang settings.'); } }
function setLanguage(lang) { if (languagePacks[lang]) { currentLanguage = lang; localStorage.setItem('preferredLanguage', lang); if(languageSwitcher) languageSwitcher.value = lang; translateUI(); console.log(`Lang changed: ${currentLanguage}`); } else console.warn(`Lang pack "${lang}" not found.`); }

// --- Settings & Data Loading ---
async function loadAppSettings() { try { const response = await fetchData('getAppSettings', {}, 'GET'); console.log("Raw App Settings Resp:", response); if (response?.status === 'success' && response.data && Array.isArray(response.data.llmModels) && Array.isArray(response.data.imageModels)) { const data = response.data; appSettings.llmModels = data.llmModels; appSettings.imageModels = data.imageModels; appSettings.selectedLlmModelId = data.selectedLlmModelId || (data.llmModels[0]?.id); appSettings.selectedImageModelId = data.selectedImageModelId || (data.imageModels[0]?.id); if(llmModelSelect) populateDropdown(llmModelSelect, appSettings.llmModels, 'llm'); if(imageModelSelect) populateDropdown(imageModelSelect, appSettings.imageModels, 'image'); if (appSettings.selectedLlmModelId && llmModelSelect) llmModelSelect.value = appSettings.selectedLlmModelId; if (appSettings.selectedImageModelId && imageModelSelect) imageModelSelect.value = appSettings.selectedImageModelId; console.log("App settings loaded:", appSettings); } else { console.error("Failed load valid app settings.", response); alert(translate('configLoadError')); } } catch (error) { console.error('Failed load app settings:', error); } }
async function loadGirlfriendSettings() { try { const response = await fetchData('getGirlfriendSettings', {}, 'GET'); console.log('Loading settings response:', response); if (response?.status === 'success' && response.data) { const settings = response.data; Object.assign(girlfriendSettings, settings); if(girlfriendNameInput) girlfriendNameInput.value = settings.name || translate('defaultGirlfriendName'); if(userNameInput) userNameInput.value = settings.userName || translate('defaultUserName'); if(girlfriendNotesInput) girlfriendNotesInput.value = settings.notes || ''; if(drawingStepsInput) drawingStepsInput.value = settings.drawingSteps || 20; if(drawingSamplerSelect) drawingSamplerSelect.value = settings.drawingSampler || 'Euler a'; if(drawingCustomPromptInput) drawingCustomPromptInput.value = settings.drawingCustomPrompt || '...'; if(drawingNegativePromptInput) drawingNegativePromptInput.value = settings.drawingNegativePrompt || '...'; if(adetailerCheckbox) adetailerCheckbox.checked = settings.adetailerEnabled || false; if(adetailerCustomPromptInput) adetailerCustomPromptInput.value = settings.adetailerPrompt || '...'; if(adetailerOptions) adetailerOptions.style.display = adetailerCheckbox.checked ? 'block' : 'none'; if(activeFrequencySelect) activeFrequencySelect.value = settings.activeFrequency || '0'; updateFavorability(settings.favorability !== undefined ? settings.favorability : 0); if(girlfriendOccupationSelect) populateDropdown(girlfriendOccupationSelect, settings.occupations || [], 'occupation'); if(girlfriendPersonalitySelect) populateDropdown(girlfriendPersonalitySelect, settings.personalities || [], 'personality'); if (settings.occupationId && girlfriendOccupationSelect) { if ([...girlfriendOccupationSelect.options].some(opt => opt.value === settings.occupationId)) { console.log('Setting occupation:', settings.occupationId); girlfriendOccupationSelect.value = settings.occupationId; console.log('Occ AFTER set:', girlfriendOccupationSelect.value); } else { console.warn(`Saved occ ID "${settings.occupationId}" not found.`); girlfriendOccupationSelect.selectedIndex = 0; } } else if(girlfriendOccupationSelect) { girlfriendOccupationSelect.selectedIndex = 0; } if (settings.personalityId && girlfriendPersonalitySelect) { if ([...girlfriendPersonalitySelect.options].some(opt => opt.value === settings.personalityId)) { console.log('Setting personality:', settings.personalityId); girlfriendPersonalitySelect.value = settings.personalityId; console.log('Pers AFTER set:', girlfriendPersonalitySelect.value); } else { console.warn(`Saved pers ID "${settings.personalityId}" not found.`); girlfriendPersonalitySelect.selectedIndex = 0; } } else if(girlfriendPersonalitySelect) { girlfriendPersonalitySelect.selectedIndex = 0; } if (settings.language && settings.language !== currentLanguage) setLanguage(settings.language); setupActiveFrequency(); updateCurrentAvatar(settings.currentAvatar); console.log("GF settings processed:", girlfriendSettings); } else { console.error("Failed load valid GF settings.", response); alert(translate('configLoadError')); } } catch (error) { console.error('Failed load GF settings:', error); } }
function populateDropdown(selectElement, optionsArray, type) { if (!selectElement || !Array.isArray(optionsArray)) { console.error("Invalid args populateDropdown", type, selectElement, optionsArray); return; } const currentValue = selectElement.value; selectElement.innerHTML = ''; optionsArray.forEach(option => { const opt = document.createElement('option'); opt.value = option.id; if (type === 'llm' || type === 'image') opt.textContent = option.displayName || option.name || option.id; else if (type === 'occupation' || type === 'personality') { opt.textContent = option.name?.[currentLanguage] || option.name?.['en'] || option.id; opt.dataset.translateBase = option.id; } else opt.textContent = option.name || option.id; selectElement.appendChild(opt); }); if ([...selectElement.options].some(opt => opt.value === currentValue)) selectElement.value = currentValue; else if (selectElement.options.length > 0) {} }
function updateCurrentAvatar(avatarPath) { const defaultAvatar = 'image/avatar/default_avatar.png'; let finalPath = avatarPath || defaultAvatar; if (typeof finalPath !== 'string' || !finalPath.includes('/') || !finalPath.includes('.')) finalPath = defaultAvatar; const cacheBuster = (finalPath !== defaultAvatar) ? `?t=${new Date().getTime()}` : ''; const displayUrl = finalPath + cacheBuster; document.querySelectorAll('.message-avatar').forEach(img => { if(img) { img.src = displayUrl; img.onerror = () => { img.src = defaultAvatar; }; } }); const logo = document.querySelector('.logo'); if (logo) { logo.src = displayUrl; logo.onerror = () => { logo.src = defaultAvatar; }; } if(finalPath !== defaultAvatar || avatarPath === null) girlfriendSettings.currentAvatar = avatarPath; console.log(`Avatar updated display: ${displayUrl} (Internal: ${girlfriendSettings.currentAvatar})`); }

// --- Chat Interface Logic ---
function scrollToBottom() { setTimeout(() => { if(chatInterface) chatInterface.scrollTop = chatInterface.scrollHeight; }, 50); }
function resizeTextarea() { if(!messageInput) return; messageInput.style.height = 'auto'; const mh = 100; const nh = Math.min(messageInput.scrollHeight, mh); messageInput.style.height = nh + 'px'; }
function displayMessage(sender, message, timestamp, imageUrl = null, messageId, actions = [], metadata = null) { if(!chatInterface) return; const mc = document.createElement('div'); mc.classList.add('message-container', sender === 'user' ? 'user-message' : (sender === 'system' ? 'system-message' : 'girlfriend-message')); if (messageId) mc.dataset.messageId = messageId; const mb = document.createElement('div'); mb.classList.add('message-bubble'); if(sender === 'system') mb.classList.add('system-bubble'); let html = ''; if (imageUrl) html += `<img src="${imageUrl}?t=${new Date().getTime()}" class="chat-image" alt="Chat Image" loading="lazy">`; if (message) { const sm = message.replace(/</g, "&lt;").replace(/>/g, "&gt;"); html += `<p>${sm.replace(/\n/g, '<br>')}</p>`; } let ft = ''; if (timestamp) { try { ft = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); } catch(e) { ft = timestamp; } html += `<span class="message-timestamp">${ft}</span>`; } mb.innerHTML = html; if (messageId && !messageId.startsWith('temp_') && !messageId.startsWith('error_') && sender !== 'system') { const db = document.createElement('button'); db.classList.add('delete-message-btn'); db.innerHTML = '🗑️'; db.title = translate('deleteBtn'); mb.appendChild(db); } if (sender === 'girlfriend') { const ai = document.createElement('img'); ai.src = (girlfriendSettings.currentAvatar || 'image/avatar/default_avatar.png') + `?t=${new Date().getTime()}`; ai.alt = 'GF Avatar'; ai.classList.add('message-avatar', 'girlfriend-avatar-clickable'); ai.onerror = () => { ai.src = 'image/avatar/default_avatar.png'; }; const mcDiv = document.createElement('div'); mcDiv.classList.add('message-content'); const ns = document.createElement('span'); ns.classList.add('girlfriend-name'); ns.textContent = girlfriendSettings?.name || translate('defaultGirlfriendName'); mcDiv.appendChild(ns); mcDiv.appendChild(mb); if (actions && actions.length > 0) { console.log("Displaying message with actions:", actions); const ac = document.createElement('div'); ac.classList.add('action-buttons-container'); actions.forEach((at) => { const ab = document.createElement('button'); ab.classList.add('action-button'); ab.textContent = at; ab.dataset.actionText = at; if (messageId) ab.dataset.actionOriginMessageId = messageId; ac.appendChild(ab); }); mcDiv.appendChild(ac); } if (metadata) { const mdc = document.createElement('div'); mdc.classList.add('message-metadata'); mdc.style.display = 'none'; mdc.innerHTML = `<span>人:${metadata.who||'N/A'}</span><span>事:${metadata.what||'N/A'}</span><span>時:${metadata.when||'N/A'}</span><span>地:${metadata.where||'N/A'}</span><span>心:${metadata.mood||'N/A'}</span>`; mcDiv.appendChild(mdc); } mc.appendChild(ai); mc.appendChild(mcDiv); } else mc.appendChild(mb); chatInterface.appendChild(mc); scrollToBottom(); }
/** Loads chat history. */
async function loadChatHistory() {
    console.log("Loading chat history...");
    if(!chatInterface) return;
    try {
        const response = await fetchData('getChatHistory', {}, 'GET'); // Expects {status:'success', data:[...]}
        console.log('Received history response:', response); // Log the entire response object
        chatInterface.innerHTML = ''; // Clear current chat
        chatHistory = []; // Reset internal history

        // ** FIXED: Check response status and access response.data **
        if (response && response.status === 'success' && Array.isArray(response.data)) {
            const historyData = response.data; // Get the array from 'data'
            historyData.forEach(msg => {
                // Add to internal state
                chatHistory.push({
                    id: msg.id, sender: msg.sender, text: msg.text,
                    imageUrl: msg.imageUrl, timestamp: msg.timestamp,
                    actions: msg.actions, metadata: msg.metadata
                });
                // Display message
                displayMessage(
                    msg.sender, msg.text, msg.timestamp,
                    msg.imageUrl, msg.id, msg.actions, msg.metadata
                );
            });
            console.log(`Loaded ${historyData.length} messages.`);
        } else {
            console.log("No chat history found or invalid format in response.data.");
            if (response && response.status === 'error' && response.message) {
                displayMessage('system', `${translate('errorTitle')}: ${response.message}`, new Date().toISOString(), null, `error_${Date.now()}`);
            }
        }
        scrollToBottom();
    } catch (error) {
        console.error('Failed load chat history:', error);
        displayMessage('system', translate('chatLoadError'), new Date().toISOString(), null, `error_${Date.now()}`);
    }
}


// --- Button Cooldown Logic ---
// Array defined globally, populated in initializeApp
/** Disables action buttons for a duration. */
function disableActionButtons(duration = ACTION_COOLDOWN) { if (actionButtons.length === 0) { console.warn("Action buttons not init for cooldown."); return; } actionButtons.forEach(btn => { if (btn) btn.disabled = true; }); console.log(`Action buttons disabled for ${duration / 1000}s.`); setTimeout(() => { actionButtons.forEach(btn => { if (btn) btn.disabled = false; }); console.log("Action buttons re-enabled."); const sendBtn = getElement('send-button'); const selfieBtn = getElement('selfie-btn'); if(sendBtn?.innerHTML === '...') sendBtn.innerHTML = '➤'; if(selfieBtn?.innerHTML === '...') selfieBtn.innerHTML = '📸'; }, duration); }

/** Sends a message or action. */
async function sendMessage(messageText = null, isAction = false, originatingMessageId = null) {
    // --- Function Start & Input Validation (No Change) ---
    const mi = getElement('message-input');
    const sb = getElement('send-button');
    const sfb = getElement('selfie-btn');
    if (isSending || !mi || !sb || !sfb) return;
    const textToSend = messageText !== null ? messageText : mi.value.trim();
    if (!textToSend) return;

    isSending = true;
    sb.disabled = true; // Disable buttons during processing
    sfb.disabled = true;
    // sb.innerHTML = '...'; // Optionally indicate loading state on button

    let userMessageId = `temp_${Date.now()}`;
    let userMessageTimestamp = new Date();

    if (!isAction) {
        displayMessage('user', textToSend, userMessageTimestamp, null, userMessageId);
        chatHistory.push({ id: userMessageId, sender: 'user', text: textToSend, imageUrl: null, timestamp: userMessageTimestamp.toISOString() });
        mi.value = '';
        resizeTextarea();
    } else {
        const ac = originatingMessageId ? document.querySelector(`.action-buttons-container[data-action-origin-message-id="${originatingMessageId}"]`) : null;
        if (ac) ac.remove();
        chatHistory.push({ id: userMessageId, sender: 'user', text: `[Action: ${textToSend}]`, imageUrl: null, timestamp: userMessageTimestamp.toISOString() });
    }

    const historyCtx = chatHistory.slice(-MAX_HISTORY_CONTEXT).map(m => ({ sender: m.sender, text: m.text, imageUrl: m.imageUrl }));
    const payload = {
        message: textToSend, history: historyCtx, isAction: isAction,
        girlfriendSettings: { name: girlfriendSettings.name || '', userName: girlfriendSettings.userName || '', occupationId: girlfriendSettings.occupationId, personalityId: girlfriendSettings.personalityId, notes: girlfriendSettings.notes, language: currentLanguage },
        llmModelId: appSettings.selectedLlmModelId, currentFavorability: girlfriendSettings.favorability ?? 0
    };

    showLoading('sendingText');

    try {
        const response = await fetchData('sendMessage', payload, 'POST'); // Expects {status:'success', data:{...}}
        console.log("Received sendMessage response:", response); // Log the raw response

        // *** === 修改開始 === ***
        // ** 檢查 response.status 且 response.data 是否存在 **
        if (response && response.status === 'success' && response.data) {
            const responseData = response.data; // ** 從 data 屬性獲取實際內容 **

            // 更新 user message ID (使用 responseData)
            const ci = getElement('chat-interface');
            const uMel = ci?.querySelector(`[data-message-id="${userMessageId}"]`);
            if (uMel && responseData.userMessageId) { // ** 使用 responseData.userMessageId **
                uMel.dataset.messageId = responseData.userMessageId;
                const uIdx = chatHistory.findIndex(m => m.id === userMessageId);
                if (uIdx !== -1) chatHistory[uIdx].id = responseData.userMessageId;
            }

            // 顯示女友訊息 (使用 responseData)
            displayMessage(
                'girlfriend',
                responseData.girlfriendMessage, // ** 使用 responseData.girlfriendMessage **
                responseData.timestamp,       // ** 使用 responseData.timestamp **
                responseData.imageUrl,        // ** 使用 responseData.imageUrl **
                responseData.messageId,       // ** 使用 responseData.messageId **
                responseData.actions,         // ** 使用 responseData.actions **
                responseData.metadata         // ** 使用 responseData.metadata **
            );

            // 添加到歷史記錄 (使用 responseData)
            chatHistory.push({
                id: responseData.messageId,
                sender: 'girlfriend',
                text: responseData.girlfriendMessage,
                imageUrl: responseData.imageUrl,
                timestamp: responseData.timestamp,
                actions: responseData.actions,
                metadata: responseData.metadata
            });

            // 更新好感度 (使用 responseData)
            if (responseData.newFavorability !== undefined) {
                updateFavorability(responseData.newFavorability); // ** 使用 responseData.newFavorability **
            }
        // *** === 修改結束 === ***
        } else {
            // Handle error or unexpected structure
            console.error("sendMessage failed or returned unexpected structure:", response);
            displayMessage('system', `${translate('errorTitle')}: ${response?.message || translate('messageSendFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
        }
    } catch (error) {
        // Error display already handled by fetchData's catch block, but maybe add specific context
        console.error("Error during sendMessage fetch/processing:", error);
        // Optionally display another message if needed, but likely redundant
        // displayMessage('system', `${translate('errorTitle')}: ${error.message || translate('messageSendFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
    } finally {
        hideLoading();
        isSending = false;
        disableActionButtons(); // Apply cooldown AFTER request finishes
    }
}
/** Handles action button clicks. */
function handleActionButtonClick(event) { if (event.target.classList.contains('action-button')) { const at = event.target.dataset.actionText; const omid = event.target.dataset.actionOriginMessageId; sendMessage(at, true, omid); } }
/** Deletes a message. */
async function deleteMessage(messageId) { const ci = getElement('chat-interface'); if (!ci) return; if (!messageId || messageId.startsWith('temp_') || messageId.startsWith('error_')) { const etr = ci.querySelector(`[data-message-id="${messageId}"]`); if (etr) etr.remove(); chatHistory = chatHistory.filter(m => m.id !== messageId); return; } if (confirm(translate('confirmDeleteMessage'))) { showLoading('deletingText'); try { const response = await fetchData('deleteMessage', { id: messageId }, 'POST'); if (response && response.status === 'success') { const mel = ci.querySelector(`[data-message-id="${messageId}"]`); if (mel) mel.remove(); chatHistory = chatHistory.filter(m => m.id !== messageId); } else alert(`${translate('errorTitle')}: ${response?.message || translate('actionFailed')}`); } catch (error) { } finally { hideLoading(); } } }

// --- Image Generation ---
/** Handles the "Selfie" button click. */
async function requestSelfie() {
    const sfb = getElement('selfie-btn');
    const sb = getElement('send-button');
    const mi = getElement('message-input');
    if (isSending || !sfb || !sb || !mi) return;
    const userGuidanceText = mi.value.trim();
    console.log("Req selfie..." + (userGuidanceText ? ` with guidance: "${userGuidanceText}"` : ""));
    isSending = true;
    sfb.disabled = true;
    // sb.innerHTML = '...'; // 改為在 disableActionButtons 中處理 ICON
    sb.disabled = true;
    showLoading('generatingText');
    if(userGuidanceText){
        mi.value = '';
        resizeTextarea();
    }
    const historyCtx = chatHistory.slice(-MAX_HISTORY_CONTEXT).map(m => ({ sender: m.sender, text: m.text, imageUrl: m.imageUrl }));
    const payload = {
        purpose: 'chat_selfie', history: historyCtx, user_guidance: userGuidanceText,
        girlfriendSettings: { name: girlfriendSettings.name || '', userName: girlfriendSettings.userName || '', occupationId: girlfriendSettings.occupationId, personalityId: girlfriendSettings.personalityId, notes: girlfriendSettings.notes, language: currentLanguage, drawingSampler: girlfriendSettings.drawingSampler, drawingSteps: girlfriendSettings.drawingSteps, drawingCustomPrompt: girlfriendSettings.drawingCustomPrompt, drawingNegativePrompt: girlfriendSettings.drawingNegativePrompt, adetailerEnabled: girlfriendSettings.adetailerEnabled, adetailerPrompt: girlfriendSettings.adetailerPrompt, currentAvatar: girlfriendSettings.currentAvatar },
        imageModelId: appSettings.selectedImageModelId, llmModelId: appSettings.selectedLlmModelId
    };
    console.log("Sending selfie req payload:", payload);
    try {
        console.log("Attempting fetchData for generateChatImage..."); // Log before fetch
        const response = await fetchData('generateChatImage', payload, 'POST');
        console.log("Received generateChatImage response:", response); // Log successful response

        if (response && response.status === 'success' && response.data) { // ** 修正: 檢查 response.data **
             const responseData = response.data; // ** 獲取 data **
             const uid = `temp_selfie_${Date.now()}`;
             const ts = new Date();
             // 記錄用戶請求 (即使後端可能已記錄，前端也記錄一份)
             chatHistory.push({ id: responseData.userMessageId || uid, sender: 'user', text: `[Requested Selfie]${userGuidanceText ? ': '+userGuidanceText : ''}`, imageUrl: null, timestamp: ts.toISOString() });
             // 顯示女友回覆
             displayMessage('girlfriend', responseData.girlfriendMessage || '', responseData.timestamp, responseData.imageUrl, responseData.messageId, responseData.actions, responseData.metadata);
             chatHistory.push({ id: responseData.messageId, sender: 'girlfriend', text: responseData.girlfriendMessage || '', imageUrl: responseData.imageUrl, timestamp: responseData.timestamp, actions: responseData.actions, metadata: responseData.metadata });
             if (responseData.newFavorability !== undefined) {
                updateFavorability(responseData.newFavorability);
             }
             console.log("Successfully processed generateChatImage response.");
        } else {
            // 後端返回了非 success 狀態或無效數據
            console.error("generateChatImage backend returned non-success status or invalid data:", response);
            displayMessage('system', `${translate('errorTitle')}: ${response?.message || translate('imageGenerationFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
        }
    } catch (error) {
        // fetchData 拋出的錯誤 (已包含 alert)
         console.error(">>> Error caught inside requestSelfie catch block:", error); // ** Log the caught error OBJECT **
         // 可以在這裡再顯示一次聊天內的錯誤訊息，如果 alert 不夠的話
         displayMessage('system', `${translate('errorTitle')}: ${error.message || translate('imageGenerationFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
    } finally {
         hideLoading();
         isSending = false;
         disableActionButtons(); // Cooldown after request attempt
         console.log("requestSelfie finally block executed.");
    }
}
// --- Image History Removed ---

// --- Avatar Management ---
/** Checks avatar status on load. */
async function checkAvatarStatus() { console.log("Checking avatar status..."); try { const response = await fetchData('checkAvatarStatus', {}, 'GET'); console.log("Received checkAvatarStatus response:", response); if (response?.status === 'success' && typeof response.data === 'object') { const statusData = response.data; console.log("Parsed statusData:", statusData); const amt = getElement('avatar-modal-title'); const eac = getElement('existing-avatars'); const cao = getElement('change-avatar-options'); if (!statusData.exists || !statusData.hasAvatar) { console.log("Condition triggering alert met: !exists or !hasAvatar"); alert(translate('avatarFolderMissing')); if(amt) amt.textContent = translate('avatarModalTitleCreate'); if(eac) eac.style.display = 'none'; if(cao) cao.style.display = 'block'; showModal('avatar-modal'); } else if (statusData.currentAvatar) { console.log("Condition for setting current avatar met."); updateCurrentAvatar(statusData.currentAvatar); } else { console.log("Condition for using default avatar met."); updateCurrentAvatar(null); } } else { console.error("checkAvatarStatus received invalid response structure:", response); alert(translate('avatarCheckError')); } } catch (error) { console.error("Error during checkAvatarStatus fetch:", error); } }
/** Loads existing avatar thumbnails. */
async function loadExistingAvatars() {
    const eac = getElement('existing-avatars');
    if (!eac) return;
    eac.innerHTML = `<small>${translate('loadingText')}</small>`;
    eac.style.display = 'flex'; // Ensure container is visible
    try {
        const response = await fetchData('getAvatars', {}, 'GET'); // Expects {status:'success', data:[...]}
        console.log("Received getAvatars response:", response); // Log response
        let avatarUrls = [];
        // ** FIXED: Check response status and access response.data **
        if (response && response.status === 'success' && Array.isArray(response.data)) {
            avatarUrls = response.data;
        } else {
            console.error("Invalid response structure from getAvatars:", response);
        }

        eac.innerHTML = ''; // Clear loading/previous content **before** loop

        if (avatarUrls.length > 0) {
            console.log(`Avatar URLs found (${avatarUrls.length}), attempting display thumbnails.`); // Log count
            avatarUrls.forEach(avatarUrl => {
                const thumb = document.createElement('img');
                thumb.src = avatarUrl + `?t=${new Date().getTime()}`; // Add cache buster
                thumb.alt = 'Avatar Thumbnail';
                thumb.classList.add('avatar-thumbnail');
                thumb.dataset.path = avatarUrl; // Store path for click handler
                thumb.loading = 'lazy';
                thumb.onerror = () => {
                    thumb.alt = 'Load Fail';
                    thumb.style.border = '1px solid red';
                };
                // Highlight currently selected avatar based on internal state
                if (girlfriendSettings.currentAvatar && avatarUrl.includes(girlfriendSettings.currentAvatar.split('?')[0])) {
                    thumb.classList.add('selected');
                }
                eac.appendChild(thumb);
                console.log('Appended thumb:', avatarUrl); // Log each append
            });
            // Log final HTML content of the container
            // console.log('Finished appending thumbnails. Container innerHTML:', eac.innerHTML);
        } else {
            console.log("avatarUrls array is empty, displaying 'No existing avatars'.");
            eac.innerHTML = `<small>No existing avatars.</small>`; // Display message if no avatars found
        }
    } catch (error) {
        console.error("Failed load existing avatars:", error);
        if (eac) eac.innerHTML = `<small>${translate('errorTitle')}: ${translate('fetchError')}</small>`; // Show fetch error
    }
}
/** Handles clicking existing avatar thumbnail. */
async function handleAvatarThumbnailClick(event) { const target = event.target; if (target.classList.contains('avatar-thumbnail') && target.dataset.path) { const selectedPath = target.dataset.path; console.log("Thumb clicked, attempting set path:", selectedPath); document.querySelectorAll('.avatar-thumbnail.selected').forEach(el => el.classList.remove('selected')); target.classList.add('selected'); updateCurrentAvatar(selectedPath); showLoading('savingText'); try { const response = await fetchData('setCurrentAvatar', { avatarPath: selectedPath }, 'POST'); if (response?.status === 'success') { girlfriendSettings.currentAvatar = response.newAvatarPath || selectedPath; updateCurrentAvatar(girlfriendSettings.currentAvatar); console.log("Current avatar set success:", girlfriendSettings.currentAvatar); } else { target.classList.remove('selected'); updateCurrentAvatar(girlfriendSettings.currentAvatar); alert(`${translate('errorTitle')}: ${response?.message || translate('avatarSetFailed')}`); } } catch (error) { target.classList.remove('selected'); updateCurrentAvatar(girlfriendSettings.currentAvatar); } finally { hideLoading(); } } }
/** Initializes Cropper.js. */
function setupAvatarCropper(imageUrl) { const acc = getElement('avatar-cropper-container'); const ccb = getElement('confirm-crop-btn'); if(!acc || !ccb) return; acc.innerHTML = `<img id="avatar-crop-image-preview" src="${imageUrl}" alt="Crop Preview">`; const image = getElement('avatar-crop-image-preview'); if (cropperInstance) cropperInstance.destroy(); cropperInstance = new Cropper(image, { aspectRatio: 1 / 1, viewMode: 1, dragMode: 'move', background: false, cropBoxResizable: true, minCropBoxWidth: 128, minCropBoxHeight: 128 }); acc.style.display = 'block'; ccb.style.display = 'inline-block'; }
/** Handles avatar file selection. */
function handleAvatarUpload(event) { const aui = getElement('avatar-upload-input'); const file = event.target.files ? event.target.files[0] : null; if (!file || !file.type.startsWith('image/')) { alert("Select valid image."); return; } const reader = new FileReader(); reader.onload = (e) => setupAvatarCropper(e.target.result); reader.onerror = (e) => { console.error("FileReader error:", e); alert("Failed read file."); }; reader.readAsDataURL(file); if(aui) aui.value = ''; }
/** Confirms crop and uploads avatar. */
async function confirmAvatarCropAndUpload() {
    const ccb = getElement('confirm-crop-btn');
    const acc = getElement('avatar-cropper-container');
    if (!cropperInstance || !ccb) {
        alert("Cropper not ready.");
        return;
    }
    const croppedImageDataUrl = cropperInstance.getCroppedCanvas({
        width: 512, height: 512, fillColor: '#fff', imageSmoothingEnabled: true, imageSmoothingQuality: 'high'
    }).toDataURL('image/jpeg', 0.92);

    showLoading('uploadingText');
    ccb.disabled = true;
    let uploadSuccess = false;
    let newAvatarRelativePath = null;

    try {
        // Step 1: Upload the image data
        const response = await fetchData('uploadAvatar', { imageDataUrl: croppedImageDataUrl }, 'POST');
        console.log("Received uploadAvatar response:", response);

        if (response?.status === 'success' && response.data?.avatarUrl) { // ** 修正: 檢查 response.data.avatarUrl **
            uploadSuccess = true;
            newAvatarRelativePath = response.data.avatarUrl; // ** 從 data 獲取 **
            console.log("Upload success, attempting to set:", newAvatarRelativePath);

            // Step 2: Attempt to set the newly uploaded avatar as current
            try {
                console.log("Calling setCurrentAvatar with path:", newAvatarRelativePath);
                const setResponse = await fetchData('setCurrentAvatar', { avatarPath: newAvatarRelativePath }, 'POST');
                console.log("Received setCurrentAvatar response:", setResponse);

                if (setResponse?.status === 'success') {
                    // Set & Save successful
                    girlfriendSettings.currentAvatar = setResponse.newAvatarPath || newAvatarRelativePath;
                    updateCurrentAvatar(girlfriendSettings.currentAvatar); // Update with confirmed path
                    alert(translate('avatarUploadedSuccess'));
                } else {
                    // Set failed, but upload succeeded. Update UI optimistically but warn user.
                    console.warn("setCurrentAvatar failed after upload:", setResponse);
                    girlfriendSettings.currentAvatar = newAvatarRelativePath; // Update internal state optimistically
                    updateCurrentAvatar(newAvatarRelativePath); // Update display optimistically
                    alert(`${translate('avatarUploadedSuccess')} (${translate('avatarSetFailed')}: ${setResponse?.message})`); // Indicate success + set failed
                }
            } catch (setErr) {
                // Fetch error during setCurrentAvatar
                console.error("Error calling setCurrentAvatar after upload:", setErr);
                girlfriendSettings.currentAvatar = newAvatarRelativePath; // Update internal state optimistically
                updateCurrentAvatar(newAvatarRelativePath); // Update display optimistically
                alert(`${translate('avatarUploadedSuccess')} (${translate('avatarSetFailed')})`); // Indicate success + set failed generic
            }

            // Clean up cropper UI only if upload was successful
            if(acc) acc.style.display = 'none'; if(acc) acc.innerHTML = '';
            if(ccb) ccb.style.display = 'none';
            if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }

            // Refresh the thumbnail list regardless of set success (since upload worked)
            await loadExistingAvatars();

        } else {
            // uploadAvatar itself failed
            alert(`${translate('errorTitle')}: ${response?.message || translate('avatarNotUploaded')}`);
        }
    } catch (uploadErr) {
        // Error during the fetch call to uploadAvatar
        console.error("Upload error:", uploadErr);
        // Alert handled by fetchData
    } finally {
        hideLoading();
        if(ccb) ccb.disabled = false;
    }
}


// --- Settings Management ---
/** Saves application settings. */
async function saveAppSettings() { const llmSelect = getElement('llm-model-select'); const imgSelect = getElement('image-model-select'); const saveBtn = getElement('save-app-settings-btn'); if(!llmSelect || !imgSelect || !saveBtn) return; const payload = { selectedLlmModelId: llmSelect.value, selectedImageModelId: imgSelect.value }; showLoading('savingText'); saveBtn.disabled = true; try { const response = await fetchData('saveAppSettings', payload, 'POST'); if (response?.status === 'success') { appSettings.selectedLlmModelId = payload.selectedLlmModelId; appSettings.selectedImageModelId = payload.selectedImageModelId; alert(translate('settingSavedSuccess')); hideModal('settings-modal'); } else alert(`${translate('errorTitle')}: ${response?.message || translate('actionFailed')}`); } catch (error) { } finally { hideLoading(); saveBtn.disabled = false; } }
/** Saves girlfriend settings. */
async function saveGirlfriendSettings() { const saveBtn = getElement('save-girlfriend-settings-btn'); const gfNameInput=getElement('girlfriend-name-input'); const uNameInput=getElement('user-name-input'); const occSelect=getElement('girlfriend-occupation-select'); const persSelect=getElement('girlfriend-personality-select'); const notesInput=getElement('girlfriend-notes-input'); const samplerSelect=getElement('drawing-sampler-select'); const stepsInput=getElement('drawing-steps-input'); const customPromptInput=getElement('drawing-custom-prompt-input'); const negPromptInput=getElement('drawing-negative-prompt-input'); const adCheckbox=getElement('adetailer-checkbox'); const adPromptInput=getElement('adetailer-custom-prompt-input'); const freqSelect=getElement('active-frequency-select'); const gfNameDisplays = document.querySelectorAll('.girlfriend-name'); if(!saveBtn || !gfNameInput || !uNameInput || !occSelect || !persSelect || !notesInput || !samplerSelect || !stepsInput || !customPromptInput || !negPromptInput || !adCheckbox || !adPromptInput || !freqSelect) return; const settingsToSave = { name: gfNameInput.value.trim() || translate('defaultGirlfriendName'), userName: uNameInput.value.trim() || translate('defaultUserName'), occupationId: occSelect.value, personalityId: persSelect.value, notes: notesInput.value.trim(), drawingSampler: samplerSelect.value, drawingSteps: parseInt(stepsInput.value, 10) || 20, drawingCustomPrompt: customPromptInput.value.trim(), drawingNegativePrompt: negPromptInput.value.trim(), adetailerEnabled: adCheckbox.checked, adetailerPrompt: adPromptInput.value.trim(), activeFrequency: freqSelect.value, language: currentLanguage }; showLoading('savingText'); saveBtn.disabled = true; try { const response = await fetchData('saveGirlfriendSettings', settingsToSave, 'POST'); if (response?.status === 'success') { Object.assign(girlfriendSettings, settingsToSave); gfNameDisplays.forEach(el => el.textContent = girlfriendSettings.name); setupActiveFrequency(); if(currentLanguage !== girlfriendSettings.language) setLanguage(girlfriendSettings.language); alert(translate('settingSavedSuccess')); hideModal('girlfriend-settings-modal'); } else alert(`${translate('errorTitle')}: ${response?.message || translate('actionFailed')}`); } catch (error) { } finally { hideLoading(); saveBtn.disabled = false; } }
/** Updates favorability bar. */
function updateFavorability(newValue) { const bar = getElement('favorability-bar'); const val = getElement('favorability-value'); if(!bar || !val) return; const maxFavor = 1000, minFavor = -1000, totalRange = maxFavor - minFavor; const clampedValue = Math.max(minFavor, Math.min(maxFavor, newValue)); const progressValue = clampedValue - minFavor; bar.value = progressValue; val.textContent = `${clampedValue} / ${maxFavor}`; girlfriendSettings.favorability = clampedValue; }

// --- Gift System ---
const GIFTS = [ { id: 'rose', price: { 'zh-TW': 'NT$150', 'en': 'US$5', 'ja': '¥550' }, value: 5, nameKey: 'giftRoseName', img: 'image/gifts/rose.png' }, { id: 'choc', price: { 'zh-TW': 'NT$300', 'en': 'US$10', 'ja': '¥1100' }, value: 10, nameKey: 'giftChocName', img: 'image/gifts/chocolate.png' }, { id: 'teddy', price: { 'zh-TW': 'NT$900', 'en': 'US$30', 'ja': '¥3300' }, value: 25, nameKey: 'giftTeddyName', img: 'image/gifts/teddy.png' }, { id: 'perfume', price: { 'zh-TW': 'NT$2000', 'en': 'US$70', 'ja': '¥7700' }, value: 50, nameKey: 'giftPerfumeName', img: 'image/gifts/perfume.png' }, { id: 'necklace', price: { 'zh-TW': 'NT$6000', 'en': 'US$200', 'ja': '¥22000' }, value: 100, nameKey: 'giftNecklaceName', img: 'image/gifts/necklace.png' }, { id: 'luxury_bag', price: { 'zh-TW': 'NT$150000', 'en': 'US$5000', 'ja': '¥550000' }, value: 500, nameKey: 'giftLuxuryBagName', img: 'image/gifts/bag.png' }, { id: 'sports_car', price: { 'zh-TW': 'NT$6000000', 'en': 'US$200000', 'ja': '¥22000000' }, value: 1000, nameKey: 'giftSportsCarName', img: 'image/gifts/car.png' }];
/** Populates gift modal. */
function populateGiftModal() { const container = getElement('gift-list-container'); if(!container) return; container.innerHTML = ''; GIFTS.forEach(gift => { const itemDiv = document.createElement('div'); itemDiv.classList.add('gift-item'); itemDiv.dataset.giftId = gift.id; itemDiv.dataset.giftValue = gift.value; itemDiv.dataset.giftNameKey = gift.nameKey; const img = document.createElement('img'); img.src = gift.img || 'image/gifts/default.png'; img.alt = translate(gift.nameKey) || gift.id; img.loading = 'lazy'; img.onerror = () => { img.src = 'image/gifts/default.png'; }; const nameSpan = document.createElement('span'); nameSpan.classList.add('gift-name'); nameSpan.textContent = translate(gift.nameKey) || gift.id; const priceSpan = document.createElement('span'); priceSpan.classList.add('gift-price'); priceSpan.textContent = gift.price[currentLanguage] || gift.price['en'] || 'N/A'; const sendBtn = document.createElement('button'); sendBtn.classList.add('send-gift-confirm-btn'); sendBtn.textContent = translate('sendGiftConfirmBtn'); itemDiv.appendChild(img); itemDiv.appendChild(nameSpan); itemDiv.appendChild(priceSpan); itemDiv.appendChild(sendBtn); container.appendChild(itemDiv); }); }
/** Handles gift send button clicks. */
function handleGiftSendClick(event) {
    // Check if the click target is the send button within a gift item
    if (event.target.classList.contains('send-gift-confirm-btn')) {
        const giftItem = event.target.closest('.gift-item'); // Find the parent .gift-item element

        // Check if the necessary data attributes exist on the gift item
        if (giftItem?.dataset?.giftId && giftItem.dataset.giftValue && giftItem.dataset.giftNameKey) {
            const giftId = giftItem.dataset.giftId;
            const giftValue = parseInt(giftItem.dataset.giftValue, 10);
            const giftName = translate(giftItem.dataset.giftNameKey); // Still useful for logging or potential future use

            console.log(`Sending gift ${giftName} (ID: ${giftId}) without confirmation.`); // Log the action
            sendGift(giftId, giftValue, giftName);

        } else {
            console.error("Could not find necessary gift data attributes on clicked item.", giftItem);
        }
    }
}
/** Sends gift data to backend. */

async function sendGift(giftId, giftValue, giftName) {
    showLoading('sendingText');
    hideModal('gift-modal');
    try {
        const payload = {
            giftId: giftId, giftValue: giftValue, giftName: giftName, // Send giftName for logging/default
            currentFavorability: girlfriendSettings.favorability ?? 0,
            girlfriendName: girlfriendSettings.name || '',
            userName: girlfriendSettings.userName || '',
            llmModelId: appSettings.selectedLlmModelId,
            language: currentLanguage
        };
        console.log("Sending gift payload:", payload); // Log payload

        const response = await fetchData('sendGift', payload, 'POST');
        console.log("Received sendGift response:", response); // ** Log raw response **

        // ** Check status and data structure **
        if (response && response.status === 'success' && response.data) {
            const responseData = response.data;

            const userMessageId = `temp_gift_${Date.now()}`;
            const userMessageTimestamp = new Date();
            displayMessage('user', `[Sent Gift: ${giftName}]`, userMessageTimestamp, null, userMessageId);
            chatHistory.push({ id: responseData.userMessageId || userMessageId, sender: 'user', text: `[Sent Gift: ${giftName}]`, imageUrl: null, timestamp: userMessageTimestamp.toISOString() });

            const ci = getElement('chat-interface');
            if (responseData.userMessageId && userMessageId !== responseData.userMessageId) {
                const uMel = ci?.querySelector(`[data-message-id="${userMessageId}"]`);
                if(uMel) uMel.dataset.messageId = responseData.userMessageId;
            }
            if (responseData.newFavorability !== undefined) {
                updateFavorability(responseData.newFavorability);
            }
            if (responseData.reactionMessage) {
                displayMessage('girlfriend', responseData.reactionMessage, responseData.timestamp, null, responseData.messageId, [], null); // Gifts usually don't have actions/meta
                chatHistory.push({ id: responseData.messageId, sender: 'girlfriend', text: responseData.reactionMessage, imageUrl: null, timestamp: responseData.timestamp, actions: [], metadata: null });
            }
            console.log("Gift processed successfully by frontend.");

        } else {
            // Handle error or unexpected structure from backend
            console.error("sendGift failed or returned unexpected structure:", response);
            displayMessage('system', `${translate('errorTitle')}: ${response?.message || translate('giftSendFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
        }
    } catch (error) {
        // Handle fetch error (alert already shown by fetchData)
         console.error(">>> Error caught inside sendGift:", error);
         displayMessage('system', `${translate('errorTitle')}: ${error.message || translate('giftSendFailed')}`, new Date().toISOString(), null, `error_${Date.now()}`);
    } finally {
        hideLoading();
        disableActionButtons(); // Apply cooldown AFTER request finishes
    }
}
// --- Active Frequency (Auto Messaging) ---
/** Sets up or clears auto-message interval. */
function setupActiveFrequency() { const freqSelect = getElement('active-frequency-select'); if(!freqSelect) return; if (activeFrequencyInterval) { clearInterval(activeFrequencyInterval); activeFrequencyInterval = null; } const intervalSeconds = parseInt(freqSelect.value, 10); if (intervalSeconds > 0) { activeFrequencyInterval = setInterval(triggerAutoMessage, intervalSeconds * 1000); console.log(`Set active frequency: ${intervalSeconds}s.`); } else console.log("Active frequency off."); girlfriendSettings.activeFrequency = freqSelect.value; }
/** Triggers an auto-message request. */
async function triggerAutoMessage() { const messageInput = getElement('message-input'); if (isSending || document.activeElement === messageInput || document.hidden) { console.log("Skipping auto msg trigger."); return; } console.log("Triggering auto message..."); isSending = true; try { const historyContext = chatHistory.slice(-MAX_HISTORY_CONTEXT).map(msg => ({ sender: msg.sender, text: msg.text, imageUrl: msg.imageUrl })); const payload = { purpose: 'auto_message', history: historyContext, girlfriendSettings: { name: girlfriendSettings.name || '', userName: girlfriendSettings.userName || '', occupationId: girlfriendSettings.occupationId, personalityId: girlfriendSettings.personalityId, notes: girlfriendSettings.notes, language: currentLanguage }, llmModelId: appSettings.selectedLlmModelId, currentFavorability: girlfriendSettings.favorability ?? 0 }; const response = await fetchData('getAutoMessage', payload, 'POST'); if (response && response.status === 'success' && response.girlfriendMessage) { displayMessage('girlfriend', response.girlfriendMessage, response.timestamp, null, response.messageId, response.actions, response.metadata); chatHistory.push({ id: response.messageId, sender: 'girlfriend', text: response.girlfriendMessage, imageUrl: null, timestamp: response.timestamp, isAuto: true, actions: response.actions, metadata: response.metadata }); if (response.newFavorability !== undefined) updateFavorability(response.newFavorability); } else console.warn("Failed auto message or empty:", response?.message); } catch (error) { console.error("Error triggering auto message:", error); } finally { isSending = false; } }

// --- Copyright Modal Time Update ---
/** Updates the time display in the copyright modal */
function updateCopyrightTime() { const timeElement = getElement('current-date-time'); if (timeElement) { const locale = currentLanguage.replace('_', '-'); try { timeElement.textContent = new Date().toLocaleString(locale, { dateStyle: 'long', timeStyle: 'medium' }); } catch (e) { timeElement.textContent = new Date().toLocaleString(); console.warn("Locale formatting fail:", locale, e); } } }

// --- Initialization ---
/** Orchestrates initial loading sequence. */
async function initializeApp() {
    // Assign global DOM element variables AFTER DOM is loaded
    chatInterface = getElement('chat-interface'); messageInput = getElement('message-input'); sendButton = getElement('send-button'); selfieBtn = getElement('selfie-btn'); callGirlfriendBtn = getElement('call-girlfriend-btn'); languageSwitcher = getElement('language-switcher'); loadingOverlay = getElement('loading-overlay'); loadingText = getElement('loading-text'); favorabilityBar = getElement('favorability-bar'); favorabilityValue = getElement('favorability-value'); llmModelSelect = getElement('llm-model-select'); imageModelSelect = getElement('image-model-select'); settingsModal = getElement('settings-modal'); girlfriendSettingsModal = getElement('girlfriend-settings-modal'); avatarModal = getElement('avatar-modal'); giftModal = getElement('gift-modal'); closeButtons = document.querySelectorAll('.close-btn'); settingsBtn = getElement('settings-btn'); girlfriendSettingsBtn = getElement('girlfriend-settings-btn'); copyrightBtn = getElement('copyright-btn'); giftBtn = getElement('gift-btn'); girlfriendNameInput = getElement('girlfriend-name-input'); userNameInput = getElement('user-name-input'); girlfriendOccupationSelect = getElement('girlfriend-occupation-select'); girlfriendPersonalitySelect = getElement('girlfriend-personality-select'); girlfriendNotesInput = getElement('girlfriend-notes-input'); drawingSamplerSelect = getElement('drawing-sampler-select'); drawingStepsInput = getElement('drawing-steps-input'); drawingCustomPromptInput = getElement('drawing-custom-prompt-input'); drawingNegativePromptInput = getElement('drawing-negative-prompt-input'); adetailerCheckbox = getElement('adetailer-checkbox'); adetailerOptions = getElement('adetailer-options'); adetailerCustomPromptInput = getElement('adetailer-custom-prompt-input'); saveAppSettingsBtn = getElement('save-app-settings-btn'); saveGirlfriendSettingsBtn = getElement('save-girlfriend-settings-btn'); activeFrequencySelect = getElement('active-frequency-select'); girlfriendNameDisplays = document.querySelectorAll('.girlfriend-name'); avatarModalTitle = getElement('avatar-modal-title'); existingAvatarsContainer = getElement('existing-avatars'); uploadAvatarBtn = getElement('upload-avatar-btn'); avatarUploadInput = getElement('avatar-upload-input'); avatarCropperContainer = getElement('avatar-cropper-container'); confirmCropBtn = getElement('confirm-crop-btn'); changeAvatarOptionsDiv = getElement('change-avatar-options'); giftListContainer = getElement('gift-list-container'); copyrightModal = getElement('copyright-modal'); currentDateTimeSpan = getElement('current-date-time');
    actionButtons = [callGirlfriendBtn, giftBtn, selfieBtn, sendButton]; // Define action buttons array

    if (!loadingOverlay || !loadingText || !languageSwitcher || !chatInterface) { console.error("Essential UI elements missing! Init failed."); alert("Init failed: Core UI elements missing."); return; }
    showLoading('loadingText'); await loadLanguagePacks(); const preferredLanguage = localStorage.getItem('preferredLanguage'); if (preferredLanguage && languagePacks[preferredLanguage]) currentLanguage = preferredLanguage; if(languageSwitcher) languageSwitcher.value = currentLanguage; await loadAppSettings(); await loadGirlfriendSettings(); translateUI(); await loadChatHistory(); await checkAvatarStatus(); setupEventListeners(); hideLoading(); console.log("Application Initialized.");
} // End of initializeApp

/** Sets up all primary event listeners. */
function setupEventListeners() {
    // Use global vars assigned in initializeApp
    languageSwitcher?.addEventListener('change', (event) => setLanguage(event.target.value));
    settingsBtn?.addEventListener('click', () => showModal('settings-modal'));
    girlfriendSettingsBtn?.addEventListener('click', () => showModal('girlfriend-settings-modal'));
    copyrightBtn?.addEventListener('click', () => showModal('copyright-modal'));
    giftBtn?.addEventListener('click', () => showModal('gift-modal'));
    document.querySelectorAll('.girlfriend-avatar-clickable').forEach(el => { el?.addEventListener('click', () => { if(avatarModalTitle) avatarModalTitle.textContent = translate('avatarModalTitleChange'); if(changeAvatarOptionsDiv) changeAvatarOptionsDiv.style.display = 'block'; showModal('avatar-modal'); }); });
    closeButtons.forEach(btn => btn?.addEventListener('click', (event) => { if(event?.target?.dataset?.modalId) hideModal(event.target.dataset.modalId); }));
    window.addEventListener('click', (event) => { if (event.target.classList.contains('modal')) hideModal(event.target.id); });
    saveAppSettingsBtn?.addEventListener('click', saveAppSettings);
    saveGirlfriendSettingsBtn?.addEventListener('click', saveGirlfriendSettings);
    adetailerCheckbox?.addEventListener('change', () => { if(adetailerOptions) adetailerOptions.style.display = adetailerCheckbox.checked ? 'block' : 'none'; });
    activeFrequencySelect?.addEventListener('change', setupActiveFrequency);
    chatInterface?.addEventListener('click', (event) => { if (event.target.classList.contains('delete-message-btn')) { const msgContainer = event.target.closest('.message-container'); if (msgContainer?.dataset?.messageId) deleteMessage(msgContainer.dataset.messageId); } else if (event.target.classList.contains('action-button')) { handleActionButtonClick(event); } else if (event.target.classList.contains('chat-image')) { window.open(event.target.src, '_blank'); } });
    sendButton?.addEventListener('click', () => sendMessage());
    messageInput?.addEventListener('keypress', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } });
    messageInput?.addEventListener('input', resizeTextarea);
    selfieBtn?.addEventListener('click', requestSelfie);
    callGirlfriendBtn?.addEventListener('click', () => { const callMsgs = ["在嗎？", "哈囉？", "在做什麼？", "Hi~", "(想你了...)"]; const randomMsg = callMsgs[Math.floor(Math.random() * callMsgs.length)]; console.log("Calling girlfriend:", randomMsg); sendMessage(randomMsg); });
    // Image History listener removed
    uploadAvatarBtn?.addEventListener('click', () => avatarUploadInput?.click());
    avatarUploadInput?.addEventListener('change', handleAvatarUpload);
    confirmCropBtn?.addEventListener('click', confirmAvatarCropAndUpload);
    // Generate avatar listeners removed
    existingAvatarsContainer?.addEventListener('click', handleAvatarThumbnailClick);
    giftListContainer?.addEventListener('click', handleGiftSendClick);
    if(messageInput) resizeTextarea(); // Initial resize
} // <-- ** Closing brace for setupEventListeners **

// --- Run Initialization ---
document.addEventListener('DOMContentLoaded', initializeApp);
