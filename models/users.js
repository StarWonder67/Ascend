//USER SCHEMA

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
Story = require("./stories")
//USER SCHEMA
var userSchema = new mongoose.Schema({
	username: String,
	realname: String,
	// age: NaN,
	// gender: String,
	email: String,
	password: String,
	stories: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Story"
	}]
});


userSchema.plugin(passportLocalMongoose);
//add some methods that come in PLM package

module.exports = mongoose.model('User', userSchema);