/* ================================================
   XVITYPING — LANGUAGE ENGINE  (v5 — Full i18n)
   lang.js
================================================ */

const I18N = {
  en: {
    home:'Home',lessons:'Lessons',test:'Test',back:'Back',
    quickTest:'Quick Test',customMode:'Custom Mode',customTest:'Custom Test',
    heroTitle1:'Type Faster,',heroTitle2:'Think Sharper',
    heroSub:'Boost your typing speed with structured lessons, real-time analytics, and seamless Unijoy Bangla support.',
    badge:'Leaderboard',
    modeTyping:'Typing Lessons',modeTypingDesc:'16 structured lessons × 16 parts each. English & full Unijoy Bangla.',
    modeQuick:'Quick Test',modeQuickDesc:'Jump in — online text, real-time WPM and accuracy.',
    modeCustom:'Custom Mode',modeCustomDesc:'Use your own text for a personalized typing test.',
    bestWpm:'Best WPM',bestAcc:'Best Accuracy',testsDone:'Tests Done',lessonsDone:'Lessons Done',timeTyped:'Time Typed',
    recentResults:'Recent Results',
    noticeTitle:'Notice — Update in Progress',
    noticeText:'Xvitypoo is actively being developed with new features rolling out regularly. Some features may have minor issues — our team is working hard. We appreciate your patience. Found a bug or have a suggestion?',
    noticeFeedback:'Send us feedback',
    contactTitle:'Get in Touch',contactSub:"Have questions or feedback? We'd love to hear from you.",
    cfCardTitle:'Send a Message',cfCardSub:"We'll respond within 24 hours",
    cfName:'Name',cfEmail:'Email',cfSubject:'Subject',cfMessage:'Message',
    cfNamePh:'Your name',cfEmailPh:'your@email.com',cfSubjectPh:"What's this about?",cfMessagePh:'Tell us more...',
    cfSendBtn:'Send Message',
    cfSuccess:"✓ Message sent! We'll get back to you soon.",
    cfError:'✗ Failed to send. Please email us directly.',
    cfEmailLabel:'Email us at',cfResponseLabel:'Response time',cfResponseTime:'Within 24 hours',
    faqTitle:'Frequently Asked Questions',
    faq1q:'How do I switch to Bangla typing?',faq1a:'Press Ctrl+Alt+V to toggle between English and Bangla (Unijoy layout). You can also click the EN/বাং button in the header.',
    faq2q:'Why is my WPM showing 0?',faq2a:'WPM calculates after you type at least a few words. Start typing and it will update every 500ms automatically.',
    faq3q:'How does the lesson progress save?',faq3a:"Progress saves automatically in your browser's local storage. Clearing browser data will reset your progress.",
    faq4q:'Is Xvitypoo free to use?',faq4a:'Yes! Xvitypoo is completely free. No registration, no subscription, no hidden fees. Just type and improve.',
    faq5q:'Can I use my own text for practice?',faq5a:'Yes! Go to Custom Test from the menu. Type or paste your text (minimum 60 words), save it for later, and start practicing anytime.',
    footerTagline:'Master touch typing with structured lessons and real-time analytics. Free for everyone.',
    footerXvifloo:'Xvifloo is a creative digital studio focused on building modern websites, UI designs, and custom digital experiences. The Xvitypoo platform is part of this initiative to provide a clean and modern typing practice environment.',
    navNavigate:'Navigate',navLegal:'Legal',navAbout:'About',
    footerHome:'Home',footerLessons:'Lessons',footerQuickTest:'Quick Test',footerCustom:'Custom Mode',
    terms:'Terms & Conditions',privacy:'Privacy Policy',cookie:'Cookie Policy',legal:'Legal Notice',
    about:'About Xvitypoo',contact:'Contact',adminInfo:'Admin Info',
    copyright:'©2026 Xvitypoo. All rights reserved.',madeby:'Made by',
    typingLessons:'Typing Lessons',
    lessonsScreenSub:'16 lessons × 10 parts each — beginner to expert.',
    start:'Start',pause:'Pause',resume:'Resume',restart:'Restart',stop:'Stop',
    tryAgain:'Try Again',goHome:'Home',
    mobNavLabel:'Navigation',mobLangLabel:'Language',mobSoundOn:'Sound On',mobSoundOff:'Sound Off',
    mobThemeLabel:'Toggle Theme',signIn:'Sign In / Register',saveProgress:'Save your progress',
    customModeTitle:'Custom Typing Test',customModeSub:'Use your own text for a personalized typing test.',
    customSave:'Save',customLoad:'Load',customTitlePh:'Text title (optional)',
    customTextPh:'Paste or type your text here...',customTimeLabel:'Time limit:',customStartBtn:'Start Test',
    termsTitle:'Terms & Conditions',
    termsBody:`<p>Welcome to <strong>Xvitypoo</strong>, a product of <strong>Xvifloo</strong>. By accessing and using this website, you agree to comply with the following terms and conditions.</p><h2>Use of Service</h2><p>Xvitypoo is designed to help users improve typing speed and accuracy through structured lessons and real-time feedback. You agree to use this platform only for educational and productivity purposes. Any misuse, abuse, or attempt to damage the service is strictly prohibited.</p><h2>Intellectual Property</h2><p>All design elements, branding, logos, UI components, and content on this website are the property of Xvitypoo and Xvifloo unless otherwise stated. Unauthorized copying, redistribution, or reproduction of any part of this website is discouraged.</p><h2>Service Availability</h2><p>We strive to keep the platform available at all times, but we do not guarantee uninterrupted access. Features, lessons, and functionality may change or be updated without prior notice.</p><h2>User Responsibility</h2><p>You are responsible for how you use this platform. We are not liable for any damages or issues arising from the use of this service.</p><h2>Acceptance of Terms</h2><p>By continuing to use Xvitypoo, you agree to these terms and conditions. If you do not agree, please discontinue using the website.</p>`,
    privacyTitle:'Privacy Policy',
    privacyBody:`<p>Your privacy is important to us. This Privacy Policy explains how Xvitypoo handles your data.</p><h2>Information Collection</h2><p>Xvitypoo does not require user registration and does not collect personal information such as name, email, or phone number unless voluntarily provided.</p><h2>Local Storage</h2><p>Typing preferences, theme settings, language choice, and performance data such as WPM and accuracy may be stored locally in your browser to improve user experience.</p><h2>Third-Party Content</h2><p>Some typing text or paragraphs may be fetched from public APIs. We do not control third-party content and are not responsible for their privacy practices.</p><h2>Data Sharing</h2><p>We do not sell, trade, or share your personal information with third parties. All stored data remains in your browser.</p><h2>Security</h2><p>We take reasonable measures to ensure the platform is safe, but users should also take precautions when browsing online.</p><p>By using Xvitypoo, you agree to this Privacy Policy.</p>`,
    cookieTitle:'Cookie Policy',
    cookieBody:`<p>Xvitypoo uses cookies and local storage to enhance your browsing experience.</p><h2>What We Store</h2><p>Cookies may store theme preferences such as dark or light mode, language selection, typing settings, and best scores. This helps provide a personalized experience.</p><h2>No Advertising Cookies</h2><p>We do not use cookies for advertising or user tracking purposes. Our cookies are strictly used for functionality and performance.</p><h2>Managing Cookies</h2><p>You can disable cookies from your browser settings. However, doing so may affect some features such as saved preferences and best score tracking.</p><h2>Consent</h2><p>By continuing to use the website, you consent to the use of cookies as described in this policy.</p>`,
    legalTitle:'Legal Notice',
    legalBody:`<p>Xvitypoo is a typing practice platform developed under <strong>Xvifloo</strong>. All its content is provided for educational and productivity purposes.</p><h2>Ownership</h2><p>All logos, branding, UI design, and original code belong to Xvifloo unless otherwise stated. Unauthorized copying or redistribution is discouraged.</p><h2>External Content</h2><p>Typing text and paragraphs may be sourced from public APIs or publicly available content. We do not claim ownership of third-party text content.</p><h2>Limitation of Liability</h2><p>Xvitypoo is provided "as is" without warranties. We are not responsible for any issues, data loss, or damages resulting from use of the website.</p><h2>Contact</h2><p>For legal concerns, you may contact the developer through the contact page.</p><p><strong>All rights reserved by Xvifloo.</strong></p>`,
    aboutTitle:'About Xvitypoo',
    aboutBody:`<p>Xvitypoo is a modern typing practice platform designed to help users improve typing speed, accuracy, and productivity. It offers structured lessons that start from basic characters and gradually increase in difficulty, making it suitable for beginners and advanced users alike.</p><p>The platform includes real-time typing analytics, live WPM tracking, accuracy measurement, and mistake highlighting. Users can practice using predefined lessons, timed tests, or custom text input.</p><p>Xvitypoo also supports <strong>Unijoy Bangla typing</strong>, making it useful for users who want to improve typing skills in both English and Bangla.</p><h2>About Xvifloo</h2><p>This project is developed under the <strong>Xvifloo</strong> which focuses on building modern websites, UI designs, KLWP presets, Rainmeter skins, and custom digital tools.</p><p>Our goal is to create clean, fast, and visually stunning tools that improve digital productivity and user experience.</p>`,
    contactModalTitle:'Contact',
    contactModalBody:`<p>If you have any questions, suggestions, or custom project requests, feel free to reach out.</p><p><strong>Company:</strong> Xvifloo<br><strong>Product:</strong> Xvitypoo<br><strong>Developer:</strong> Nafizur Rahman Nafis<br><strong>Email:</strong> nafisxvi@gmail.com</p><h2>We can help with</h2><ul><li>Custom website development</li><li>UI/UX design</li><li>KLWP preset creation</li><li>Rainmeter skin customization</li><li>Custom digital tools</li></ul><p>We welcome feedback to improve our services and tools.</p>`,
    adminTitle:'Admin',
    adminBody:`<p>This website is independently developed and maintained.</p><p><strong>Owner:</strong> Nafizur Rahman Nafis<br><strong>Company:</strong> Xvifloo<br><strong>Product:</strong> Xvitypoo<br><strong>Role:</strong> Frontend Developer &amp; UI Designer</p><h2>About Xvifloo</h2><p>Xvifloo is a creative digital studio focused on building modern websites, UI designs, and custom digital experiences. The Xvitypoo platform is part of this initiative to provide a clean and modern typing practice environment.</p><p>All design, development, and maintenance are handled by the admin.</p><p style="margin-top:16px"><a href="/xvi7admin" style="color:var(--accent);font-weight:600;text-decoration:none">→ Go to Admin Panel</a></p>`,
    lbTitle:'Leaderboard',lbLoadMore:'Load More',lbYourPos:'Your Position',
    lbLoading:'Loading...',lbEmpty:'No records yet for this mode. Be the first!',
  },
  bn: {
    home:'হোম',lessons:'পাঠ',test:'টেস্ট',back:'পিছে',
    quickTest:'দ্রুত টেস্ট',customMode:'কাস্টম মোড',customTest:'কাস্টম টেস্ট',
    heroTitle1:'দ্রুত টাইপ করুন,',heroTitle2:'আরো স্মার্ট হোন',
    heroSub:'কাঠামোবদ্ধ পাঠ, রিয়েল-টাইম বিশ্লেষণ এবং Unijoy বাংলা কীবোর্ড সহ টাইপিং দক্ষতা বাড়ান।',
    badge:'লিডারবোর্ড',
    modeTyping:'টাইপিং পাঠ',modeTypingDesc:'১৬টি পাঠ × ১৬টি অংশ — ইংরেজি ও পূর্ণ Unijoy বাংলা।',
    modeQuick:'দ্রুত টেস্ট',modeQuickDesc:'সরাসরি শুরু করুন — লাইভ WPM ও নির্ভুলতা পরিমাপ।',
    modeCustom:'কাস্টম মোড',modeCustomDesc:'নিজের টেক্সট দিয়ে পার্সোনালাইজড টাইপিং টেস্ট করুন।',
    bestWpm:'সেরা WPM',bestAcc:'সেরা নির্ভুলতা',testsDone:'টেস্ট সম্পন্ন',lessonsDone:'পাঠ সম্পন্ন',timeTyped:'টাইপ সময়',
    recentResults:'সাম্প্রতিক ফলাফল',
    noticeTitle:'নোটিশ — আপডেট চলছে',
    noticeText:'Xvitypoo এখন সক্রিয় উন্নয়নের মধ্যে রয়েছে এবং নতুন ফিচার নিয়মিত আসছে। কিছু ফিচারে মাঝে মাঝে সমস্যা থাকতে পারে — আমাদের দল কঠোর পরিশ্রম করছে। আপনার ধৈর্যের জন্য ধন্যবাদ। কোনো বাগ পেলে বা পরামর্শ থাকলে?',
    noticeFeedback:'আমাদের ফিডব্যাক দিন',
    contactTitle:'যোগাযোগ করুন',contactSub:'প্রশ্ন বা পরামর্শ আছে? আমরা শুনতে চাই।',
    cfCardTitle:'বার্তা পাঠান',cfCardSub:'আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব',
    cfName:'নাম',cfEmail:'ইমেইল',cfSubject:'বিষয়',cfMessage:'বার্তা',
    cfNamePh:'আপনার নাম',cfEmailPh:'আপনার@ইমেইল.com',cfSubjectPh:'বিষয়টি কী?',cfMessagePh:'আরও বিস্তারিত লিখুন...',
    cfSendBtn:'বার্তা পাঠান',
    cfSuccess:'✓ বার্তা পাঠানো হয়েছে! শীঘ্রই উত্তর পাবেন।',
    cfError:'✗ পাঠাতে ব্যর্থ। সরাসরি ইমেইল করুন।',
    cfEmailLabel:'ইমেইল করুন',cfResponseLabel:'উত্তর সময়',cfResponseTime:'২৪ ঘণ্টার মধ্যে',
    faqTitle:'সচরাচর জিজ্ঞাসা',
    faq1q:'বাংলা টাইপিংয়ে কীভাবে সুইচ করব?',faq1a:'ইংরেজি ও বাংলা (Unijoy) সুইচ করতে Ctrl+Alt+V চাপুন। হেডারের EN/বাং বাটনেও ক্লিক করতে পারেন।',
    faq2q:'আমার WPM শূন্য দেখাচ্ছে কেন?',faq2a:'কমপক্ষে কয়েকটি শব্দ টাইপ করার পর WPM গণনা শুরু হয়। টাইপ শুরু করুন, প্রতি ৫০০ মিলিসেকেন্ডে আপডেট হবে।',
    faq3q:'পাঠের অগ্রগতি কীভাবে সেভ হয়?',faq3a:'অগ্রগতি স্বয়ংক্রিয়ভাবে ব্রাউজারের লোকাল স্টোরেজে সেভ হয়। ব্রাউজার ডেটা মুছলে অগ্রগতি রিসেট হবে।',
    faq4q:'Xvitypoo কি বিনামূল্যে?',faq4a:'হ্যাঁ! Xvitypoo সম্পূর্ণ বিনামূল্যে। কোনো রেজিস্ট্রেশন, সাবস্ক্রিপশন বা লুকানো চার্জ নেই।',
    faq5q:'নিজের টেক্সট দিয়ে অনুশীলন করা যাবে?',faq5a:'হ্যাঁ! মেনু থেকে Custom Test এ যান। আপনার টেক্সট লিখুন বা পেস্ট করুন (কমপক্ষে ৬০ শব্দ), সেভ করে রাখুন এবং যেকোনো সময় অনুশীলন করুন।',
    footerTagline:'কাঠামোবদ্ধ পাঠ ও রিয়েল-টাইম বিশ্লেষণে টাইপিং দক্ষতা বাড়ান। সবার জন্য বিনামূল্যে।',
    footerXvifloo:'Xvifloo একটি সৃজনশীল ডিজিটাল স্টুডিও যা আধুনিক ওয়েবসাইট, UI ডিজাইন এবং কাস্টম ডিজিটাল অভিজ্ঞতা তৈরিতে মনোনিবেশ করে। Xvitypoo প্ল্যাটফর্ম এই উদ্যোগের একটি অংশ যা পরিষ্কার ও আধুনিক টাইপিং অনুশীলন পরিবেশ প্রদান করে।',
    navNavigate:'নেভিগেট',navLegal:'আইনি',navAbout:'সম্পর্কে',
    footerHome:'হোম',footerLessons:'পাঠ',footerQuickTest:'দ্রুত টেস্ট',footerCustom:'কাস্টম মোড',
    terms:'শর্তাবলী',privacy:'গোপনীয়তা নীতি',cookie:'কুকি নীতি',legal:'আইনি নোটিশ',
    about:'Xvitypoo সম্পর্কে',contact:'যোগাযোগ',adminInfo:'অ্যাডমিন তথ্য',
    copyright:'©২০২৬ Xvitypoo. সর্বস্বত্ব সংরক্ষিত।',madeby:'তৈরি করেছেন',
    typingLessons:'টাইপিং পাঠ',
    lessonsScreenSub:'১৬টি পাঠ × ১০টি পার্ট — বিগিনার থেকে এক্সপার্ট।',
    start:'শুরু',pause:'বিরতি',resume:'আবার শুরু',restart:'পুনরায়',stop:'বন্ধ',
    tryAgain:'আবার চেষ্টা',goHome:'হোম',
    mobNavLabel:'নেভিগেশন',mobLangLabel:'ভাষা',mobSoundOn:'সাউন্ড চালু',mobSoundOff:'সাউন্ড বন্ধ',
    mobThemeLabel:'থিম পরিবর্তন',signIn:'সাইন ইন / রেজিস্টার',saveProgress:'অগ্রগতি সেভ করুন',
    customModeTitle:'কাস্টম টাইপিং টেস্ট',customModeSub:'নিজের টেক্সট দিয়ে পার্সোনালাইজড টাইপিং টেস্ট করুন।',
    customSave:'সেভ',customLoad:'লোড',customTitlePh:'টেক্সটের শিরোনাম (ঐচ্ছিক)',
    customTextPh:'এখানে আপনার টেক্সট পেস্ট বা টাইপ করুন...',customTimeLabel:'সময়সীমা:',customStartBtn:'টেস্ট শুরু করুন',
    termsTitle:'শর্তাবলী',
    termsBody:`<p>Xvitypoo-এ স্বাগতম, যা <strong>Xvifloo</strong>-এর একটি পণ্য। এই ওয়েবসাইট ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।</p><h2>সেবার ব্যবহার</h2><p>Xvitypoo কাঠামোবদ্ধ পাঠ ও রিয়েল-টাইম ফিডব্যাকের মাধ্যমে টাইপিং দক্ষতা উন্নত করতে সাহায্য করে। আপনি শুধুমাত্র শিক্ষামূলক ও উৎপাদনশীলতার উদ্দেশ্যে এই প্ল্যাটফর্ম ব্যবহার করতে সম্মত। যেকোনো অপব্যবহার কঠোরভাবে নিষিদ্ধ।</p><h2>মেধাস্বত্ব</h2><p>এই ওয়েবসাইটের সমস্ত ডিজাইন উপাদান, ব্র্যান্ডিং, লোগো ও কন্টেন্ট Xvitypoo ও Xvifloo-এর সম্পত্তি। অননুমোদিত অনুলিপি নিরুৎসাহিত।</p><h2>সেবার প্রাপ্যতা</h2><p>আমরা সর্বদা প্ল্যাটফর্ম সচল রাখার চেষ্টা করি, তবে নিরবচ্ছিন্ন অ্যাক্সেসের নিশ্চয়তা দিতে পারি না।</p><h2>ব্যবহারকারীর দায়িত্ব</h2><p>এই প্ল্যাটফর্ম কীভাবে ব্যবহার করবেন তার দায়িত্ব আপনার।</p><h2>শর্ত গ্রহণ</h2><p>Xvitypoo ব্যবহার অব্যাহত রেখে আপনি এই শর্তাবলী মেনে নিচ্ছেন।</p>`,
    privacyTitle:'গোপনীয়তা নীতি',
    privacyBody:`<p>আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।</p><h2>তথ্য সংগ্রহ</h2><p>Xvitypoo স্বেচ্ছায় প্রদান না করলে কোনো ব্যক্তিগত তথ্য সংগ্রহ করে না।</p><h2>লোকাল স্টোরেজ</h2><p>টাইপিং পছন্দ, থিম সেটিং ও পারফরম্যান্স ডেটা ব্রাউজারে সংরক্ষিত হতে পারে।</p><h2>তৃতীয় পক্ষের কন্টেন্ট</h2><p>কিছু টাইপিং টেক্সট পাবলিক API থেকে আনা হতে পারে।</p><h2>ডেটা শেয়ারিং</h2><p>আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না।</p><h2>নিরাপত্তা</h2><p>আমরা প্ল্যাটফর্ম নিরাপদ রাখতে যুক্তিসঙ্গত পদক্ষেপ নিই।</p><p>Xvitypoo ব্যবহার করে আপনি এই নীতিতে সম্মত হচ্ছেন।</p>`,
    cookieTitle:'কুকি নীতি',
    cookieBody:`<p>Xvitypoo ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকি ও লোকাল স্টোরেজ ব্যবহার করে।</p><h2>আমরা কী সংরক্ষণ করি</h2><p>কুকি থিম পছন্দ, ভাষা নির্বাচন ও সেরা স্কোর সংরক্ষণ করতে পারে।</p><h2>বিজ্ঞাপন কুকি নেই</h2><p>আমরা বিজ্ঞাপন বা ব্যবহারকারী ট্র্যাকিংয়ের জন্য কুকি ব্যবহার করি না।</p><h2>কুকি ব্যবস্থাপনা</h2><p>ব্রাউজার সেটিং থেকে কুকি নিষ্ক্রিয় করতে পারবেন।</p><h2>সম্মতি</h2><p>ওয়েবসাইট ব্যবহার অব্যাহত রেখে আপনি কুকি ব্যবহারে সম্মত হচ্ছেন।</p>`,
    legalTitle:'আইনি নোটিশ',
    legalBody:`<p>Xvitypoo হল <strong>Xvifloo</strong>-এর অধীনে তৈরি একটি টাইপিং অনুশীলন প্ল্যাটফর্ম।</p><h2>মালিকানা</h2><p>সমস্ত লোগো, ব্র্যান্ডিং ও মূল কোড Xvifloo-এর সম্পত্তি।</p><h2>বাহ্যিক কন্টেন্ট</h2><p>টাইপিং টেক্সট পাবলিক API থেকে নেওয়া হতে পারে।</p><h2>দায়বদ্ধতার সীমাবদ্ধতা</h2><p>Xvitypoo "যেমন আছে" ভিত্তিতে প্রদান করা হয়।</p><h2>যোগাযোগ</h2><p>আইনি উদ্বেগের জন্য যোগাযোগ পেজ ব্যবহার করুন।</p><p><strong>Xvifloo-এর সকল অধিকার সংরক্ষিত।</strong></p>`,
    aboutTitle:'Xvitypoo সম্পর্কে',
    aboutBody:`<p>Xvitypoo একটি আধুনিক টাইপিং অনুশীলন প্ল্যাটফর্ম যা ব্যবহারকারীদের টাইপিং গতি, নির্ভুলতা ও উৎপাদনশীলতা উন্নত করতে ডিজাইন করা হয়েছে।</p><p>প্ল্যাটফর্মে রিয়েল-টাইম বিশ্লেষণ, লাইভ WPM ট্র্যাকিং ও ভুল হাইলাইটিং অন্তর্ভুক্ত রয়েছে।</p><p>Xvitypoo <strong>Unijoy বাংলা টাইপিং</strong> সাপোর্ট করে।</p><h2>Xvifloo সম্পর্কে</h2><p>এই প্রজেক্টটি <strong>Xvifloo</strong>-এর অধীনে তৈরি, যা আধুনিক ওয়েবসাইট, UI ডিজাইন ও কাস্টম টুল তৈরিতে মনোনিবেশ করে।</p><p>আমাদের লক্ষ্য পরিষ্কার, দ্রুত ও দৃষ্টিনন্দন টুল তৈরি করা।</p>`,
    contactModalTitle:'যোগাযোগ',
    contactModalBody:`<p>কোনো প্রশ্ন, পরামর্শ বা কাস্টম প্রজেক্টের অনুরোধ থাকলে যোগাযোগ করুন।</p><p><strong>কোম্পানি:</strong> Xvifloo<br><strong>পণ্য:</strong> Xvitypoo<br><strong>ডেভেলপার:</strong> নাফিজুর রহমান নাফিস<br><strong>ইমেইল:</strong> nafisxvi@gmail.com</p><h2>আমরা যা করতে পারি</h2><ul><li>কাস্টম ওয়েবসাইট ডেভেলপমেন্ট</li><li>UI/UX ডিজাইন</li><li>KLWP প্রিসেট তৈরি</li><li>Rainmeter স্কিন কাস্টমাইজেশন</li><li>কাস্টম ডিজিটাল টুল</li></ul><p>আমরা ফিডব্যাককে স্বাগত জানাই।</p>`,
    adminTitle:'অ্যাডমিন',
    adminBody:`<p>এই ওয়েবসাইটটি স্বাধীনভাবে ডেভেলপ ও রক্ষণাবেক্ষণ করা হয়।</p><p><strong>মালিক:</strong> নাফিজুর রহমান নাফিস<br><strong>কোম্পানি:</strong> Xvifloo<br><strong>পণ্য:</strong> Xvitypoo<br><strong>ভূমিকা:</strong> ফ্রন্টএন্ড ডেভেলপার ও UI ডিজাইনার</p><h2>Xvifloo সম্পর্কে</h2><p>Xvifloo একটি সৃজনশীল ডিজিটাল স্টুডিও যা আধুনিক ওয়েবসাইট, UI ডিজাইন ও কাস্টম ডিজিটাল অভিজ্ঞতা তৈরিতে মনোনিবেশ করে।</p><p>সমস্ত ডিজাইন, ডেভেলপমেন্ট ও রক্ষণাবেক্ষণ অ্যাডমিন দ্বারা পরিচালিত।</p><p style="margin-top:16px"><a href="/xvi7admin" style="color:var(--accent);font-weight:600;text-decoration:none">→ অ্যাডমিন প্যানেলে যান</a></p>`,
    lbTitle:'লিডারবোর্ড',lbLoadMore:'আরও লোড করুন',lbYourPos:'আপনার অবস্থান',
    lbLoading:'লোড হচ্ছে...',lbEmpty:'এই মোডে এখনো কোনো রেকর্ড নেই। প্রথম হন!',
  }
};

