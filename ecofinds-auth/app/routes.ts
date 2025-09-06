import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/_index.jsx"),
	route("/home", "routes/home.jsx"),
	route("/login", "routes/login.jsx"),
	route("/signup", "routes/signup.jsx"),
	route("/dashboard", "routes/dashboard.jsx"),
	route("/firebase-debug", "routes/firebase-debug.jsx"),
] satisfies RouteConfig;
