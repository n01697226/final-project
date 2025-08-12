import express from "express";
import Vehicle from "../models/Vehicle.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// create
router.post("/", auth, async function (req, res) {
  try {
    const doc = await Vehicle.create({
      userId: req.user.userId,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
    });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// list my vehicles
router.get("/", auth, async function (req, res) {
  try {
    const docs = await Vehicle.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// update
router.put("/:id", auth, async function (req, res) {
  try {
    const id = req.params.id;
    const updated = await Vehicle.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { make: req.body.make, model: req.body.model, year: req.body.year },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// delete
router.delete("/:id", auth, async function (req, res) {
  try {
    const id = req.params.id;
    await Vehicle.deleteOne({ _id: id, userId: req.user.userId });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
