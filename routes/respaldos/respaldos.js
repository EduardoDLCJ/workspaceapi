const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const archiver = require("archiver");
const verifyToken = require('../../middlewares/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const data = {};

        for (const collection of collections) {
            const collectionName = collection.name;
            const model = mongoose.connection.db.collection(collectionName);
            data[collectionName] = await model.find({}).toArray();
        }

        res.json(data);
    } catch (error) {
        console.error('Error obteniendo colecciones:', error);
        res.status(500).json({ error: 'Error obteniendo colecciones' });
    }
});

router.post("/export", verifyToken, async (req, res) => {
  const { collections } = req.body;
  if (!collections || collections.length === 0) {
    return res.status(400).json({ error: "No se proporcionaron colecciones para exportar." });
  }

  const zip = archiver("zip", { zlib: { level: 9 } });
  res.attachment("respaldos.zip");
  zip.pipe(res);

  try {
    const db = mongoose.connection.db;
    for (const collectionName of collections) {
      const collection = await db.collection(collectionName).find({}).toArray();
      zip.append(JSON.stringify(collection, null, 2), { name: `${collectionName}.json` });
    }

    await zip.finalize();
  } catch (error) {
    console.error("Error al exportar colecciones:", error);
    res.status(500).json({ error: "Error al exportar colecciones." });
  }
});



module.exports = router;