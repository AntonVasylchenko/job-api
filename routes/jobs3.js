const { Router } = require("express");

const router = Router();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs2");

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
