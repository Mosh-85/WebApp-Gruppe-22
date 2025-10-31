const { randomBytes, pbkdf2Sync } = require("crypto");

const ITERATIONS = 100000;
const KEYLEN = 64;
const DIGEST = "sha512";

const password = process.argv[2] || "password";
const salt = randomBytes(16).toString("hex");
const derived = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString("hex");
console.log(`${salt}:${derived}`);
