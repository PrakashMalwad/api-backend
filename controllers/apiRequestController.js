const ApiRequest = require("../models/ApiRequest");
const Collection = require("../models/ApiCollection");

// Create API request
exports.createRequest = async (req, res) => {
  try {
    const { name, url, method, headers, body } = req.body;
    if (!name || !url || !method) {
      return res.status(400).json({ error: "Name, URL, and method are required" });
    }

    const newRequest = await ApiRequest.create({ name, url, method, headers, body: body || "" });

    // Emit event for real-time update
    req.app.get("io").emit("requestCreated", newRequest);

    res.status(201).json({ message: "Request created successfully", request: newRequest });
  } catch (error) {
    res.status(500).json({ error: "Failed to create request" });
  }
};

// Add request to collection
exports.addRequestToCollection = async (req, res) => {
  try {
    const { collectionId, requestId } = req.body;
    if (!collectionId || !requestId) {
      return res.status(400).json({ error: "Collection ID and Request ID are required" });
    }

    const collection = await Collection.findById(collectionId);
    const request = await ApiRequest.findById(requestId);
    if (!collection || !request) {
      return res.status(404).json({ error: "Collection or request not found" });
    }

    if (!collection.requests.includes(requestId)) {
      collection.requests.push(requestId);
      await collection.save();
    }

    const updatedCollection = await Collection.findById(collectionId).populate("requests");

    req.app.get("io").emit("collectionUpdated", updatedCollection);

    res.json({ message: "Request added to collection", collection: updatedCollection });
  } catch (error) {
    res.status(500).json({ error: "Failed to add request to collection" });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    res.json(await ApiRequest.find());
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Get requests by collection
exports.getRequestsByCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.collectionId).populate("requests");
    collection ? res.json(collection.requests) : res.status(404).json({ error: "Collection not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Get single request
exports.getRequestById = async (req, res) => {
  try {
    const request = await ApiRequest.findById(req.params.id);
    request ? res.json(request) : res.status(404).json({ error: "Request not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch request" });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const updatedRequest = await ApiRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    updatedRequest ? res.json(updatedRequest) : res.status(404).json({ error: "Request not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await ApiRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ error: "Request not found" });

    await Collection.updateMany({ requests: req.params.id }, { $pull: { requests: req.params.id } });

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
};
