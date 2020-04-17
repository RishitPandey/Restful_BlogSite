var express = require('express');
var app = express();
var bodyparser = require('body-parser');                            //Declaring variables to use the provided functions with the packages.
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var blog = require('./models/blogmodel');
var seedDB = require('./seed');
var Comment = require('./models/comment');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalStrategy = require('passport-local-mongoose');
var User = require('./models/user');

app.set('view engine', 'ejs');                                      //Setting the view engine to use ejs files as default.
app.use(express.static('public'));                                     //Location of css files. The css files should be here.
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));                                     //To override the method in order to use update and delete methods.
mongoose.connect('mongodb://localhost/RESTFULblogs');                   //Link to the database.

app.use(require('express-session')({
    secret: "Rusty is the best dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

seedDB();

//HomePage
app.get('/',function(req,res){
    res.redirect('/blogs');                                                 
});

app.get('/blogs/new',function(req,res){                                 //Form for creating a new blog.
    res.render('newblog');
});

//Post method to create a new post.
app.post('/blogs',function(req,res){                                    //Gettng the contents filled by the user in the form and then creating a new blog into the database and listing it into the blogs homepage.
    var newname = req.body.name;
    var newurl = req.body.url;
    var newdescrip = req.body.des;
    //var newauthor = req.body.author

    var newblogpost = {
        name: newname,
        image: newurl,
        des: newdescrip
    };
    //console.log(newblogpost);

    blog.create(newblogpost,function(err,allblogs){              //Takes to arguments, one is the newblogpost as an object and the other one to return the error if otherwise redirect to all blogs.
        if(err)
            console.log(err);
        else
            res.redirect('/blogs');
        })
});

app.get('/blogs',function(req,res){
    blog.find({},function(err,allblogs){                                    //If only empty curly brackets are sent as an argument then it will show all the blogs.
        if(err)
            console.log(err);
        else
            res.render('blogspage',{blogs: allblogs});   
    })
   
});

app.get('/blogs/:id',function(req,res){  
    blog.findById(req.params.id).populate("comments").exec(function(err,foundblog){
        if(err)
            console.log(err);
        else {
            console.log(foundblog);
            res.render('show',{ blog:foundblog });
        }
    })                               //Displaying the selected blog in an entire page with edit and delete options.
    /*blog.findById(req.params.id,function(err,foundblog){
        if(err)
            console.log(err);
        else
            res.render('show',{ blog:foundblog });
    })*/
});

app.get('/blogs/:id/edit',function(req,res){                        //Option to edit the blog.
    blog.findById(req.params.id,function(err,foundblog){
        if(err)
            console.log(err);
        else
            res.render('edit',{ blog:foundblog });
    })
});

app.put('/blogs/:id',function(req,res){                                 //Put request to update the blog into the database and then displaying the blog.
    blog.findByIdAndUpdate(req.params.id,req.body,function(err,updatedblog){
        if(err)
            console.log(err);
        else{
            console.log(req.body);
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

app.delete('/blogs/:id',function(req,res){                                  //Delete request to delete the currently displayed blog and will redirect to the blogs homepage.
    blog.findByIdAndRemove(req.params.id,function(err,deletedblog){
        if(err)
            console.log(err);
        else
            res.redirect('/blogs');
    })
});

//============================================================

//COMMENTS ROUTES

//============================================================

app.get('/blogs/:id/comments/new',function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err)
            console.log(err);
        else{
            console.log(foundblog);
            res.render('newcomment',{ blog:foundblog });
        }
    })
});

app.post('/blogs/:id/comments',function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log(err);
            res.redirect('/blogs'); 
        }
        else {
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(req.body);
                    console.log(err);
                    res.redirect('/blogs');
                }
                else {
                    console.log(comment, req.body.comment);
                    foundblog.comments.push(comment);
                    foundblog.save();
                    res.redirect('/blogs/' + foundblog._id);
                }
            })
        }
    })
});

app.listen(5000,function(req,res){                                  //Function to issue a particular local address to this app for hosting locally.
    console.log('Restful Server started at 5000');
});
