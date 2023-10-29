const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_KEY
const geoCoder = mbxGeocoding({ accessToken: mapboxToken });
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.newCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.body.features[0].geometry;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new Campground');
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot Find that Camground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot Find that Camground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.editCampground = async (req, res) => {
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground }); 
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImgs) {
        for (let fileName of req.body.deleteImgs) {
            await cloudinary.uploader.destroy(fileName)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImgs } } } });
        console.log(campground)
    }
    req.flash('success', 'Successfully Update Campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully Delete Campground');
    res.redirect('/campgrounds')
}