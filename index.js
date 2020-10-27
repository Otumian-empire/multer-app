const express = require("express")
const multer = require("multer")
const url = require("url")

const db = require("./db")

const upload_destination = 'uploads/'

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, upload_destination)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const limits = {
    fileSize: 1024 * 1024 * 10
}

const fileFilter = (req, file, callback) => {
    const acceptedIageTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (acceptedIageTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

const upload = multer({ storage, limits, fileFilter })

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')


app.get('/', (req, res) => {

    const msg = req.params.msg
    console.log(msg)
    // read all the uploaded images and render them on the screen
    return res.render('index', { msg })
})

app.get('/upload', (req, res) => {
    return res.redirect(
        url.format({
            pathname: "/",
            query: { "msg": "Please choose and upload an image" }
        })
    )
})

app.post('/upload', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        return res.redirect(
            url.format({
                pathname: "/",
                query: { "msg": "could not upload image" }
            })
        )
    }

    const img_path = req.file.path
    console.log(img_path)

    db.create(img_path)
        .then(createResponse => {
            console.log(createResponse)
            return res.redirect(
                201,
                url.format({
                    pathname: "/",
                    query: { "msg": "Image uploaded successfully" }
                }))
        }).catch(createErr => {
            console.log(createErr)
            return res.redirect(
                500,
                url.format({
                    pathname: "/",
                    query: { "msg": "Image upload unsuccessfully" }
                })
            )
        })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})