function t(key){return(I18N[S.lang]||I18N.en)[key]||(I18N.en)[key]||key;}

function setLang(lang){
  S.lang=lang;
  document.documentElement.setAttribute('data-lang',lang);
  storageSetLang(lang);
  updateLangUI();
  updateAllI18n();
  buildKb();
  /* NOTE: Lesson/part cards are NOT re-rendered on UI language change.
     Each card always displays in its own lesson language (en/bn/etc.)
     regardless of the UI language selection. */
}

function updateAllI18n(){
  /* Nav */
  _setText('nav-home',t('home'));_setText('nav-lessons',t('lessons'));
  _setText('nav-test',t('quickTest'));_setText('back-btn-text',t('back'));
  /* Hero */
  _setText('hero-title-1',t('heroTitle1'));_setText('hero-title-2',t('heroTitle2'));
  _setText('hero-sub',t('heroSub'));_setText('hero-badge-text',t('badge'));
  /* Mode cards */
  _setText('mc-title-typing',t('modeTyping'));_setText('mc-desc-typing',t('modeTypingDesc'));
  _setText('mc-title-quick',t('modeQuick'));_setText('mc-desc-quick',t('modeQuickDesc'));
  _setText('mc-title-custom',t('modeCustom'));_setText('mc-desc-custom',t('modeCustomDesc'));
  /* Stats */
  _setText('lbl-best-wpm',t('bestWpm'));_setText('lbl-best-acc',t('bestAcc'));
  _setText('lbl-tests-done',t('testsDone'));_setText('lbl-lessons-done',t('lessonsDone'));
  _setText('lbl-time-typed',t('timeTyped'));_setText('lbl-recent',t('recentResults'));
  /* Notice */
  _setText('notice-title',t('noticeTitle'));
  const nt=document.getElementById('notice-text');
  if(nt)nt.innerHTML=t('noticeText')+' <a href="#" onclick="document.getElementById(\'contact-section\').scrollIntoView({behavior:\'smooth\'});return false" class="notice-link">'+t('noticeFeedback')+'</a>.';
  /* Contact section */
  _setText('contact-title-text',t('contactTitle'));_setText('contact-sub-text',t('contactSub'));
  _setText('cf-card-title',t('cfCardTitle'));_setText('cf-card-sub',t('cfCardSub'));
  _setText('cf-label-name',t('cfName'));_setText('cf-label-email',t('cfEmail'));
  _setText('cf-label-subject',t('cfSubject'));_setText('cf-label-message',t('cfMessage'));
  _setPH('cf-name',t('cfNamePh'));_setPH('cf-email',t('cfEmailPh'));
  _setPH('cf-subject',t('cfSubjectPh'));_setPH('cf-message',t('cfMessagePh'));
  _setText('cf-send-btn-text',t('cfSendBtn'));
  _setText('cf-email-label',t('cfEmailLabel'));_setText('cf-response-label',t('cfResponseLabel'));
  _setText('cf-response-time',t('cfResponseTime'));
  /* FAQ */
  _setText('faq-title-lbl',t('faqTitle'));
  _setText('faq-1q',t('faq1q'));_setText('faq-1a',t('faq1a'));
  _setText('faq-2q',t('faq2q'));_setText('faq-2a',t('faq2a'));
  _setText('faq-3q',t('faq3q'));_setText('faq-3a',t('faq3a'));
  _setText('faq-4q',t('faq4q'));_setText('faq-4a',t('faq4a'));
  _setText('faq-5q',t('faq5q'));_setText('faq-5a',t('faq5a'));
  /* Footer */
  _setText('footer-tagline-text',t('footerTagline'));
  _setText('footer-xvifloo-desc',t('footerXvifloo'));
  _setText('footer-admin-xvifloo-desc',t('footerXvifloo'));
  _setText('footer-nav-title',t('navNavigate'));_setText('footer-legal-title',t('navLegal'));
  _setText('footer-about-title',t('navAbout'));
  _setText('footer-link-home',t('footerHome'));_setText('footer-link-lessons',t('footerLessons'));
  _setText('footer-link-quicktest',t('footerQuickTest'));_setText('footer-link-custom',t('footerCustom'));
  _setText('footer-link-terms',t('terms'));_setText('footer-link-privacy',t('privacy'));
  _setText('footer-link-cookie',t('cookie'));_setText('footer-link-legal',t('legal'));
  _setText('footer-link-about',t('about'));_setText('footer-link-contact',t('contact'));
  _setText('footer-link-admin',t('adminInfo'));
  _setText('footer-copy-text',t('copyright'));_setText('footer-made-text',t('madeby'));
  /* Lessons screen */
  _setText('lessons-screen-title',t('typingLessons'));
  _setText('lessons-screen-sub',t('lessonsScreenSub'));
  /* Mobile menu */
  _setText('mob-nav-label',t('mobNavLabel'));_setText('mob-lang-label',t('mobLangLabel'));
  _setText('mob-lbl-home',t('home'));_setText('mob-lbl-lessons',t('lessons'));
  _setText('mob-lbl-test',t('quickTest'));_setText('mob-lbl-custom',t('customMode'));
  _setText('mob-thm-lbl',t('mobThemeLabel'));
  /* Custom mode modal */
  _setText('custom-mode-title',t('customModeTitle'));_setText('custom-mode-sub',t('customModeSub'));
  _setPH('custom-save-name',t('customTitlePh'));_setPH('custom-text-area',t('customTextPh'));
  _setText('custom-time-label',t('customTimeLabel'));_setText('custom-start-btn',t('customStartBtn'));
  /* Leaderboard */
  _setText('lb-modal-title',t('lbTitle'));_setText('lb-more-btn',t('lbLoadMore'));
  _setText('lb-your-pos-label',t('lbYourPos'));
  /* Legal modals */
  _buildLegalModals();
  /* Custom test screen */
  updateCustomScreenI18n();
}

