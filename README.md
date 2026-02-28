# 📅 تقويم أحمد الشخصي 2026

تطبيق Next.js 15 لإدارة التقويم الشخصي مع واجهة مستخدم أنيقة ومتجاوبة.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ المميزات

- 📆 **تقويم مرئي** - عرض شهري مع إمكانية التنقل بين الأشهر
- 📋 **إدارة المواعيد** - إضافة، تعديل، وحذف المواعيد
- 📊 **إحصائيات** - إجمالي المواعيد، مواعيد اليوم، مواعيد الأسبوع
- 🔄 **تحديث تلقائي** - تحديث البيانات كل 10 ثوانٍ
- 🌙 **RTL Support** - دعم كامل للعربية

## 🚀 طريقة التشغيل محليًا

### 1. استنساخ المشروع

```bash
git clone https://github.com/ahmedfortest01-spec/ahmed-personal-calendar-2026.git
cd ahmed-personal-calendar-2026
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. إنشاء ملف البيئة

أنشئ ملف `.env.local` وضع فيه:

```env
GITHUB_TOKEN=your_github_token_here
```

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح http://localhost:3000

## ☁️ النشر على Vercel

### الطريقة الأولى: من لوحة Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. سجّل دخولك باستخدام GitHub
3. اضغط "Add New..." → "Project"
4. اختر مستودع `ahmed-personal-calendar-2026`
5. في إعدادات Environment Variables أضف:
   - `GITHUB_TOKEN` = توكن GitHub الخاص بك
6. اضغط "Deploy"

### الطريقة الثانية: من سطر الأوامر

```bash
npm i -g vercel
vercel
```

اتبع التعليمات على الشاشة.

## 💬 استخدام الأوامر في الشات

بعد نشر الموقع، يمكنك استخدام هذه الأوامر معي:

### إضافة موعد
```
أضف موعد: اجتماع عمل يوم الجمعة 4 مساءً
```

### عرض مواعيد اليوم
```
عرض مواعيدي اليوم
```

### عرض الأسبوع
```
عرض مواعيدي الأسبوع
```

### حذف موعد
```
احذف موعد اجتماع عمل
```

### تعديل موعد
```
عدل موعد اجتماع عمل إلى يوم السبت 5 مساءً
```

## 🔧 كيفية عمل النظام

1. **الواجهة**: Next.js 15 + Tailwind CSS
2. **التخزين**: ملف `events.json` في GitHub
3. **التواصل**: 
   - الموقع يقرأ البيانات مباشرة من GitHub Raw (كل 10 ثوانٍ)
   - الأوامر من الشات يتم تنفيذها عبر GitHub API

## 📁 هيكل المشروع

```
ahmed-personal-calendar-2026/
├── app/
│   ├── api/calendar/    # API للتعامل مع GitHub
│   ├── globals.css      # أنماط CSS
│   ├── layout.tsx       # هيكل الصفحة
│   └── page.tsx        # الصفحة الرئيسية
├── public/             # الملفات الثابتة
├── .env.local         # متغيرات البيئة
├── package.json       # зависимости
├── tailwind.config.ts # إعدادات Tailwind
└── tsconfig.json     # إعدادات TypeScript
```

## 📝 ملاحظات

- التوكن يجب أن يملك صلاحية `repo` للتعامل مع الملفات
- الموقع يتصل مباشرة بـ GitHub Raw API للقراءة
- التحديثات تتم عبر API route داخلي

## 📄 الرخصة

MIT License
