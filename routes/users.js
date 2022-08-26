var express = require("express");

var userRouter = express.Router();

const {
  delete_one_user,
  get_all_users,
  get_user_by_id,
  create_new_user,
  update_user,
  update_one_field_of_user,
} = require("../controllers/users");
const checkReqBody = require("../middlewares/checkReqBody");

userRouter.route("/").get(get_all_users).post(checkReqBody, create_new_user);

userRouter
  .route("/:id")
  .get(get_user_by_id)
  .put(checkReqBody, update_user)
  .patch(update_one_field_of_user)
  .delete(delete_one_user);

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

module.exports = userRouter;
