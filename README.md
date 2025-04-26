# MY GFRIEND: Your AI Cloud Girlfriend (v1.0 - Open Source Edition)

[繁體中文](README.zh-tw.md)
[簡體中文](README.zh-cn.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Imagine having a dedicated girlfriend who's always there for you, ready to chat, share feelings, and send sweet messages anytime, anywhere. Now, MY GFRIEND brings this dream one step closer! This is an **open-source** AI cloud girlfriend project that connects to **local AI models**, aiming to provide you with a **private, customizable, and interactive** chat experience.

![image](https://github.com/marcochen2023/My-GFriend/blob/main/example/MyGFriend_en.jpg)

[![點此觀看影片](https://img.youtube.com/vi/6lvPyDvDBfw/0.jpg)](https://www.youtube.com/watch?v=6lvPyDvDBfw)

## ✨ Features

* **Familiar Chat Interface:** Modeled after popular instant messengers like Line/WeChat, supporting both PC and mobile devices with a stylish pink CSS UI.
* **Local LLM Powered:** Connects to a locally running **LM Studio** LLM API for high-quality, private conversations. Supports switching between multiple models defined in `LSLLMModel.json`.
* **Local Image Generation:** Connects to a locally running **Stable Diffusion WebUI** (or compatible API defined in `IMAGEModel.json`) for image generation. Your girlfriend can 'take a selfie' based on the conversation or your specific request (including text descriptions provided in the input box).
* **Personalized Girlfriend Settings:** Customize her name, occupation, personality, how you address her, and add supplementary notes to influence her conversation style.
* **Affection System:** Giving gifts and interacting through conversation affects affection levels (-1000 to 1000), influencing her response tone and behavior based on predefined levels.
* **Dynamic Interaction:**
    * **Proactive Messages:** Configure the frequency at which your girlfriend initiates conversation.
    * **Action Prompts:** After her reply, she provides 4 follow-up dialogue/action suggestions from the **user's perspective**.
* **Multi-language Support:** Built-in interfaces for Traditional Chinese, English, and Japanese (via `languagepacks.json`).
* **Conversation Logging:** Automatically saves chat history locally to `data/chathistory.log` (JSON Lines format).
* **Avatar Management:** Supports uploading and cropping custom avatars (saved in `image/avatar/`). Uses `image/avatar/default_avatar.png` if none is set.
* **Adjustable Drawing Parameters:** Configure Stable Diffusion's Sampler, Steps, custom positive/negative prompts, and ADetailer usage.
* **Open Source & Extendable:** Community contributions are welcome to improve and expand features!

## 🚀 Tech Stack

* **Frontend:** HTML, CSS, JavaScript (Vanilla, No Frameworks)
* **Backend:** PHP (Requires Web Server environment, e.g., Apache/Nginx)
* **AI Model APIs (Local Deployment Recommended):**
    * **LLM:** [LM Studio](https://lmstudio.ai/) (or other local model servers providing OpenAI-compatible APIs)
    * **Image:** [Stable Diffusion WebUI (AUTOMATIC1111)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) / [Forge](https://github.com/lllyasviel/stable-diffusion-webui-forge) (API must be enabled) or other compatible image generation APIs (e.g., ComfyUI + API Wrapper, Together AI, Runpod instance)
* **Data Storage:** Local JSON files (config), Log file (chat history), Local image files

## 📋 Prerequisites

Before starting, ensure your computer environment meets the following conditions. **Note:** Running both LLM and Image Generation models locally simultaneously requires a graphics card with **at least 16GB of VRAM** for a smooth experience.

1.  **PHP Environment:**
    * PHP installed (version 7.4 or higher recommended).
    * `curl` (for API requests) and `gd` (for image processing) PHP extensions must be enabled. Find your `php.ini`, uncomment `extension=curl` and `extension=gd` (or `extension=php_curl.dll`, `extension=php_gd.dll` on Windows), and ensure `extension_dir` points to your PHP extensions folder.
    * A web server is required (e.g., Apache in XAMPP, WAMP, MAMP, or Nginx + PHP-FPM).
    * *Recommendation:* XAMPP is user-friendly. Download the latest version, install it, start the Apache module from the XAMPP Control Panel. Place the downloaded MY GFRIEND project files into the `xampp/htdocs/` folder (you can typically delete the default files/folders inside `htdocs`).

2.  **LM Studio:**
    * LM Studio installed and running.
    * A graphics card with **at least 8GB VRAM** is recommended for running the LLM alone smoothly, especially for larger models.
    * At least one LLM model in GGUF format downloaded and loaded within LM Studio.
    * LM Studio's **Local Inference Server** started (usually accessible at `http://127.0.0.1:1234/v1`). Check the Server tab in LM Studio.
    * Using models 7B or larger is recommended for a better conversational experience.
    * For the ultimate experience (including better multi-turn consistency, function calling interpretation for actions/metadata, and potentially diverse interactions), try powerful models like Llama-3.3-70B-Instruct-Turbo (if available and runnable on your hardware/API provider).

3.  **Stable Diffusion WebUI (AUTOMATIC1111 / Forge or compatible API):**
    * AUTOMATIC1111's Stable Diffusion WebUI, Forge, or a compatible service installed and running.
    * **API access must be enabled.** For A1111/Forge, this usually means adding the `--api` argument to the command line arguments when launching (e.g., in `webui-user.bat` or `webui.sh`).
    * The API service must be running (usually at `http://127.0.0.1:7860`).
    * (Optional) The [ADetailer](https://github.com/Bing-su/adetailer) extension installed and enabled in WebUI if you want to use the face restoration feature.
    * Supports various models (SD 1.5, SDXL, Flux, etc.) runnable on A1111/Forge. Realistic models like *Illustrious* are recommended for optimal results and potentially faster generation speeds.
    * If local hardware is insufficient, deploying on [runpod.io](https://runpod.io) GPUs is recommended (search for "Stable Diffusion WebUI Forge" on Runpod, e.g., `runpod/forge:3.3.0`). Configure `IMAGEModel.json` accordingly.
    * To use the recommended *Illustrious* model, you can download "Gemini_ILMix Illustrious realistic" from our TensorArt page: [https://tensor.art/models/841406066609849364/Gemini_ILMix-Illustrious-realistic-Illustrious_V1](https://tensor.art/models/841406066609849364/Gemini_ILMix-Illustrious-realistic-Illustrious_V1)

4.  **Web Browser:** Modern browsers like Chrome, Firefox, Edge.

## ⚙️ Setup & Installation

1.  **Download/Clone Project:**
    ```bash
    git clone [https://github.com/your-username/MYGFRIEND.git](https://github.com/your-username/MYGFRIEND.git)
    # Or download the ZIP file and extract it
    ```
    *(Remember to replace `your-username` with the actual repository path)*
2.  **Place Project:** Move the entire `MYGFRIEND` folder into your web server's document root directory (e.g., `htdocs` for XAMPP).
3.  **Set Permissions:**
    * **Very important:** Ensure the web server process (e.g., `www-data`, `apache`, `SYSTEM` on Windows) has **read and write** permissions for the following directories and their subdirectories:
        * `data/`
        * `image/avatar/`
        * `image/photo/`
    * On Linux/macOS, you might need `chmod` or `chown`. Permissions are usually less strict on Windows but should still be checked if issues arise.
4.  **Configure API Connections:**
    * **Copy Template:** Copy `data/girlfriend_settings.json.template` and rename the copy to `data/girlfriend_settings.json`. (The application *might* create a default one if missing, but copying allows pre-configuration).
    * **Edit LLM Config (`LSLLMModel.json`):**
        * Open `LSLLMModel.json` in the project root.
        * Modify or add model entries. Ensure each `id` is unique.
        * `displayName`: Name shown in the settings dropdown.
        * `model`: The model identifier required by the API (e.g., loaded model file for LM Studio, specific name like `meta-llama/Llama-3...` for external APIs).
        * `endpoint`: The full API URL (e.g., `http://127.0.0.1:1234/v1/chat/completions` for local LM Studio, or an external URL).
        * `API_KEY`: Leave empty (`""`) for local LM Studio. Fill in if using an external API that requires a key (**Warning: Storing keys directly in this file is a security risk. Use with caution, especially if sharing or deploying.**).
    * **Edit Image Model Config (`IMAGEModel.json`):**
        * Open `IMAGEModel.json` in the project root.
        * Modify or add image generation service entries. Ensure each `id` is unique.
        * `displayName`: Name shown in the settings dropdown.
        * `model`: The Checkpoint model name you want to use in SD WebUI (or the model identifier for other API services).
        * `SD_WEBUI_API_URL`: The image generation API endpoint (e.g., `http://127.0.0.1:7860/sdapi/v1/txt2img` for local SD WebUI).
        * `API_KEY`: Leave empty (`""`) for local SD WebUI. Fill in if using an external service requiring a key.
5.  **Start Services:**
    * Ensure your Web Server (Apache/Nginx) and PHP are running.
    * Ensure your LM Studio Local Inference Server is running with a model loaded.
    * Ensure your Stable Diffusion WebUI API service is running.
6.  **Access Application:** Open your web browser and navigate to the URL where `index.php` is located (e.g., `http://localhost/MYGFRIEND/` or `http://127.0.0.1:PORT/` where PORT is specified in your batch file if using the PHP built-in server).

## 🔧 Configuration & Customization

* **Language:** Select the interface language in the top-right dropdown.
* **Models:** Click the settings icon (⚙️) in the top-right to select the LLM and Image Generation models to use from your configured lists.
* **Girlfriend Settings:** Click the girlfriend settings icon (next to the logo) to configure:
    * Girlfriend's Name, Your Name
    * Girlfriend's Occupation, Personality (Options loaded from `data/occupation.json`, `data/personality.json` - you can edit these JSON files to add more options)
    * Additional Notes (influences LLM's understanding)
    * Drawing Parameters (Sampler, Steps, Prompts, ADetailer)
* **Avatar:** Click the top-left Logo or the girlfriend's avatar in the chat interface to open the avatar change modal:
    * Click existing thumbnails to switch instantly.
    * Click "Choose Image" to upload a new avatar (cropping is supported).

## 📖 File Structure

```
MYGFRIEND/
│
├── .git/              # Git directory (auto-generated)
├── .gitignore         # Git ignore config file
├── index.php          # Main HTML & PHP entry point
├── funMYGF.php        # Backend PHP logic
├── MYGFstyle.css      # CSS styles
├── MYGFjs.js          # JavaScript logic
├── LSLLMModel.json    # LLM model config (user needs to edit)
├── IMAGEModel.json    # Image model config (user needs to edit)
├── languagepacks.json # Multi-language file
├── LICENSE            # Open source license (MIT)
├── README.md          # Main project description file
│
├── data/
│   ├── .gitignore     # Ignore user data in this directory
│   ├── occupation.json  # Occupation examples, customizable
│   ├── personality.json # Personality examples, customizable
│   ├── girlfriend_settings.json.template # Girlfriend settings template file
│   └── sound/
│       └── gift.wav # gift sound
│
└── image/
	├── .gitignore     # Ignore user-uploaded/generated image directories
	├── GFriend.png    # Logo
	├── setting.png    # Settings icon
	├── girlinfo.png   # Girlfriend settings icon
	├── copyright.png  # Copyright info icon (if you use an image instead of ©)
	│
	├── avatar/
	│   ├── .gitignore # Ignore user-uploaded avatar content
	│   └── default_avatar.png # Default avatar
	│
	├── photo/
	│   └── .gitignore # Ignore chat-generated photo content
	│
	└── gifts/         # (Optional) Contains gift images
	└── default.png  # Example
	└── ...
```

## 📖 Usage Instructions

1.  Complete the installation and configuration steps.
2.  (First time) Upload an avatar when prompted or via the avatar modal.
3.  (Recommended) Go to "Girlfriend Settings" and "Application Settings" to choose your preferred models and customize your girlfriend's profile.
4.  Type messages in the input box at the bottom and press "Send" (➤) or Enter to chat.
5.  Click the "Request Selfie" (📸) button to ask your girlfriend for a picture based on the current context (you can also type descriptive text in the input box before clicking).
6.  Click the "Call Girlfriend" button for a quick greeting.
7.  Click the "Send Gift" button to choose a gift and potentially increase affection.
8.  Monitor the affection bar at the top; it influences her tone and behavior.
9.  Click the trash icon (🗑️) next to a message bubble to delete it.

## 🤝 Contributing

Contributions are welcome! You can help by:

* Reporting Bugs or Suggesting Features: Please use the GitHub Issues page.
* Improving Code or Adding Features: Fork the project, create your Feature Branch (`git checkout -b feature/AmazingFeature`), Commit your Changes (`git commit -m 'Add some AmazingFeature'`), Push to the Branch (`git push origin feature/AmazingFeature`), and open a Pull Request.
* Adding or improving translations.
* Sharing your usage experience and custom configurations.

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🧑‍💻 Developers

* Sinsin Wang ([Facebook](https://www.facebook.com/WangSinsin), [X/Twitter](https://x.com/Windgirl2003))
* Marco Chen (marcochen2023@gmail.com)
* Ethan Chen

## 💬 Community

Join our open-source discussion group:

You've been invited to join the "My GFriend Open Source Discussion Group"! Click the link below to join!
![Line QR Code](https://github.com/marcochen2023/My-GFriend/blob/main/example/QrCode.jpg)
[https://line.me/ti/g2/sYbY0s982DuzdBu_qPu4u2MogNE1rmK_Im1ihg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default](https://line.me/ti/g2/sYbY0s982DuzdBu_qPu4u2MogNE1rmK_Im1ihg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default)
