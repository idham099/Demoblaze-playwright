<<<<<<< HEAD
# 🚀 DemoBlaze : Framework Automation dengan Playwright

[![Playwright Tests](https://github.com/idham099/Demoblaze-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/idham099/Demoblaze-playwright/actions)
[![View Report](https://img.shields.io/badge/View-Live_Report-brightgreen?style=for-the-badge&logo=github)](https://idham099.github.io/Demoblaze-playwright/)

Proyek ini adalah framework automation pengujian fungsionalitas UI untuk website **DemoBlaze**. Framework ini dibangun dengan standar industri untuk memastikan reliabilitas, skalabilitas, dan laporan yang transparan bagi tim pengembang maupun pemangku kepentingan bisnis.

## 📊 Live Report
Hasil eksekusi tes terbaru dapat diakses secara publik. Dashboard ini mencakup tren riwayat pengujian, kategori fitur, dan bukti visual untuk setiap test case.
👉 **[Lihat Allure Test Report](https://idham099.github.io/Demoblaze-playwright/)**

## 🌟 Fitur Kunci
* **Page Object Model (POM)**: Arsitektur kode yang terorganisir untuk meningkatkan *reusability* dan kemudahan pemeliharaan.
* **Data-Driven Testing (DDT)**: Integrasi dengan file Excel (`.xlsx`) untuk manajemen data uji yang fleksibel.
* **CI/CD Pipeline**: Integrasi penuh dengan **GitHub Actions** untuk pengujian otomatis pada setiap *push* atau *pull request*.
* **Advanced Reporting**: Menggunakan **Allure Report** untuk visualisasi data, grafik tren, dan pengelompokan fitur (Behaviors).
* **Automated Evidence**: Pengambilan Screenshot (Alert & UI State) serta Video secara otomatis pada setiap langkah krusial.

## 🛠️ Tech Stack
- **Engine**: [Playwright](https://playwright.dev/)
- **Language**: JavaScript (Node.js)
- **Reporting**: Allure Report
- **CI/CD**: GitHub Actions
- **Data Provider**: XLSX Library

## 🏗️ Struktur Project
```text
├── tests/               # File skrip pengujian (.spec.js)
├── pageobjects/         # Implementasi Page Object Model (Encapsulation UI)
├── data/                # Test data provider (Excel files)
├── .github/workflows/   # Konfigurasi CI/CD (GitHub Actions YAML)
├── playwright.config.js # Konfigurasi Engine & Reporters
└── package.json         # Dependensi & Script Shortcuts
```

## 🚀 Cara menjalankan di Local

1. **Clone the repository**
   ```bash
    git clone [https://github.com/idham099/Demoblaze-playwright.git](https://github.com/idham099/Demoblaze-playwright.git)
    cd Demoblaze-playwright

2. **Install dependencies**
   ```bash
    npm install

3. **Install Playwright Browsers**
   ```bash
    npx playwright install

4. **Exekusi semua Tests**
   ```bash
    npx playwright test tests

5. **Generate & buka Allure Report**
   ```bash
    npx allure generate allure-results --clean -o allure-report
    npx allure open allure-report

---
##
Dibuat dengan 😭 oleh Ainul idham.


