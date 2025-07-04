# 🛂 Bitespeed Backend Task

This project implements the identity reconciliation logic as per the [Bitespeed backend task](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-1fb21bb2a930802eb896d4409460375c). It uses **Node.js**, **Express**, and **MongoDB** to resolve multiple user identities based on phone numbers and emails.

---

## 🚀 Live API Endpoint

**POST** https://bitespeed-po4e.onrender.com/identify

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Hosted on [Render](https://render.com)

---

## 📄 API Usage

### ➤ `POST /identify`

This endpoint accepts a JSON body with either or both `email` and `phoneNumber`, and responds with the resolved contact identity.

#### ✅ Request Body

```json
{
  "email": "george@hillvalley.edu",
  "phoneNumber": "717171"
}

```
## 📸 API Working Proof (Screenshot)

<img width="1067" alt="image" src="https://github.com/user-attachments/assets/d5b9ed28-77c9-4437-b482-fa08bf4b4f92" />

<img width="1110" alt="image" src="https://github.com/user-attachments/assets/85eedfa4-9db8-494d-aeed-3e1eec29c786" />

<img width="1129" alt="image" src="https://github.com/user-attachments/assets/38923cf0-2d36-4485-99a6-9806318b0c91" />



