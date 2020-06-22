const express = require('express');
const Upload = require('./../utils/multerSetup');
const FileController = require('./../Controllers/fileController');

const router = express.Router();

router
  .route('/')
  .post(Upload.single('file'), FileController.createFile)
  .get(FileController.getAllFile);

router.get('/stats', FileController.getFilebyGroup);

router
  .route('/:id')
  .patch(FileController.updateFile)
  .delete(FileController.deleteFile);

module.exports = router;
