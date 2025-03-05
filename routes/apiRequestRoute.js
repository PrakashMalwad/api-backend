const express = require("express");
const router = express.Router();
const apiRequestController = require("../controllers/apiRequestController");

// Create a new API request and add it to a collection
router.post("/", apiRequestController.createRequest);
router.post("/add-to-collection/:collectionId", apiRequestController.addRequestToCollection);

// Get all API requests in a specific collection
router.get("/collection/:collectionId", apiRequestController.getRequestsByCollection);

// Get a single API request by ID
router.get("/:id", apiRequestController.getRequestById);

// Update an API request
router.put("/:id", apiRequestController.updateRequest);

// Delete an API request
router.delete("/:id", apiRequestController.deleteRequest);

module.exports = router;
