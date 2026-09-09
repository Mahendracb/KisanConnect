const mongoose = require('mongoose');

const cropPriceHistorySchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    price: { type: Number, required: true }
  },
  { _id: false }
);

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    current_price: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
    category: { type: String, default: 'Cash Crop' },
    price_range: {
      min: { type: Number, default: 1000 },
      max: { type: Number, default: 5000 }
    },
    price_history: [cropPriceHistorySchema]
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

module.exports = mongoose.model('Crop', cropSchema);
