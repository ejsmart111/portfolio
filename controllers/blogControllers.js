let mongoose = require('mongoose')
mongoose.connect('mongodb+srv://egbe:blogMongo@blogs.qnvdg.mongodb.net/blogs?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('There was a ' + err));
let bodyParser = require('body-parser')
let multer = require('multer')

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: Date,
})

let Blog = mongoose.model('Blog', blogSchema)

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

var upload = multer({ storage: storage });


module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }))

    app.use(bodyParser.json())

    app.post('/blogs', upload.single('image'), function (req, res) {
        var imagePath = req.file.path.replace(/^public\//, '');
        req.body.image = imagePath
        req.body.date = new Date()
        let newBlog = Blog(req.body).save((err, data) => {
            if (err) {
                res.json({
                    status: res.statusCode,
                    data: null,
                    message: err
                })
            } else {
                Blog.find({}, (err, data) => {
                    if (err) {
                        res.json({
                            status: res.statusCode,
                            data: null,
                            message: err
                        })
                    } else {
                        res.render('blogs', { blogs: data.reverse() });
                    }
                })
            }
        })
    });

    app.get('/blogs', (req, res) => {
        Blog.find({}, (err, data) => {
            if (err) {
                res.json({
                    status: res.statusCode,
                    data: null,
                    message: err
                })
            } else {
                res.render('blogs', { blogs: data.reverse() });
            }
        })
    })

    app.get('/blog/:id', (req, res) => {
        Blog.find({ _id: req.params.id }, (err, data) => {
            let obj = data
            if (err) {
                res.json({
                    status: res.statusCode,
                    data: null,
                    message: err
                })
            } else {
                res.render('blog', { data: obj });
            }
        })
    })
}