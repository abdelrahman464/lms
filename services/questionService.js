const Question = require("../models/questionModel");
const factory = require("./handllerFactory");




// Create a new Question 
exports.createQuestion = factory.createOne(Question);
//---------------------------------------------------------------------------------//

// Get all Questions
exports.getAllQuestions = factory.getALl(Question);
//---------------------------------------------------------------------------------//

// Get a specific Question Video by ID
exports.getQuestion = factory.getOne(Question);
//---------------------------------------------------------------------------------//

// Update a Question Video by ID
exports.updateQuestion = factory.updateOne(Question);
//---------------------------------------------------------------------------------//

// Delete a Question Video by ID
exports.deleteQuestion = factory.deleteOne(Question);
//---------------------------------------------------------------------------------//