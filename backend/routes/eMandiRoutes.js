const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  getSellerListings,
  createListing,
  placeBid,
  updateOfferStatus,
  updateListingStatus,
  deleteListing
} = require('../controllers/eMandiController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// Public Marketplace Endpoints
router.get('/listings', getListings);
router.get('/listings/:id', getListingById);
router.get('/seller/:phone', optionalProtect, getSellerListings);

// Trading / Bidding Endpoints (with user binding when logged in)
router.post('/listings', optionalProtect, createListing);
router.post('/listings/:id/offers', optionalProtect, placeBid);

// Seller Management Endpoints (Protected)
router.patch('/listings/:id/offers/:offerId', protect, updateOfferStatus);
router.patch('/listings/:id/status', protect, updateListingStatus);
router.delete('/listings/:id', protect, deleteListing);

module.exports = router;
