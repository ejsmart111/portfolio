let express = require('express')
let nodemailer = require('nodemailer')
let mongoose = require('mongoose')
    mongoose.connect('mongodb+srv://egbe:blogMongo@blogs.qnvdg.mongodb.net/blogs?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => console.log('MongoDB connected...'))
        .catch(err => console.log('There was a ' + err));

let app = express()
let blogController = require('./controllers/blogControllers')

app.set('view engine', 'ejs')
app.use('/assets', express.static('./public/assets'))

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: 'egbeejay@gmail.com',
        pass: '123Baba..',
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
});

blogController(app, mongoose)
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
app.get('/portfolio', (req, res) => {
    res.render('portfolio')
})


app.listen(process.env.PORT || 5000)