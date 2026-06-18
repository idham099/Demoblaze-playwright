# 🚀 DemoBlaze : Playwright Framework Automation

[![Playwright Tests](https://github.com/idham099/Demoblaze-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/idham099/Demoblaze-playwright/actions)
[![View Report](https://img.shields.io/badge/View-Live_Report-brightgreen?style=for-the-badge&logo=github)](https://idham099.github.io/Demoblaze-playwright/)

This project is a UI functionality testing automation framework for the **[DemoBlaze website](https://www.demoblaze.com/index.html)**. The framework is built to industry standards to ensure reliability, scalability, and transparent reporting for both the development team and business stakeholders.

## 📊 Live Report
The results of recent test executions are publicly accessible. This dashboard includes historical test trends, feature categories, and visual evidence for each test case.
👉 **[View Allure Test Report](https://idham099.github.io/Demoblaze-playwright/)**


Here is the demo link : **[Demo Test](https://www.youtube.com/watch?v=04DpSLYXLNA)**


Here is the article : **[Article](https://ainul-idhamid.blogspot.com/2025/12/project-demoblaze-end-to-end-automation.html)**

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

### 2. Product & Cart Management
* **Positive:**
    * Ensure each category (Phones, Laptops, Monitors) displays a relevant product list.
    * Verify product details (Name, Price, Description) match the Excel reference data.
    * Successfully add a product to the cart and validate the success alert message.
    * Successfully remove a product from the cart and ensure the UI table is updated.
* **Negative:**
    * Attempting to add product to cart while connection is lost (Verifying *retry* mechanism).

### 3. Checkout Flow
* **Positive:**
    * **TC_CH001 (Successful Purchase):** Fill out the "Place Order" form with complete data (Name, Country, City, Credit Card, etc.) and verify the purchase receipt.
* **Negative:**
    * **TC_CH002 (Missing Name):** Try checking out with the Name field blank.
    * **TC_CH003 (Missing Credit Card):** Try checking out with the Credit Card field blank.
    * **Expectation:** The system displays the alert "Please fill out Name and Creditcard."

### 4. Information and Support Features
* **Positive:**
    * Successfully sent a support message via the "Contact" form with a valid email address.
    * Ensured the "About Us" modal could load the promotional video correctly.
* **Negative:**
    * Submitting a contact form with an invalid email format or empty fields.

---

## 📊 Scenario Matrix vs Test File

| Category | File Name | Scenario Type |
| :--- | :--- | :--- |
| Login | `01_ui.login.pom.spec.js` | Positive |
| Signup | `02_ui.signup.spec.js` | Positive & Negative |
| Product | `03_ui.product.spec.js` | Positive |
| Cart | `04_ui.add_to_cart.spec.js` | Positive |
| Cart | `05_ui.cart_delete.spec.js` | Positive |
| Checkout | `07_ui.checkout.spec.js` | Positive |
| Checkout | `08_ui.checkout_negative.spec.js` | Negative |
| Contact | `11_ui.contact.spec.js` | Positive |

## 🛠️ Tech Stack
- **Engine**: [Playwright](https://playwright.dev/)
- **Language**: JavaScript (Node.js)
- **Reporting**: Allure Report
- **CI/CD**: GitHub Actions
- **Data Provider**: XLSX Library

## 🏗️ Project Structure
```text
├── tests/               # Test script file (.spec.js)
├── pageobjects/         # Implementation of Page Object Model (Encapsulation UI)
├── data/                # Test data provider (Excel files)
├── .github/workflows/   # CI/CD Configuration (GitHub Actions YAML)
├── playwright.config.js # Engine and Reporters Configuration
└── package.json         # Dependencies & Script Shortcuts
```

## 🚀 How to run on Local

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

4. **Execute all Tests**
   ```bash
    npx playwright test tests

5. **Generate & Open Allure Report**
   ```bash
    npx allure generate allure-results --clean -o allure-report
    npx allure open allure-report

---
##
Made with 😭 by Ainul Idham.


