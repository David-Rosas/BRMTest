const Router = require("express").Router;
const {
  LoginUser,
  RegisterUser,
  validateUserToken,
  generateCodeRecover,
  validateRecoverCode,
} = require("../controllers/UsersController");

const {
  signUpValidationRules,
  loginValidationRules,
  requestRecoverValidationRules,
  codeRecoverValidationRules,
  validate,
} = require("../helpers/validator");

const router = Router();
const { middlewareAuth } = require("../middlewares/isAuth.js");

router.post("/api/user/login", loginValidationRules, validate, LoginUser);
router.post("/api/user/register", signUpValidationRules, validate, RegisterUser);
router.get("/api/user/validate-token", validateUserToken);
router.post("/api/user/request-code-recover", requestRecoverValidationRules, validate, generateCodeRecover);
router.post("/api/user/validate-code", codeRecoverValidationRules, validate, validateRecoverCode);

module.exports = router;
