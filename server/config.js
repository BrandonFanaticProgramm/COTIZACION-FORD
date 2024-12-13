const port = process.env.PORT || 8080;
const DB_HOST = process.env.DB_HOST || "junction.proxy.rlwy.net";
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || "cvAYDGboeYEAlwrIgCqsxhAQvVnxUJHe";
const DB_NAME = process.env.DB_NAME || 'railway';
const DB_PORT = process.env.DB_PORT || 58483;
module.exports = { port, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT };
