const express = require("express");
const auth = require("../middleware/auth");
const { createCollection, getCollections, getUserCollections, runCollection, updateCollection, deleteCollection,addRequestToCollection
} = require("../controllers/apicontroller");
const router = express.Router();

router.post("/collections",
auth,
    createCollection);
router.get("/collections", auth, getUserCollections);
router.get("/collections/:id", getCollections);
router.put("/collections/:id", updateCollection);
router.post("/collections/add/:collectionid", addRequestToCollection);
router.post("/collections/run/:id", runCollection);
router.delete("/collections/:id", deleteCollection);

module.exports = router;
