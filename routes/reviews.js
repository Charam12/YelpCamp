const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewController = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');
const { isLogin, isReviewAuthor, validateReview }  = require('../middleware');

router.post('/', isLogin, validateReview, catchAsync(reviewController.newReview));

router.delete('/:reviewID', isLogin, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;