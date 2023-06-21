const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
//store routes
const categoryRoute = require("./storeRoutes/categoryRoute");
const subCategoryRoute = require("./storeRoutes/subCategoryRoute");
const brandRoute = require("./storeRoutes/brandRoute");
const productRoute = require("./storeRoutes/ProductRoute");
const reviewRoute = require("./storeRoutes/reviewRoute");
const wishlistRoute = require("./storeRoutes/wishlistRoute");
const addressRoute = require("./storeRoutes/addressRoute");
const couponRoute = require("./storeRoutes/couponRoute");
const cartRoute = require("./storeRoutes/cartRoute");
const orderRoute = require("./storeRoutes/OrderRoute");
//analytic routes
const postRoute = require("./analyticRoutes/postRoute");
const postCommentRoute = require("./analyticRoutes/postCommentRoute");
const postReactRoute = require("./analyticRoutes/postReactRoute");
const telegramBotRoute = require("./analyticRoutes/telegramBotRoute");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  //store routes
  app.use("/api/v1/store/categories", categoryRoute);
  app.use("/api/v1/store/subCategories", subCategoryRoute);
  app.use("/api/v1/store/brands", brandRoute);
  app.use("/api/v1/store/products", productRoute);
  app.use("/api/v1/store/reviews", reviewRoute);
  app.use("/api/v1/store/wishlist", wishlistRoute);
  app.use("/api/v1/store/addresses", addressRoute);
  app.use("/api/v1/store/coupons", couponRoute);
  app.use("/api/v1/store/cart", cartRoute);
  app.use("/api/v1/store/orders", orderRoute);
  //analytic routes
  app.use("/api/v1/analytic/posts", postRoute);
  app.use("/api/v1/analytic/postComments", postCommentRoute);
  app.use("/api/v1/analytic/postReacts", postReactRoute);
  app.use("/api/v1/analytic/telegram", telegramBotRoute);
};
module.exports = mountRoutes;
