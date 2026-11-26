var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser= require("body-parser");
var logger = require('morgan');
//To manipulate Mongodb
var mongo= require('Mongoose');
mongo.connect('mongodb://localhost/yelp_cam');




const multer = require('multer');
//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

    //specify diskStorage (another option is memory)
    storage: multer.diskStorage({

        //specify destination
        destination: function(req, file, next){
            next(null, './views/image-storage/');
        },

        //specify the filename to be unique
        filename: function(req, file, next){
            console.log(file);
            //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
            const ext = file.mimetype.split('/')[1];
            //set the file fieldname to a unique name containing the original name, current datetime and the extension.
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
    }),

    // filter out and prevent non-image files.
    fileFilter: function(req, file, next){
        if(!file){
            next();
        }
        // only permit image mimetypes
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('photo uploaded');
            next(null, true);
        }else{
            console.log("file not supported");
            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};

var Blog=new mongo.Schema({
    blog_title: String,
    AuthorName: String,
    Comments:[
        {
            type: mongo.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    Blog_sections:
        [{


            section_text: String,
            section_image: String

        } ]


});
  /////////////////////////////
 //////Comment Schema/////////
/////////////////////////////
var CommentSchema= new mongo.Schema({
    text: String,
    Author: String
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//To use html form data
app.use(express.static('views/image-storage/'));


app.use(bodyParser.urlencoded({extended: true}));


app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var Blog_ = mongo.model("Blog", Blog);
var Comment=mongo.model("Comment", CommentSchema);

app.get("/", function (req, res)
{
    res.render("Form");
});
module.exports = app;
