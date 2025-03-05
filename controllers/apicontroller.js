const axios = require("axios");
const mongoose = require("mongoose");
const ApiCollection = require("../models/ApiCollection");

// Create a new API collection
exports.createCollection = async (req, res) => {
  try {
    const { name, requests } = req.body;
    const newCollection = new ApiCollection({
      name,
      requests,
      user: req.user.id, // Ensure req.user exists from middleware
    });
    console.log("Creating collection:", newCollection);
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ message: "Error creating collection", error });
  }
};

// Get all API collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await ApiCollection.find();
    console.log(collections)
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error });
  }
};

//user specific collection
exports.getUserCollections = async (req, res) => {
  try {
    const collections = await ApiCollection.find({ user: req.user.id });
    console.log(collections);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching collections", error });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    console.log("Updating collection:", req.params.id);
    console.log("Request body:", req.body);

    const updatedCollection = await ApiCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    console.log("Updated collection:", updatedCollection);
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.log("Error updating collection:", error);
    res.status(500).json({ error: error.message });
  }
};




// Delete an existing API collection
exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await ApiCollection.findById(id);

    console.log("Deleting collection:", id);

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    await ApiCollection.deleteOne({ _id: id });

    res.json({ message: "Collection deleted successfully" });
  } catch (error) {
    console.log("Error deleting collection:", error);
    res.status(500).json({ message: "Error deleting collection", error });
  }
};

// Add a new API request to an existing collection

exports.addRequestToCollection = async (req, res) => {
  try {
    const { collectionid } = req.params;
    const { name, url, method, headers, body } = req.body;
    console.log("Request body:", req.body);
    console.log("Adding request to collection:", collectionid);
    // Find collection
    const collection = await ApiCollection.findById(collectionid);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // Create new request object
    const newRequest = {
      _id: new mongoose.Types.ObjectId(), // Generate a unique ID
      name,
      url,
      method,
      headers: headers || {},
      body: body || "",
    };

    // Add to collection's requests array
    collection.requests.push(newRequest);

    // Save updated collection
    await collection.save();

    res.status(200).json({ message: "Request added successfully", request: newRequest });
  } catch (error) {
    console.error("Error adding request to collection:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Run all requests in a collection
exports.runCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await ApiCollection.findById(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    const results = await Promise.all(
      collection.requests.map(async (reqData) => {
        try {
          const response = await axios({
            method: reqData.method,
            url: reqData.url,
            headers: reqData.headers,
            data: reqData.body,
          });
          return { url: reqData.url, status: response.status, data: response.data };
        } catch (error) {
          return { url: reqData.url, status: "error", error: error.message };
        }
      })
    );

    res.json({ message: "Collection executed", results });
  } catch (error) {
    res.status(500).json({ message: "Error running collection", error });
  }
};
