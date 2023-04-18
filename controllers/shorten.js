import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

db.connect((err) => {
    if (err) throw err;
})

const isValidURL = (url) => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$',
        'i'
    );
    return pattern.test(url);
}

const createShortURL = async (url) => {
    const sql = "INSERT INTO shorturl SET ?";
    const code = Math.random().toString(36).slice(2, 7);
    const values = {
        url: url,
        code: code,
        createdOn: new Date().toISOString().slice(0, 19).replace('T', ' '),
        lastVisited: null,
        visits: 0
    };
    const query = mysql.format(sql, values);
    return new Promise((resolve, reject) => {
        db.query(query, (error, _) => {
            if (error) reject(false);
            resolve(code);
        })
    });
}

const getShortURL = async (code) => {
    var sql = "SELECT * FROM shorturl WHERE code = ?"
    var query = mysql.format(sql, [code]);
    return new Promise((resolve, reject) => {
        db.query(query, (error, result) => {
            if (error) reject(false);
            sql = "UPDATE shorturl SET visits = visits + 1, lastVisited = ? WHERE code = ?";
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            query = mysql.format(sql, [timestamp, code]);
            db.query(query, (error, _) => {
                if (error) reject(error);
            });
            resolve(result[0].url);
        });
    });
}

const getURLData = async (code) => {
    var sql = "SELECT * FROM shorturl WHERE code = ?"
    var query = mysql.format(sql, [code]);
    return new Promise((resolve, reject) => {
        db.query(query, (error, result) => {
            if (error) reject(false);
            resolve(result[0]);
        });
    });
}

export {
    createShortURL,
    getShortURL,
    getURLData,
    isValidURL
}
