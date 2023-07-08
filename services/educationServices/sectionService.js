const Section = require("../../models/educationModel/educationSectionModel");
const factory = require("../handllerFactory");

// Create a new section
exports.createSection = factory.createOne(Section);
// Get all sections of a course
exports.getSectionsByCourseId = factory.getALl(Section);
// Get a specific section by ID
exports.getSectionById = factory.getOne(Section);
// Update a section by ID
exports.updateSection = factory.updateOne(Section);
// Delete a section by ID
exports.deleteSection = factory.deleteOne(Section);
