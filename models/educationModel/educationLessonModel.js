const mongoose = require("mongoose");

const educationLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EducationCourse",
  },
  type: {
    type: String,
    required: [true, "lesson's type is required"],
    enum:["recorded","live"],
    default:"recorded"
  },
  image: {
    type: String,
    required: [true, "Lesson image is required"],
  },
  videoUrl: {
    type: String,
    required: true,
  },
});


const setImageURL = (doc) => {
  //return image base url + iamge name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/education/lessons/${doc.image}`;
    doc.image = imageUrl;
  }
};
//after initializ the doc in db
// check if the document contains image
// it work with findOne,findAll,update
educationLessonSchema.post("init", (doc) => {
  setImageURL(doc);
});
// it work with create
educationLessonSchema.post("save", (doc) => {
  setImageURL(doc);
});

const Lesson = mongoose.model("EducationLesson", educationLessonSchema);

module.exports = Lesson;
