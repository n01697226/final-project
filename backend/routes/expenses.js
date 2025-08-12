import express from "express";
import Expense from "../models/Expense.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async function (req, res) {
  try {
    const doc = await Expense.create({
      userId: req.user.userId,
      vehicleId: req.body.vehicleId,
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date,
      note: req.body.note || "",
    });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", auth, async function (req, res) {
  try {
    const filter = { userId: req.user.userId };
    if (req.query.vehicleId) {
      filter.vehicleId = req.query.vehicleId;
    }
    const docs = await Expense.find(filter).sort({ date: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async function (req, res) {
  try {
    const id = req.params.id;
    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      {
        vehicleId: req.body.vehicleId,
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date,
        note: req.body.note || "",
      },
      { new: true }
    );
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async function (req, res) {
  try {
    const id = req.params.id;
    await Expense.deleteOne({ _id: id, userId: req.user.userId });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
