const HarvestListing = require('../models/HarvestListing');

// @desc    Browse all marketplace listings with filter
// @route   GET /api/emandi/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const { crop, district, status = 'available' } = req.query;
    let filter = {};

    if (status !== 'all') {
      filter.status = status;
    }
    if (crop && crop !== 'All Crops') {
      filter.cropName = { $regex: crop, $options: 'i' };
    }
    if (district && district !== 'All Districts') {
      filter.district = { $regex: district, $options: 'i' };
    }

    const listings = await HarvestListing.find(filter).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Get single listing details
// @route   GET /api/emandi/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Harvest listing not found' });
    return res.json(listing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Get active listings & incoming offers for a seller
// @route   GET /api/emandi/seller/:phone
// @access  Public / Protected
const getSellerListings = async (req, res) => {
  try {
    const phone = req.params.phone.trim();
    const query = {
      $or: [
        { sellerPhone: phone }
      ]
    };
    if (req.user) {
      query.$or.push({ sellerId: req.user._id });
    }

    const listings = await HarvestListing.find(query).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Post a new harvest listing
// @route   POST /api/emandi/listings
// @access  Private / Protected (or with optional fallback)
const createListing = async (req, res) => {
  try {
    const {
      sellerName,
      sellerPhone,
      sellerEmail,
      village,
      district,
      cropName,
      variety,
      quantityQuintals,
      basePricePerQuintal,
      expectedHarvestDate,
      description
    } = req.body;

    const finalSellerName = sellerName || (req.user ? `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.username : '');
    const finalSellerPhone = sellerPhone || (req.user ? req.user.phone : '');
    const finalSellerEmail = sellerEmail || (req.user ? req.user.email : '');
    const finalVillage = village || (req.user ? req.user.village : 'Local Taluk');
    const finalDistrict = district || (req.user ? req.user.district : 'Mandya');

    if (!finalSellerName || !finalSellerPhone || !cropName || !quantityQuintals || !basePricePerQuintal) {
      return res.status(400).json({ error: 'Missing required listing information (sellerName, sellerPhone, cropName, quantity, price)' });
    }

    const newListing = await HarvestListing.create({
      sellerId: req.user ? req.user._id : null,
      sellerName: finalSellerName.trim(),
      sellerPhone: finalSellerPhone.trim(),
      sellerEmail: finalSellerEmail,
      village: finalVillage || 'Local Taluk',
      district: finalDistrict || 'Mandya',
      cropName: cropName.trim(),
      variety: variety || 'Standard Grade A',
      quantityQuintals: Number(quantityQuintals),
      basePricePerQuintal: Number(basePricePerQuintal),
      expectedHarvestDate: expectedHarvestDate || new Date().toISOString().split('T')[0],
      description: description || 'Fresh harvest ready for direct procurement.'
    });

    return res.status(201).json(newListing);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// @desc    Place bid / offer on a harvest listing
// @route   POST /api/emandi/listings/:id/offers
// @access  Public / Protected
const placeBid = async (req, res) => {
  try {
    const { buyerName, buyerPhone, offeredPrice, quantityQuintals, message } = req.body;

    const finalBuyerName = buyerName || (req.user ? `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || req.user.username : '');
    const finalBuyerPhone = buyerPhone || (req.user ? req.user.phone : '');

    if (!finalBuyerName || !finalBuyerPhone || !offeredPrice || !quantityQuintals) {
      return res.status(400).json({ error: 'Please provide buyer name, phone, price, and quantity' });
    }

    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const newOffer = {
      buyerName: finalBuyerName.trim(),
      buyerPhone: finalBuyerPhone.trim(),
      offeredPrice: Number(offeredPrice),
      quantityQuintals: Number(quantityQuintals),
      message: message || `Interested in procuring ${quantityQuintals} quintals at ₹${offeredPrice}/quintal.`,
      status: 'pending',
      createdAt: new Date()
    };

    listing.offers.push(newOffer);
    if (listing.status === 'available') {
      listing.status = 'under_negotiation';
    }
    await listing.save();

    return res.status(201).json({ success: true, listing });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Accept or reject offer on harvest listing
// @route   PATCH /api/emandi/listings/:id/offers/:offerId
// @access  Private (Protected)
const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid offer status. Must be accepted or rejected.' });
    }

    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // If user is authenticated and listing has sellerId, ensure user owns the listing or is admin
    if (req.user && listing.sellerId && listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to manage offers for this listing' });
    }

    const offer = listing.offers.id(req.params.offerId);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    offer.status = status;
    if (status === 'accepted') {
      listing.status = 'sold';
    }

    await listing.save();
    return res.json({ success: true, listing });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Toggle listing availability status
// @route   PATCH /api/emandi/listings/:id/status
// @access  Private (Protected)
const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Authorization check
    if (req.user && listing.sellerId && listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to modify this listing' });
    }

    listing.status = status;
    await listing.save();
    return res.json(listing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/emandi/listings/:id
// @access  Private (Protected)
const deleteListing = async (req, res) => {
  try {
    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    // Authorization check
    if (req.user && listing.sellerId && listing.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await HarvestListing.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  getSellerListings,
  createListing,
  placeBid,
  updateOfferStatus,
  updateListingStatus,
  deleteListing
};
