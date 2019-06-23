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

app.post("/addBlog",  multer(multerConfig).single('photo'),  function (req, res) {
    console.log(req.body.textbox);

    Blog_.create({blog_title: req.body.BlogName,
        AuthorName: req.body.AuthorName,


    }, function (err, addedblog) {
        if(err)
        {
            console.log("Not Added");
        }
        else
        {
            // Constructor function for Person objects
            function B(text, image) {
                section_text = text;
                section_image = image;
            }
               console.log(req.file.filename);

            console.log(addedblog);
            for(var i=0; i<req.body.textbox.length ; i++)
            {
                console.log(req.body.textbox[i]);
                var obj={
                    section_text: req.body.textbox[i],
                    section_image: req.file.filename
                };
                console.log(obj.section_text);
                addedblog.Blog_sections.push(obj);

            }
            addedblog.save();
            console.log("Added");
            res.redirect("/blog/"+addedblog._id);
        }
    });
});

app.get("/blog/:id", function (req, res) {
    Blog_.find({_id: req.params.id}).populate("Comments").exec(  function (err, foundblog) {
       if(err)
       {
           console.log(err);
       }
       else
       {
           console.log(foundblog);

           res.render("blog",{blog:foundblog});
       }
    });
});

//Comment Route
app.post("/blog/:id/comment",function (req, res) {
    Blog_.findById(req.params.id, function(err, blog)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            Comment.create(req.body.com,
                function (err, comment)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {

                        blog.Comments.push(comment);
                        blog.save();


                        console.log(blog);
                        res.redirect("/blog/"+blog._id);



                    }
                });
        }

    });

});


app.get("/index", function (req, res) {
    Blog_.find({}, function (err, Blog) {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index",{ Blogs: Blog });
        }
    });
});
app.listen(3000, function () {
    console.log("Server has started");
});

