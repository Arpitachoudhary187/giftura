# 🎁 Giftura — Complete Setup Guide

## Step 1 — Open this folder in VS Code
File → Open Folder → select the `giftura` folder

## Step 2 — Setup Backend

Open terminal (Ctrl + `) and run:

```
cd backend
npm install
```

Create a file called `.env` inside the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/giftura
JWT_SECRET=gifturasecretkey123456789
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-openai-key-here
RAZORPAY_KEY_ID=rzp_test_000000000000
RAZORPAY_KEY_SECRET=testsecret000000000000
FRONTEND_URL=http://localhost:3000
```

Replace MONGODB_URI with your actual MongoDB Atlas connection string.

Seed the database (adds 12 products + admin account):
```
npm run seed
```

Start the backend:
```
npm run dev
```

You should see:
  ✅ MongoDB connected
  🚀 Server running on http://localhost:5000

## Step 3 — Setup Frontend

Open a NEW terminal tab (click + in terminal), then run:

```
cd frontend
npm install
npm run dev
```

You should see:
  ▲ Next.js 14
  - Local: http://localhost:3000

## Step 4 — Open in Browser

Go to: http://localhost:3000

## Step 5 (Optional) — Setup AI Service

Open another terminal tab:

```
cd ai-service
python -m venv venv
venv\Scripts\activate       (Windows)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Test Login Accounts

After running seed:
- Admin:  admin@giftura.com  /  admin123
- User:   user@giftura.com   /  user123

## Coupons

- GIFT20   → ₹200 off
- DIWALI   → ₹500 off
- FIRST100 → ₹100 off
