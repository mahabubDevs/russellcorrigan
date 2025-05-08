import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import {StripeRoutes} from "../modules/Payment/StripePayment.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/payments",
    route: StripeRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
