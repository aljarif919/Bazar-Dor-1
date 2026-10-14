# BazarDor — Final setup guide (বাংলা)

## কেন Signup কাজ করছে না?
এই project-এ Better Auth + PostgreSQL আছে। আগের কোডে `localhost`-এর একটি ভুয়া PostgreSQL fallback ছিল; সেটি আসল Database নয়। তাই Signup-এ “অনুরোধ সম্পন্ন হয়নি” দেখাতে পারে।

## লোকাল VS Code
1. ZIP Extract করে যে folder-এ `package.json` আছে সেটি VS Code-এ খুলুন।
2. `.env.example` কপি করে `.env.local` নামে রাখুন।
3. `DATABASE_URL`-এ আপনার বাস্তব PostgreSQL connection string দিন (যেমন Neon-এর Connect পেজ থেকে)।
4. `BETTER_AUTH_SECRET`-এ random 32-byte secret দিন। PowerShell:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
5. `BETTER_AUTH_URL=http://localhost:3000` রাখুন। যদি Next.js অন্য port (যেমন 3001) ব্যবহার করে, সেই port দিন।
6. `npm install`
7. `npx @better-auth/cli@latest migrate`
8. `npm run dev`
9. `/signup`-এ নতুন account বানিয়ে `/signin`-এ login করুন।

## Netlify
Netlify → Site configuration → Environment variables-এ একই PostgreSQL `DATABASE_URL`, একই `BETTER_AUTH_SECRET`, এবং `BETTER_AUTH_URL=https://YOUR-SITE.netlify.app` দিন। তারপর production Database-এ schema migration একবার চালান এবং redeploy করুন।

## জরুরি সীমাবদ্ধতা
শুধু source code দিয়ে বাস্তব PostgreSQL account/connection বানানো যায় না। এই ZIP-এ code ও নির্দেশনা ঠিক করা হয়েছে, কিন্তু আপনার নিজের Database URL/secret এখানে নেই। এগুলো ছাড়া persistent signup/login-কে কার্যকর বলে নিশ্চয়তা দেওয়া সম্ভব নয়। Google/GitHub login-এর জন্য OAuth Client ID/Secret-ও আলাদা করে প্রয়োজন; email/password login-এর জন্য OAuth দরকার নেই.
