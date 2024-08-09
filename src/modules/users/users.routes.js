import { Router } from "express";
import * as UC from "./users.controller.js";
import * as UV from "./users.validate.js";
import auth from "../../../middleware/auth.js";
import { systemRoles } from "../../utils/helpers.js";
import validation from "../../../middleware/validation.js";

const router = Router();

router.post("/signup", validation(UV.signUp), UC.signup);

router.get("/confirm/:token", UC.confirmEmail);

router.get("/resend/:resendToken", UC.resendConfirmEmail);

router.post("/signin", validation(UV.signIn), UC.signin);

router.post("/logout", auth(Object.values(systemRoles)), UC.signout);

router.post("/forgetPassword", UC.forgetPassword);

router.post("/verifyEmail", UC.verifyEmail);

router.post("/resetPassword", UC.resetPassword);

router.get("/profile", auth(Object.values(systemRoles)), UC.getProfile);

router.put(
  "/updateProfile",
  auth(Object.values(systemRoles)),
  validation(UV.updateProfile),
  UC.updateProfile
);

router.patch(
  "/changePassword",
  auth(Object.values(systemRoles)),
  validation(UV.updateProfile),
  UC.changePassword
);

export default router;
