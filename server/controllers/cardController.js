const mongoose = require("mongoose");
const Card = require("../models/Card");

const createCard = async (req, res) => {
  try {
    const card = await Card.create(req.body);

    res.status(201).json({
      message: "Card created successfully",
      card
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create card",
      error: error.message
    });
  }
};

const getCards = async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });

    res.status(200).json({
      cards
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cards",
      error: error.message
    });
  }
};

const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid card ID"
      });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found"
      });
    }

    res.status(200).json({
      card
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch card",
      error: error.message
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid card ID"
      });
    }

    const card = await Card.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!card) {
      return res.status(404).json({
        message: "Card not found"
      });
    }

    res.status(200).json({
      message: "Card updated successfully",
      card
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update card",
      error: error.message
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid card ID"
      });
    }

    const card = await Card.findByIdAndDelete(id);

    if (!card) {
      return res.status(404).json({
        message: "Card not found"
      });
    }

    res.status(200).json({
      message: "Card deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete card",
      error: error.message
    });
  }
};

module.exports = {
  createCard,
  getCards,
  getCardById,
  updateCard,
  deleteCard
};