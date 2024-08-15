/** Common config for bookstore. */
require("dotenv").config();

const DB_URI = (process.env.NODE_ENV === "test") 
  ? "books_test"
  : "books";

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD


module.exports = { DB_URI, SECRET_KEY, DB_PASSWORD, DB_USERNAME };