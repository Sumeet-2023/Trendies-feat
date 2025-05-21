# Trendies Product Rating Feature

This repository contains the implementation of the **Product Rating** feature for the Trendies marketplace challenge. This feature allows buyers to leave ratings and comments on products after making a purchase.

## 🔧 Feature: Product Rating

### ✅ What It Does
- Buyers can submit a **star rating** (1 to 5) and a **text comment** after purchase.
- Each product displays the average rating and total number of reviews.
- Buyers can **replace** their own reviews.

### ⚙️ Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS, Shadcn UI
- **Backend:** NestJS, Prisma, PostgreSQL
- **Monorepo Tooling:** TypeScript, PNPM

---

## 🚀 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/Sumeet-2023/Trendies-feat.git
cd Trendies-feat/server
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup
```bash
npx prisma migrate dev --name init
pnpm run seed
```
### 4. Start the server
```bash
pnpm run start:dev
```

- **Frontend:** 
```bash
pnpm install
pnpm run dev
```

---

## 🧪 API Endpoints (NestJS)

### Create a Rating
`POST /ratings/user/:userId/product/:productId`
```json
{
  "userId": 1,
  "productId": 1,
  "stars": 5,
  "comment": "Amazing product!"
}
```

### Get All Ratings for a Product
`GET /ratings/product/:productId`

### Get Limited number of Products
`GET /products/featured`

### Get a User’s Rating for a Product
`GET /ratings/user/:userId/product/:productId`

### Delete a User's Rating
`DELETE /ratings/user/:userId/product/:productId`

---


## 🔍 Improvements that can be made
- Only Authenticated user can give rating 
- Average rating calculation should happen in backend 
- User can delete or edit their rating

---

## 📦 Live Demo
Visit: [https://trendies-feat.vercel.app](https://trendies-feat.vercel.app/)

---
