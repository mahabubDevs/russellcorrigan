import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import {StripeRoutes} from "../modules/Payment/StripePayment.routes";
import { ProductRoutes } from "../modules/product/Product.routes";
import {ReviewRoutes}  from  "../../app/modules/review/review.route"


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
  {
    path: "/services",
    route: ProductRoutes,
  },
  // {
  //   path: "/reviews",
  //   route: ReviewRoutes,
  // },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
