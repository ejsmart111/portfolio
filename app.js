let express = require('express')
let nodemailer = require('nodemailer')
let config = require('./config')

let app = express()
let blogController = require('./controllers/blogControllers')

app.set('view engine', 'ejs')
app.use('/assets', express.static('./public/assets'))

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: 'egbeejay@gmail.com',
        pass: config.PASS_W,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});

blogController(app)
app.post('/sendMail', (req, res) => {
    const mailData = {
        from: 'egbeejay@gmail.com',  // sender address
        to: 'jeremiah.anchorlane@gmail.com',   // list of receivers
        subject: 'Test',
        text: req.body.name + ': \n' + req.body.text 
    };
    transporter.sendMail(mailData, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    })
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/admin', (req, res) => {
    res.render('admin')
})
app.get('/about', (req, res) => {
    res.render('about')
})


app.listen(3000)