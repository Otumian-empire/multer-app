require('dotenv').config()

const { Client } = require("pg")

const client = new Client()
client
    .connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack))


module.exports = {
    create: img_path => {
        const query = `INSERT INTO image(url) VALUES ($1);`
        return client.query(query, [img_path])
    },
    read: id => {
        const query = `SELECT id, url, created_at FROM image WHERE id=$1;`
        return client.query(query, [id])
    },
    readAll: () => {
        const query = `SELECT id, url, created_at FROM image;`
        return client.query(query)
    },
    update: params => {
        const query = `UPDATE image SET url =$2 WHERE id=$1;`
        return client.query(query, params)
    },
    delete: id => {
        const query = `DELETE FROM image WHERE id=$1;`
        return client.query(query, [id])
    }
}

