const express = require('express');
const router = express.Router();
const fs = require("fs");
const magazineController = require("../controllers/magazines");
const upload = require("../middlewares/upload");

router.post("/upload",upload.single("magazines_csv"), magazineController.upload);

router.post("/search",magazineController.searchMagazine);

router.get("/",magazineController.getMagazines);

router.get("/add",magazineController.addMagazineForm);

router.post("/",magazineController.addMagazine);

router.get("/edit/:id",magazineController.editMagazineForm);

router.post("/edit/:id",magazineController.editMagazine);

router.get("/delete/:id",magazineController.deleteMagazine);

router.get("/download", magazineController.download);

module.exports = router