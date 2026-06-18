# 🚀 DemoBlaze : Playwright Framework Automation

[![Playwright Tests](https://github.com/idham099/Demoblaze-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/idham099/Demoblaze-playwright/actions)
[![View Report](https://img.shields.io/badge/View-Live_Report-brightgreen?style=for-the-badge&logo=github)](https://idham099.github.io/Demoblaze-playwright/)

This project is a UI functionality testing automation framework for the **[DemoBlaze website](https://www.demoblaze.com/index.html)**. The framework is built to industry standards to ensure reliability, scalability, and transparent reporting for both the development team and business stakeholders.

## 📊 Live Report
The results of recent test executions are publicly accessible. This dashboard includes historical test trends, feature categories, and visual evidence for each test case.
👉 **[View Allure Test Report](https://idham099.github.io/Demoblaze-playwright/)**


Here is the demo link : **https://www.youtube.com/watch?v=04DpSLYXLNA**

<img width="1919" height="1079" alt="Screenshot 2025-12-30 121601" src="https://github.com/user-attachments/assets/7fe36c74-2c60-4f8a-8058-b2c0ea3466c0" />

<img width="1919" height="1075" alt="Screenshot 2025-12-30 121601" src="https://github.com/user-attachments/assets/95f5c2c3-2d29-4234-a61e-6bac80aeea8f" />

## 🧪 Test Scenarios

Following is a list of test scenarios implemented in this framework, covering validation of core functionality (*Happy Path*) and error handling (*Negative Path*).

### 1. Registration & Login (Identity)
* **Positive:**
    * Successfully register a new account with a unique username (using the automatic generator).
    * Successfully log in with valid credentials and verify the profile name in the navigation menu.
    * Successfully log out and confirm the user session has ended.
* **Negative:**
    * Account registration fails if the username is already in use (Alert: "This user already exists.").
    * Login fails if the password is incorrect or the username cannot be found (Alert: "Wrong password.").

### 2. Manajemen Produk & Keranjang (Cart)
* **Positif:**
    * Memastikan setiap kategori (Phones, Laptops, Monitors) menampilkan daftar produk yang relevan.
    * Verifikasi detail produk (Nama, Harga, Deskripsi) sesuai dengan data referensi Excel.
    * Berhasil menambahkan produk ke keranjang dan memvalidasi pesan alert sukses.
    * Berhasil menghapus produk dari keranjang dan memastikan tabel UI terupdate.
* **Negatif:**
    * Mencoba menambahkan produk ke keranjang saat koneksi terputus (Verifikasi mekanisme *retry*).

### 3. Proses Pembayaran (Checkout Flow)
* **Positif:**
    * **TC_CH001 (Successful Purchase):** Mengisi formulir "Place Order" dengan data lengkap (Nama, Negara, Kota, Kartu Kredit, dll) dan memverifikasi struk pembelian.
* **Negatif:**
    * **TC_CH002 (Missing Name):** Mencoba checkout dengan mengosongkan kolom Nama.
    * **TC_CH003 (Missing Credit Card):** Mencoba checkout dengan mengosongkan kolom Kartu Kredit.
    * *Ekspektasi:* Sistem menampilkan alert "Please fill out Name and Creditcard."

### 4. Fitur Informasi & Dukungan (Support)
* **Positif:**
    * Berhasil mengirim pesan dukungan melalui formulir "Contact" dengan email valid.
    * Memastikan modal "About Us" dapat memuat video promosi dengan benar.
* **Negatif:**
    * Mengirim formulir kontak dengan format email yang tidak valid atau kolom kosong.

---

## 📊 Matriks Skenario vs File Test

| Kategori | Nama File | Tipe Skenario |
| :--- | :--- | :--- |
| Login | `01_ui.login.pom.spec.js` | Positif |
| Signup | `02_ui.signup.spec.js` | Positif & Negatif |
| Product | `03_ui.product.spec.js` | Positif |
| Cart | `04_ui.add_to_cart.spec.js` | Positif |
| Cart | `05_ui.cart_delete.spec.js` | Positif |
| Checkout | `07_ui.checkout.spec.js` | Positif |
| Checkout | `08_ui.checkout_negative.spec.js` | Negatif |
| Contact | `11_ui.contact.spec.js` | Positif |

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