function _buildLegalModals(){
  var mods=[
    ['modal-terms-title','modal-terms-body','termsTitle','termsBody'],
    ['modal-privacy-title','modal-privacy-body','privacyTitle','privacyBody'],
    ['modal-cookie-title','modal-cookie-body','cookieTitle','cookieBody'],
    ['modal-legal-title','modal-legal-body','legalTitle','legalBody'],
    ['modal-about-title','modal-about-body','aboutTitle','aboutBody'],
    ['modal-contact-title','modal-contact-body','contactModalTitle','contactModalBody'],
    ['modal-admin-title','modal-admin-body','adminTitle','adminBody'],
  ];
  mods.forEach(function(m){
    _setText(m[0],t(m[2]));_setHTML(m[1],t(m[3]));
  });
}

function _setText(id,val){const e=document.getElementById(id);if(e)e.textContent=val;}
function _setHTML(id,html){const e=document.getElementById(id);if(e)e.innerHTML=html;}
function _setPH(id,val){const e=document.getElementById(id);if(e)e.placeholder=val;}

function updateLangUI(){
  ['btn-en','mob-btn-en'].forEach(function(id){const e=document.getElementById(id);if(e)e.classList.toggle('active',S.lang==='en');});
  ['btn-bn','mob-btn-bn'].forEach(function(id){const e=document.getElementById(id);if(e)e.classList.toggle('active',S.lang==='bn');});
}

