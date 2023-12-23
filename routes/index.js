const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const addressRoute = require("./addressRoute");
//store routes
const storeCategoryRoute = require("./storeRoutes/categoryRoute");
const storeSubCategoryRoute = require("./storeRoutes/subCategoryRoute");
const storeBrandRoute = require("./storeRoutes/brandRoute");
const storeProductRoute = require("./storeRoutes/ProductRoute");
const storeReviewRoute = require("./storeRoutes/reviewRoute");
const storeWishlistRoute = require("./storeRoutes/wishlistRoute");
const storeCouponRoute = require("./storeRoutes/couponRoute");
const storeCartRoute = require("./storeRoutes/cartRoute");
const storeOrderRoute = require("./storeRoutes/OrderRoute");
//analytic routes
const analyticPostRoute = require("./analyticRoutes/postRoute");
const analyticPostCommentRoute = require("./analyticRoutes/postCommentRoute");
const analyticPostReactRoute = require("./analyticRoutes/postReactRoute");
//education routes
const educationPackageRoute = require("./educationRoutes/packageRoute");
const educationWishlistRoute = require("./educationRoutes/wishlistRoute");
const educationCouponRoute = require("./educationRoutes/couponRoute");
const educationReviewRoute = require("./educationRoutes/reviewRoute");
const educationCategoryRoute = require("./educationRoutes/categoryRoute");
const educationCourseRoute = require("./educationRoutes/courseRoute");
const educationLessonRoute = require("./educationRoutes/lessonRoute");
const educationOrderRoute = require("./educationRoutes/OrderRoute");
const educationLiveRoute = require("./educationRoutes/LiveRoute");

//public routes
const landingPageRoute = require("./landingPageRoute");
const storyRoute = require("./storyRoute");
const advertisementRoute = require("./advertisementRoute");
const systemReviewRoute = require("./systemReviewRoute");

//new --> marketing route
const marketingRoute=require('./marketing/merketingRoute')
const marketingReqRoute=require('./marketing/marktingReqsRoute')
const withdrawReqRoute=require('./marketing/withdrawReqRoute')
const brokerRoute=require('./marketing/borckerRoute')

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/store/addresses", addressRoute);
  //store routes
  app.use("/api/v1/store/categories", storeCategoryRoute);
  app.use("/api/v1/store/subCategories", storeSubCategoryRoute);
  app.use("/api/v1/store/brands", storeBrandRoute);
  app.use("/api/v1/store/products", storeProductRoute);
  app.use("/api/v1/store/reviews", storeReviewRoute);
  app.use("/api/v1/store/wishlist", storeWishlistRoute);
  app.use("/api/v1/store/coupons", storeCouponRoute);
  app.use("/api/v1/store/cart", storeCartRoute);
  app.use("/api/v1/store/orders", storeOrderRoute);
  //education routes
  app.use("/api/v1/education/packages", educationPackageRoute);
  app.use("/api/v1/education/wishlist", educationWishlistRoute);
  app.use("/api/v1/education/coupons", educationCouponRoute);
  app.use("/api/v1/education/reviews", educationReviewRoute);
  app.use("/api/v1/education/categories", educationCategoryRoute);
  app.use("/api/v1/education/courses", educationCourseRoute);
  app.use("/api/v1/education/lessons", educationLessonRoute);
  app.use("/api/v1/education/orders", educationOrderRoute);
  app.use("/api/v1/education/lives", educationLiveRoute);

  //analytic routes
  app.use("/api/v1/analytic/posts", analyticPostRoute);
  app.use("/api/v1/analytic/postComments", analyticPostCommentRoute);
  app.use("/api/v1/analytic/postReacts", analyticPostReactRoute);

  //public routes
  app.use("/api/v1/landingPage", landingPageRoute);
  app.use("/api/v1/stories", storyRoute);
  app.use("/api/v1/advertisements", advertisementRoute);
  app.use("/api/v1/systemReviews", systemReviewRoute);



  app.use("/api/v1/marketing", marketingRoute);
  app.use("/api/v1/marketingReq", marketingReqRoute);
  app.use("/api/v1/withdrawReq", withdrawReqRoute);
  app.use("/api/v1/broker", brokerRoute);
};
module.exports = mountRoutes;
