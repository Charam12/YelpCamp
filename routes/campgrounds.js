const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const campgroundController = require('../controllers/campgrounds'); 

// Error Handling
const catchAsync = require('../utils/catchAsync');
const { isLogin, isAuthor, validateCampground } = require('../middleware');

// Route
router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLogin, upload.array('image'), validateCampground, catchAsync(campgroundController.newCampground))

router.get('/new', isLogin, campgroundController.newForm);

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLogin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundController.editCampground))
    .delete(isLogin, isAuthor, catchAsync(campgroundController.deleteCampground));

router.get('/:id/edit', isLogin, isAuthor, catchAsync(campgroundController.renderEdit));


module.exports = router;