function updateHeroText(){updateAllI18n();}

function handleLangShortcut(e){
  if(e.ctrlKey&&e.altKey&&e.key==='v'){e.preventDefault();setLang(S.lang==='en'?'bn':'en');return true;}
  return false;
}

function detectLockKeys(e){
  if(e.getModifierState){
    const caps=e.getModifierState('CapsLock');
    const num=e.getModifierState('NumLock');
    const scroll=e.getModifierState('ScrollLock');
    if(caps!==undefined)S.capsOn=caps;
    if(num!==undefined)S.numLockOn=num;
    if(scroll!==undefined)S.scrollLockOn=scroll;
    updateLockIndicators();
  }
}

function updateLockIndicators(){
  var inds=[
    ['ind-caps',S.capsOn,true],['ind-caps-mob',S.capsOn,true],['kb-ind-caps',S.capsOn,true],
    ['ind-num',S.numLockOn,false],['ind-num-mob',S.numLockOn,false],['kb-ind-num',S.numLockOn,false],
    ['ind-scroll',S.scrollLockOn,false],['ind-scroll-mob',S.scrollLockOn,false],['kb-ind-scroll',S.scrollLockOn,false],
  ];
  inds.forEach(function(a){_setInd(a[0],a[1],a[2]);});
  updateCapsLockKey();
}

