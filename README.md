# 🚀 Event-Driven Action Service

A centralized service responsible for handling **Audit Logs, Notifications, Emails, and other side effects** using an event-driven architecture.

---

## 📌 Overview

This service listens to events published by other microservices and performs different actions such as:

- 🧾 Audit Logging
- 📧 Email Sending
- 🔔 Notifications
- 📱 SMS (optional)
- 📊 Future extensible actions

---

## 🧠 Core Idea

Instead of handling everything inside your main services, you:

1. Emit an **event**
2. This service **listens**
3. It **decides what to do**
4. Executes multiple actions

---

## ⚙️ Architecture
