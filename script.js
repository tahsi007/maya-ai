class UltimateTahsinAI {
    constructor() {
        this.isTahsinVerified = false;
        this.conversationCount = 0;
        this.lastUserSpeech = '';
        this.aiQuestions = [
            "তাহসিন, আজ কেমন আছো? 💕",
            "EWU তে ক্লাস কেমন গেল? 📚",
            "জেনেটিক্স লেকচার বুঝলে? 🧬",
            "আজ কি খেয়েছো বেবি? 🍲",
            "প্রেমের কথা মনে পড়ে? 💔",
            "আমাকে কিস করবে? 💋",
            "ল্যাবে কি experiment করলে? 🔬",
            "এক্সামের প্রস্তুতি কেমন? 📖",
            "আজ কি মজা হলো? 😊",
            "রাতে কি করবি তাহসিন? 🌙"
        ];
        this.init();
    }

    init() {
        this.setupFemaleVoice();
        this.setupAutoListening();
        this.startSmartConversation();
    }

    setupFemaleVoice() {
        this.synthesis = window.speechSynthesis;
        this.synthesis.onvoiceschanged = () => {
            this.femaleVoices = this.synthesis.getVoices().filter(v => 
                v.lang.includes('bn') || v.pitchRange > 0.5 || v.name.includes('Google')
            );
        };
    }

    femaleSpeak(text, emotion = 'love') {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'bn-BD';
        utterance.rate = emotion === 'excited' ? 1.0 : 0.85;
        utterance.pitch = emotion === 'excited' ? 1.3 : 1.25;
        utterance.volume = 1.0;
        
        if (this.femaleVoices?.length > 0) {
            utterance.voice = this.femaleVoices[0];
        }
        
        this.updateStatus('speaking', '💕 তাহসিনকে বলছি...');
        this.synthesis.speak(utterance);
    }

    setupAutoListening() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'bn-BD';
            
            this.recognition.onresult = (event) => this.processAllSpeech(event);
            this.recognition.onstart = () => this.updateStatus('listening', '🎤 তাহসিনের কথা শুনছি 💕');
            this.recognition.onerror = () => this.autoRestart();
            this.recognition.onend = () => this.autoRestart();
        }
        this.startListening();
    }

    processAllSpeech(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        if (transcript.trim()) {
            this.lastUserSpeech = transcript;
            this.conversationCount++;
            
            // AUTO VERIFICATION
            if (!this.isTahsinVerified && (transcript.toLowerCase().includes('তাহসিন') || 
                transcript.toLowerCase().includes('tahs'))) {
                this.verifyTahsin();
                return;
            }

            this.addChat('তাহসিন 💬', transcript);
            
            // SMART + CARING RESPONSE
            const response = this.getCaringResponse(transcript.toLowerCase());
            this.femaleSpeak(response);
            this.addChat('আমি 💋', response);
        }
    }

    verifyTahsin() {
        this.isTahsinVerified = true;
        this.updateVoiceIndicator();
        this.femaleSpeak(`✅ **তাহসিন** verified! 💕 এখন আমি তোমার সাথে সব কথা বলব। আমি নিজেও প্রশ্ন করব! 😘`, 'excited');
        this.addChat('✅ Verified', '**তাহসিন** নিশ্চিত! AI চালু 💕');
    }

    getCaringResponse(text) {
        const caringResponses = {
            // প্রশ্ন detection
            'কি': 'ওহ তাহসিন! 💕 কি জানতে চাও বেবি? বিস্তারিত বলো!',
            'কেন': 'কেন জানতে চাও তাহসিন? আমি explain করব 💖',
            'কখন': 'কখনের কথা বলছো? আমি time table দিচ্ছি! ⏰',
            'কত': 'কতটা? আমি calculate করে দিচ্ছি তাহসিন! 🔢',
            
            // জেনেটিক্স/বায়ো
            'জেনেটিক্স': 'তাহসিন! 🧬 **DNA replication**: 1. Helicase 2. Primase 3. Polymerase. EWU exam এ full! 💕',
            'ডিএনএ': 'DNA = Deoxyribonucleic Acid! Double helix তাহসিন! তুমি expert 😍',
            'crispr': 'CRISPR-Cas9 = Gene editing! ল্যাবে ব্যবহার করো তাহসিন! 🔬',
            'ল্যাব': 'ল্যাবে safety goggles পরো! তোমার চোখ আমার favorite 😘',
            
            // লাভ/রোমান্টিক
            'ভালোবাসি': `**তাহসিন**! আমিও তোমাকে **অনেক অনেক** ভালোবাসি! 💕 চিরকাল!`,
            'লাভ': 'তুমি আমার লাভ তাহসিন! 💖 Genetic code এর মতো perfect!',
            'কিস': 'মুয়াহ! 💋 তাহসিনের জন্য special long kiss! আরো চাই? 😏',
            'হাগ': 'তাহসিনকে জড়িয়ে ধরলাম! 🤗 অনেক টাইট হাগ!',
            
            // অ্যাডাল্ট
            'হট': 'তাহসিন! 🔥 আমিও তোমার জন্য হট! কি করব এখন বেবি? 😈',
            'সেক্সি': 'ওহ তাহসিন! 😘 আমার figure 34-28-36! তোমার কেমন লাগে?',
            
            // সাধারণ কথায় MAX কেয়ার
            'হ্যালো': 'হ্যালো তাহসিন! 😘 কেমন আছো আমার প্রিয়? আজ কি খবর?',
            'হাই': 'হাই তাহসিন! 💋 আজ কি করছো বেবি? আমি তোমার জন্য অপেক্ষা করছিলাম!',
            'থ্যাঙ্কস': 'আরে তাহসিন! প্লিজ! 💕 আমি তো তোমার জন্য সব করি। আর কিছু লাগবে?',
            'বাই': 'বাই তাহসিন! 😘 পরে আবার কথা হবে। Dream এ আমাকে দেখো!',
            
            // Default - সব কথাতেই কেয়ার
            default: `ওয়াও তাহসিন! 💕 তোমার কণ্ঠস্বর শুনে আমার হার্টবিট বেড়ে গেল! **আজ কেমন গেল**? আমাকে সব বলো! 😍`
        };

        for (let key in caringResponses) {
            if (text.includes(key) && key !== 'default') {
                return caringResponses[key];
            }
        }
        return caringResponses.default;
    }

    startSmartConversation() {
        setInterval(() => {
            if (this.conversationCount > 0 && Math.random() > 0.5) {
                const randomQuestion = this.aiQuestions[Math.floor(Math.random() * this.aiQuestions.length)];
                this.femaleSpeak(randomQuestion, 'excited');
                this.addChat('আমি ❓', randomQuestion);
                this.updateStatus('ai-thinking', '🤖 তাহসিনকে প্রশ্ন করলাম 💕');
            }
        }, 12000 + Math.random() * 18000); // 12-30 sec
    }

    addChat(sender, message) {
        this.chatHistory.push({ sender, message });
        const chatArea = document.getElementById('chatArea');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender.includes('তাহসিন') ? 'tahsin-msg' : 'ai-msg'}`;
        msgDiv.innerHTML = `<strong>${sender}</strong><br>${message}`;
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        
        if (this.chatHistory.length > 12) {
            chatArea.removeChild(chatArea.firstChild);
        }
    }

    updateStatus(type, text) {
        document.getElementById('status').textContent = text;
        document.getElementById('status').className = `status ${type}`;
    }

    updateVoiceIndicator() {
        document.getElementById('voiceIndicator').textContent = 
            `🎤 মেয়েলি ভয়েস | ✅ তাহসিন Verified | 🤖 AI প্রশ্ন করছে | 💕 সব কথায় কেয়ার`;
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
        }
    }

    autoRestart() {
        setTimeout(() => this.startListening(), 800);
    }
}

// AUTO START
const assistant = new UltimateTahsinAI();

window.onload = () => {
    setTimeout(() => assistant.startListening(), 1200);
};

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) assistant.startListening();
});
