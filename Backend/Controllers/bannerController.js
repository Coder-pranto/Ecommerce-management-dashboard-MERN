const Banner = require('../Models/banner');

// Controller function to create a new banner
exports.createBanner = async (req, res) => {
    try {
      const { title, link, priority, active } = req.body;
      console.log(req.body);
      console.log(req.files)
      
      let banner_img;
      if (req.files) {
        banner_img = req.files.banner_img[0].filename; 
      } else {
        return res.status(400).json({ error: 'No image uploaded' });
      }
  
      const banner = new Banner({ title, banner_img, link, priority, active });
      const savedBanner = await banner.save();
      res.status(201).json(savedBanner);
    } catch (error) {
      console.error('Error creating banner:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



// Controller function to update a banner by ID
exports.updateBannerById = async (req, res) => {
    try {
      const { title, link, priority, active } = req.body;
      const bannerUpdate = { title, link, priority, active };
      if (req.file) {
        bannerUpdate.banner_img = req.file.filename; 
      }
      const banner = await Banner.findByIdAndUpdate(req.params.id, bannerUpdate, { new: true });
      if (!banner) {
        return res.status(404).json({ error: 'Banner not found' });
      }
      res.json(banner);
    } catch (error) {
      console.error('Error updating banner by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Controller function to get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get a single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    console.error('Error fetching banner by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller function to delete a banner by ID
exports.deleteBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
