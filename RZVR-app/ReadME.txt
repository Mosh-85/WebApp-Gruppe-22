npm i sqlite3
sqlite3 --version

npm i drizzle-orm
npm i -D drizzle-kit
npx drizzle-kit studio

npx drizzle-kit migrate
npx tsx src/db/for-testing/seed-admin.ts