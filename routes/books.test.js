const request = require("supertest");
const jsonschema = require("jsonschema");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");
const ExpressError = require("../expressError");

describe("Books route test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books");

        let book1 = await Book.create({
            isbn: "0691023518",
            amazon_url: "http://a.co/eobPtX2",
            author: "RL Stine",
            language: "english",
            pages: 138,
            publisher: "Scholastic",
            title: "Night of the Living Dummy",
            year: 1996,
        });
    });

    describe("Posting new books", function() {
        test("Can post book", async function() {
            let res = await request(app).post("/books/").send({
                isbn: "0691161519",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017,
            });

            expect(res.statusCode).toEqual(201)
            expect(res.body).toEqual({
                book: {
                isbn: "0691161519",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017,
                },
            });
        });

        test("Does not accept incomplete JSON", async function() {
            let res = await request(app).post("/books/").send({
                isbn: "0691161519",
            });

            expect(res.statusCode).toBe(400);
        });

        test("Does not accept incorrect JSON", async function() {
            let res = await request(app).post("/books/").send({
                isbn: 123141,
                amazon_url: 1341,
                author: 15365,
                language: 1242141,
                pages: "onetwo",
                publisher: 134124,
                title: 23123,
                year: "fivethousand",
            });

            expect(res.statusCode).toBe(400);
        });
    });

    describe("GET /books", function() {
        test("Get all books", async function() {
            let res = await request(app).get("/books");

            expect(res.body).toEqual({
                books: [
                    {
                        isbn: "0691023518",
                        amazon_url: "http://a.co/eobPtX2",
                        author: "RL Stine",
                        language: "english",
                        pages: 138,
                        publisher: "Scholastic",
                        title: "Night of the Living Dummy",
                        year: 1996,
                    },
                ],
            });
        });
    });

    describe("GET /books by ISBN", function() {
        test("Get book by ISBN", async function() {
            let res = await request(app).get('/books/0691161518')

            expect(res.body).toEqual({
                book:{
                    isbn: "0691023518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "RL Stine",
                    language: "english",
                    pages: 138,
                    publisher: "Scholastic",
                    title: "Night of the Living Dummy",
                    year: 1996,
                }
            });
        })

        test("No ISBN", async function() {
            let res = await request(app).get('/books/123456')

            expect(res.statusCode).toBe(404)
        })
    })

    describe("PUT /books by ISBN", function() {
        test("Put book by ISBN", async function() {
            let res = await request(app)
            .put('/books.0691161518')
            .send({
                isbn: "0691023518",
                amazon_url: "http://a.co/eobPtX2",
                author: "RL Stine",
                language: "english",
                pages: 138,
                publisher: "Scholastic",
                title: "Night of the Living Dummy",
                year: 1996,
            });

            expect(res.body).toEqual({
                book: {
                    isbn: "0691023518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "RL Stine",
                    language: "english",
                    pages: 138,
                    publisher: "Scholastic",
                    title: "Night of the Living Dummy",
                    year: 1996,
                }
            })
        })

        test("Fail to put book by non-existent ISBN", async function() {
            let res = (await request(app)
              .put('/books.123456')
              .send({
                author: "Lemony Snicket",
                language: "French",
                publisher: "Penguin",
                title: "The Vile Village"
            }))

            expect(res.statusCode).toBe(400)
        })

        test("Failt to put book from bad JSON", async function() {
            let res = (await request(app)
              .put('/books/0691161518')
              .send({
                author: "Lemony Snicket",
                language: "French",
                publisher: "Penguin",
                title: "The Vile Village"
              }))

            expect(res.statusCode).toBe(400)
        })
    })

    describe("DELETE /books by ISBN", function() {
        test("Delete book by ISBN", async function() {
            let res = await request(app).delete('/books/0691161518')

            expect(res.body).toEqual({ message: "Book deleted" })
        })

        test("Delete book with non-existent ISBN", async function() {
            let res = await request(app).delete('/books/123456')

            expect(res.statusCode).toBe(404)
        })
    })

    afterAll(async function() {
        await db.end();
    });
});