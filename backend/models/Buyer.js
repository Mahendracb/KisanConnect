const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    crop_interest: { type: String, required: true, trim: true },
    phone_number: { type: String, required: true, trim: true },
    location: { type: String, default: 'Bengaluru APMC' },
    rating: { type: Number, default: 4.8 }
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

module.exports = mongoose.model('Buyer', buyerSchema);
