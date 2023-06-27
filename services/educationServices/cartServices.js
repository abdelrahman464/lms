const asyncHandler = require("express-async-handler");
const ApiError = require("../../utils/apiError");
const Cart = require("../../models/educationModel/educationCartModel");
const Course = require("../../models/educationModel/educationCourseModel");
const Coupon = require("../../models/educationModel/educationCouponModel");

const calculateTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price;
  });
  cart.totalCartprice = totalPrice;
  cart.totalCartpriceAfterDiscount = undefined;
  return totalPrice;
};

//@desc add course to cart
//@route POST /api/v1/cart
//@access private/User
exports.addCourseToCart = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ApiError("Product not found", 404));
  }
  let coursePrice;
  if (course.priceAfterDiscount) {
    coursePrice = course.priceAfterDiscount;
  } else {
    coursePrice = course.price;
  }

  //get cart for logged in user
  let cart = await Cart.findOne({ user: req.user._id });
  //if no cart
  if (!cart) {
    //create a new cart for this user with the product
    cart = await Cart.create({
      user: req.user._id,
      //we can use $addtoSet
      cartItems: [{ course: courseId, price: coursePrice }],
    });
  } else {
    // is this course exists in the cart,update product quantity
    const courseIndex = cart.cartItems.findIndex(
      (item) => item.course.toString() === courseId
    );
    //find index if there is no item with this courseId it will return -1
    //if courseIndex > -1 then he found a course with  this courseId  then i will update the quantity
    //if the course is not exist in the cart ,push product to cartItem array
    if (!courseIndex > -1) {
      cart.cartItems.push({ course: courseId, price: coursePrice });
    }
  }

  //calculate total cart price
  calculateTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    message: "course added to cart successfully",
    data: cart,
  });
});

//@desc get logged user cart
//@route GET /api/v1/cart
//@access private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There's Not Courses In you Cart `, 404));
  }

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//@desc remove item from cart
//@route DELETE /api/v1/cart/:itemId
//@access private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      //remove an item from cart if exists
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  //calculate total cart price
  calculateTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@desc clear all items from cart
//@route DELETE /api/v1/cart
//@access private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
//@desc applay coupon on cart
//@route PUT /api/v1/cart/applaycoupon
//@access private/User
exports.applayCoupon = asyncHandler(async (req, res, next) => {
  // 1) get coupon passed on coupon name
  const coupon = await Coupon.findOne({
    title: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is Invalid or Expired "));
  }
  //get looger user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartprice;

  //calculate total price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalCartpriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
