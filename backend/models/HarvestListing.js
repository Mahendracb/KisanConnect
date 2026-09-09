const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    offeredPrice: { type: Number, required: true },
    quantityQuintals: { type: Number, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
  }
);

const harvestListingSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sellerName: { type: String, required: true, trim: true },
    sellerPhone: { type: String, required: true, trim: true },
    sellerEmail: { type: String, default: '' },
    village: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    cropName: { type: String, required: true, trim: true },
    variety: { type: String, default: 'Grade A Quality' },
    quantityQuintals: { type: Number, required: true, min: 1 },
    basePricePerQuintal: { type: Number, required: true, min: 1 },
    expectedHarvestDate: { type: String, required: true },
    description: { type: String, default: 'Farm-fresh crop with pesticide residue clearance certificate.' },
    status: {
      type: String,
      enum: ['available', 'under_negotiation', 'sold'],
      default: 'available'
    },
    dispatchSlipNo: {
      type: String,
      default: () => 'FX-PASS-' + Math.floor(100000 + Math.random() * 900000)
    },
    offers: [offerSchema]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('HarvestListing', harvestListingSchema);