function _setInd(id,on,isCaps){
  var el=document.getElementById(id);if(!el)return;
  var dot=el.querySelector('.ind-light,.ind-dot');
  if(dot){
    if(on){dot.style.background=isCaps?'var(--warn)':'var(--accent)';dot.style.boxShadow=isCaps?'0 0 8px rgba(245,158,11,.6)':'0 0 8px rgba(0,212,177,.6)';}
    else{dot.style.background='var(--text-faint)';dot.style.boxShadow='none';}
  }
  el.style.opacity=on?'1':'0.4';
}

/* ── Type mode (home screen buttons) ── */
function setTypeMode(mode) {
  S.typeMode = mode;
  document.querySelectorAll('.type-opt[data-mode]').forEach(function(b) {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  /* Keep UI language unchanged; language buttons control it explicitly. */
  /* Show matching lesson tab without changing language */
  var tabMap = { en:'en', bn:'bn', num:'num', sym:'sym', code:'html', css:'css', js:'js' };
  var tab = tabMap[mode];
  if (tab && typeof buildLessonsGrid === 'function') buildLessonsGrid(tab);
}

/* ── Lesson tab sync ── */
function syncLessonTabs(tab) {
  document.querySelectorAll('.ltab').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === tab);
  });
}

/* ── Mobile menu toggle ── */
function toggleMobileMenu() {
  var menu    = document.getElementById('mobile-menu');
  var overlay = document.getElementById('mob-overlay');
  var hamBtn  = document.getElementById('hamburger-btn');
  if (!menu) return;
  var isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (hamBtn)  hamBtn.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (hamBtn)  hamBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  var menu    = document.getElementById('mobile-menu');
  var overlay = document.getElementById('mob-overlay');
  var hamBtn  = document.getElementById('hamburger-btn');
  if (menu)    menu.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (hamBtn)  hamBtn.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Custom Test screen i18n update ── */
function updateCustomScreenI18n() {
  _setText('custom-screen-title', t('customModeTitle'));
  _setText('custom-screen-sub',   t('customModeSub'));
  _setText('custom-write-title',  S.lang==='bn' ? 'আপনার টেক্সট লিখুন' : 'Write Your Text');
  _setText('custom-saved-title',  S.lang==='bn' ? 'সেভ করা টেক্সটগুলো' : 'Saved Texts');
  _setText('custom-time-label',   t('customTimeLabel'));
  _setText('custom-save-btn-text',t('customSave'));
  _setText('custom-start-btn',    t('customStartBtn'));
  _setPH('custom-save-name',      t('customTitlePh'));
  _setPH('custom-text-area',      t('customTextPh'));
  _setText('saved-texts-empty',   S.lang==='bn'
    ? 'এখনো কোনো টেক্সট সেভ করা নেই।\nউপরে কিছু লিখে সেভ করুন!'
    : 'No saved texts yet.\nWrite something above and save it!');
}


/* updateCustomScreenI18n updateAllI18n এর ভেতরেই call হবে */