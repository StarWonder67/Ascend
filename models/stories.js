//STORY SCHEMA

var mongoose = require("mongoose");

var storySchema = new mongoose.Schema({
	topic: String,
	title: String,
	// time-stamp: Date,
	content: String,
	image: String,
	author: String,
	description: String

});


module.exports = mongoose.model("Story",storySchema);