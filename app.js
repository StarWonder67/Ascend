var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	path = require("path"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/users"),
	Story = require("./models/stories")


app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

      
mongoose.connect("mongodb://localhost/shunDepression");

//============AUTHENTICATION==============================================================
app.use(require("express-session")({
	secret: "muskan",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//========================================================================================





//===============INDEX ROUTE==========================================
app.get('/',function(req,res){
	res.render("landing");
});



app.get('/userdashboard',isLoggedIn, function(req,res){
	console.log(req.user);
	res.render("userdashboard",{user:req.user});
})

//GET ALL STORIES ROUTE index of sorties
app.get('/stories',isLoggedIn,function(req,res){

	//get all stories from db
	Story.find({},function(err,allStories){
		if(err){
			console.log(err);
		}
		else{
			res.render("stories",{allStories:allStories,user:req.user});
		}


	})

	//res.render("stories");
});


//DISPLAY FORM TO CREATE NEW STORY BY A USER ROUTE
app.get('/write',isLoggedIn, function(req,res){
	res.render("write",{user:req.user});
})


//================show routes=======================================================


app.get('/profile', isLoggedIn, function(req,res){
	
	User.findById(req.user._id).populate("stories").exec(function(err,user){
		if(err){
			console.log(err);
		}
		else{
			console.log(user);
			res.render("profile",{user:req.user});
		}
		
	})

});

app.get('/stories/:id',isLoggedIn,function(req,res){
	Story.findById(req.params.id,function(err,foundStory){
		if(err){
			console.log(err);
		}
		else{
			res.render("show-story",{story:foundStory});
		}

	})


})


//=========================AUTH ROUTES==========================================================


app.get('/signup',function(req,res){
	res.render("signup");
})

app.get('/login',function(req,res){
	res.render("login");
})

app.get('/logout',function(req,res){
	req.logout();
	res.redirect("/");
})

//========================POST ROUTES============================================================


app.post('/signup',function(req,res){
	
	User.register(new User({username: req.body.username,
							realname: req.body.realname,
							email : req.body.email		
							}),
	req.body.password,function(err,user){
		if(err){
			console.log(err);
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/");
			})
		}
	})

	
})


app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/userdashboard");
    // res.redirect('/userdashboard/:' + req.user.username);
  });


//=====================POST ROUTES============================================

app.post('/write',isLoggedIn,function(req,res){
	var author = req.user.realname;

	var title = req.body.title;
	var topic = req.body.topic;
	var content = req.body.content;
	var image = req.body.image;
	var description = req.body.description;

	Story.create({
	topic: topic,
	title: title,
	content: content,
	image: image,
	author: author,
	description: description
},
function(err,story){
	if(err){
		console.log(err);
	}
	else{
		console.log("new story created");
		
		res.redirect('/profile');
	}
})

})




//==============================================================================================

//MIDDLEWARE
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



//====================================================================================================


app.listen(8000,function(){
	console.log("server is running");
})