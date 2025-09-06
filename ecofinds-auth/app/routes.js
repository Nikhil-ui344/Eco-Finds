import { route, index } from "@react-router/dev/routes";

export default [
  index("routes/_index.jsx"),
  // Authentication routes
  route("/login", "routes/login.jsx"),
  route("/signup", "routes/signup.jsx"),
  route("/dashboard", "routes/dashboard.jsx"),
  // App pages  
  route("/home", "routes/home.jsx"),
  route("/category/:categoryName", "routes/category.$categoryName.jsx"),
  route("/product/:id", "routes/product.$id.jsx"),
  route("/profile", "routes/profile.jsx"),
  route("/sell", "routes/sell.jsx"),
  route("/cart", "routes/cart.jsx"),
];
