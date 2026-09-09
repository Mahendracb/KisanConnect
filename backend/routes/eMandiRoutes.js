const express = require('express');
const router = express.Router();
const HarvestListing = require('../models/HarvestListing');

// @route GET /api/emandi/listings (Browse all marketplace listings)
router.get('/listings', async (req, res) => {
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
});

// @route GET /api/emandi/listings/:id (Get single listing details)
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Harvest listing not found' });
    return res.json(listing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/emandi/listings (SELLER FEATURE: Post new harvest listing)
router.post('/listings', async (req, res) => {
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

    if (!sellerName || !sellerPhone || !cropName || !quantityQuintals || !basePricePerQuintal) {
      return res.status(400).json({ error: 'Missing required listing information' });
    }

    const newListing = await HarvestListing.create({
      sellerName: sellerName.trim(),
      sellerPhone: sellerPhone.trim(),
      sellerEmail: sellerEmail || '',
      village: village || 'Local Taluk',
      district: district || 'Mandya',
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
});

// @route GET /api/emandi/seller/:phone (SELLER FEATURE: Get my active listings & incoming offers)
router.get('/seller/:phone', async (req, res) => {
  try {
    const phone = req.params.phone.trim();
    const listings = await HarvestListing.find({ sellerPhone: phone }).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route POST /api/emandi/listings/:id/offers (BUYER FEATURE: Place bid / offer on harvest)
router.post('/listings/:id/offers', async (req, res) => {
  try {
    const { buyerName, buyerPhone, offeredPrice, quantityQuintals, message } = req.body;
    if (!buyerName || !buyerPhone || !offeredPrice || !quantityQuintals) {
      return res.status(400).json({ error: 'Please provide buyer name, phone, price, and quantity' });
    }

    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const newOffer = {
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
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
});

// @route PATCH /api/emandi/listings/:id/offers/:offerId (SELLER FEATURE: Accept or reject offer)
router.patch('/listings/:id/offers/:offerId', async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid offer status' });
    }

    const listing = await HarvestListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

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
});

// @route PATCH /api/emandi/listings/:id/status (SELLER FEATURE: Toggle listing availability)
router.patch('/listings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await HarvestListing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    return res.json(listing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
