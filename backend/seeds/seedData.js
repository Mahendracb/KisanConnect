require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Crop = require('../models/Crop');
const Scheme = require('../models/Scheme');
const Buyer = require('../models/Buyer');
const HarvestListing = require('../models/HarvestListing');
const User = require('../models/User');

const cropsData = [
  { name: 'Ragi (Finger Millet)', min: 3000, max: 4000, location: 'Mandya APMC' },
  { name: 'Jowar (Sorghum)', min: 2500, max: 3200, location: 'Vijayapura APMC' },
  { name: 'Paddy (Sona Masuri)', min: 2000, max: 2800, location: 'Raichur APMC' },
  { name: 'Tur Dal (Pigeon Pea)', min: 8000, max: 11000, location: 'Kalaburagi APMC' },
  { name: 'Sugarcane', min: 2500, max: 3500, location: 'Mandya APMC' },
  { name: 'Coffee (Arabica)', min: 18000, max: 22000, location: 'Kodagu APMC' },
  { name: 'Arecanut (Supari)', min: 40000, max: 50000, location: 'Shivamogga APMC' },
  { name: 'Cotton', min: 6000, max: 8000, location: 'Raichur APMC' },
  { name: 'Coconut', min: 1500, max: 2500, location: 'Tumakuru APMC' },
  { name: 'Groundnut', min: 5000, max: 7000, location: 'Chitradurga APMC' },
  { name: 'Maize (Corn)', min: 2000, max: 2500, location: 'Davanagere APMC' },
  { name: 'Sunflower', min: 4500, max: 6000, location: 'Koppal APMC' },
  { name: 'Bajra (Pearl Millet)', min: 2200, max: 2800, location: 'Bagalkot APMC' },
  { name: 'Black Gram (Urad)', min: 7000, max: 9000, location: 'Bidar APMC' },
  { name: 'Green Gram (Moong)', min: 6500, max: 8500, location: 'Gadag APMC' },
  { name: 'Cardamom', min: 150000, max: 200000, location: 'Hassan APMC' },
  { name: 'Black Pepper', min: 45000, max: 55000, location: 'Chikkamagaluru APMC' },
  { name: 'Onion', min: 1500, max: 3000, location: 'Chitradurga APMC' },
  { name: 'Tomato', min: 800, max: 2000, location: 'Kolar APMC' },
  { name: 'Pomegranate', min: 8000, max: 15000, location: 'Bagalkot APMC' },
  { name: 'Turmeric', min: 6000, max: 9000, location: 'Chamarajanagar APMC' },
  { name: 'Silk Cocoon', min: 30000, max: 45000, location: 'Ramanagara APMC' },
  { name: 'Cashew Nut', min: 60000, max: 80000, location: 'Dakshina Kannada APMC' }
];

const schemesData = [
  {
    title: 'Krishi Bhagya Scheme',
    description: 'Karnataka state scheme to improve rain-fed agriculture through farm ponds (Krishi Honda) and solar micro-irrigation.',
    eligibility: 'Farmers in rain-fed regions of Karnataka.\n- 80% to 90% subsidy for Krishi Honda\n- Diesel and solar pump sets provided\n- Promotes water harvesting and polyhouse cultivation',
    category: 'pre_crop',
    link: 'https://raitamitra.karnataka.gov.in/'
  },
  {
    title: 'Chief Minister Raitha Vidya Nidhi',
    description: 'Direct financial scholarship for the children of farmers in Karnataka to pursue higher professional education.',
    eligibility: 'Children of farmers enrolled in post-matric/degree courses.\n- Direct Bank Transfer (DBT) to student account\n- Supports agricultural, engineering, and medical degrees\n- Reduces economic burden on agrarian families',
    category: 'pre_crop',
    link: 'https://ssp.postmatric.karnataka.gov.in/'
  },
  {
    title: 'Surya Raitha Scheme (Solar Pump Subsidy)',
    description: 'Subsidized grid-interactive solar water pump sets allowing farmers to generate clean energy and sell surplus power to ESCOMs.',
    eligibility: 'Farmers with agricultural pump set connections.\n- 90% subsidy on solar installation\n- Steady supplemental income from power generation\n- Uninterrupted daytime irrigation',
    category: 'pre_crop',
    link: 'https://kredlinfo.in/'
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'Comprehensive crop insurance covering unforeseen yield losses due to drought, unseasonal rain, floods, and pest infestations.',
    eligibility: 'All farmers growing notified crops in notified areas.\n- Maximum premium: 2% for Kharif, 1.5% for Rabi crops\n- Full sum insured paid directly on crop damage\n- Claim settlement fast-tracked via Samrakshane portal',
    category: 'crop_loss',
    link: 'https://pmfby.gov.in/'
  },
  {
    title: 'Karnataka Bele Vime Yojane',
    description: 'State disaster relief and compensation mechanism linked with Samrakshane and Bhoomi RTC land database.',
    eligibility: 'Registered landholders in Karnataka experiencing over 33% crop damage.\n- Quick assessment through satellite and mobile app survey\n- Instant input subsidy credited via Aadhaar DBT',
    category: 'crop_loss',
    link: 'https://samrakshane.karnataka.gov.in/'
  }
];

const buyersData = [
  {
    name: 'Ramesh Agro Traders',
    company: 'Karnataka Food Processors Ltd',
    crop_interest: 'Paddy (Sona Masuri)',
    phone_number: '9845123456',
    location: 'Raichur APMC Yard',
    rating: 4.9
  },
  {
    name: 'Kolar Agro Spices',
    company: 'Fresh Veggies Supply Chain',
    crop_interest: 'Tomato',
    phone_number: '9741654321',
    location: 'Kolar Market Yard',
    rating: 4.8
  },
  {
    name: 'Mysuru Organic Mills',
    company: 'Cauvery Bio-Foods',
    crop_interest: 'Ragi (Finger Millet)',
    phone_number: '9900887766',
    location: 'Mysuru APMC',
    rating: 4.9
  },
  {
    name: 'Malnad Coffee Exporters',
    company: 'Western Ghats Estates',
    crop_interest: 'Coffee (Arabica)',
    phone_number: '9448112233',
    location: 'Chikkamagaluru Trade Hub',
    rating: 5.0
  },
  {
    name: 'Mandya Sugar Mill Syndicate',
    company: 'Deccan Sugars Co.',
    crop_interest: 'Sugarcane',
    phone_number: '9880554433',
    location: 'Mandya Industrial Area',
    rating: 4.7
  }
];

const harvestListingsData = [
  {
    sellerName: 'Mahendra Gowda',
    sellerPhone: '9845012345',
    sellerEmail: 'mahendra@farmx.in',
    village: 'Gejjalagere',
    district: 'Mandya',
    cropName: 'Sugarcane',
    variety: 'Co-86032 High Brix Grade',
    quantityQuintals: 150,
    basePricePerQuintal: 3200,
    expectedHarvestDate: '2026-09-25',
    description: 'Fresh mature cane with excellent sugar recovery rate. Ready for immediate mill procurement.',
    status: 'available',
    offers: [
      {
        buyerName: 'Mandya Sugar Mill Syndicate',
        buyerPhone: '9880554433',
        offeredPrice: 3150,
        quantityQuintals: 150,
        message: 'Can pick up directly from field with our tractor trailers.',
        status: 'pending'
      }
    ]
  },
  {
    sellerName: 'Suresh Patil',
    sellerPhone: '9741234567',
    sellerEmail: 'suresh.patil@farmx.in',
    village: 'Sindhanur',
    district: 'Raichur',
    cropName: 'Paddy (Sona Masuri)',
    variety: 'Premium Aged Sona Masuri',
    quantityQuintals: 80,
    basePricePerQuintal: 2600,
    expectedHarvestDate: '2026-10-05',
    description: 'Zero pesticide residue, single-origin paddy dried to standard 14% moisture.',
    status: 'available',
    offers: [
      {
        buyerName: 'Ramesh Agro Traders',
        buyerPhone: '9845123456',
        offeredPrice: 2550,
        quantityQuintals: 80,
        message: 'Ready to pay 50% advance upon visual bag inspection.',
        status: 'pending'
      }
    ]
  },
  {
    sellerName: 'Anand Kumar',
    sellerPhone: '9900112233',
    sellerEmail: 'anand@farmx.in',
    village: 'Bangarapet',
    district: 'Kolar',
    cropName: 'Tomato',
    variety: 'Shivam Hybrid Grade 1',
    quantityQuintals: 45,
    basePricePerQuintal: 1400,
    expectedHarvestDate: '2026-09-15',
    description: 'Firm, uniform size tomatoes suitable for long distance transport to Bengaluru markets.',
    status: 'available',
    offers: []
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmx');
    console.log('[Seeder]: Connected to MongoDB.');

    // Clear old data
    await Crop.deleteMany();
    await Scheme.deleteMany();
    await Buyer.deleteMany();
    await HarvestListing.deleteMany();
    await User.deleteMany();
    console.log('[Seeder]: Cleared existing collections.');

    // Create demo users (Farmer & Buyer)
    await User.create({
      username: 'mahendra',
      email: 'mahendra@farmx.in',
      password: 'password123',
      first_name: 'Mahendra',
      last_name: 'Gowda',
      role: 'farmer',
      phone: '9845012345',
      village: 'Gejjalagere',
      district: 'Mandya',
      landSizeAcres: 5,
      primaryCrop: 'Sugarcane'
    });

    await User.create({
      username: 'buyer_ramesh',
      email: 'ramesh@agrotraders.in',
      password: 'password123',
      first_name: 'Ramesh',
      last_name: 'Patel',
      role: 'buyer',
      phone: '9845123456',
      district: 'Raichur'
    });
    console.log('[Seeder]: Seeded demo users (mahendra / password123).');

    // Generate 14-day history for each crop
    const today = new Date();
    for (const c of cropsData) {
      const currentPrice = Math.floor(Math.random() * (c.max - c.min + 1)) + c.min;
      const trend = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)];
      const history = [];

      for (let i = 13; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        const dayPrice = Math.round(currentPrice * (1 + (Math.random() * 0.12 - 0.06)));
        history.push({ date: dayStr, price: Math.max(c.min, Math.min(c.max, dayPrice)) });
      }

      await Crop.create({
        name: c.name,
        current_price: currentPrice,
        location: c.location,
        trend,
        category: 'Agricultural Commodity',
        price_range: { min: c.min, max: c.max },
        price_history: history
      });
    }
    console.log(`[Seeder]: Seeded ${cropsData.length} APMC Crops with 14-day price histories.`);

    // Seed schemes
    await Scheme.insertMany(schemesData);
    console.log(`[Seeder]: Seeded ${schemesData.length} Government Schemes.`);

    // Seed buyers
    await Buyer.insertMany(buyersData);
    console.log(`[Seeder]: Seeded ${buyersData.length} Verified Buyers.`);

    // Seed e-Mandi listings
    await HarvestListing.insertMany(harvestListingsData);
    console.log(`[Seeder]: Seeded ${harvestListingsData.length} e-Mandi Harvest Listings with Offers.`);

    console.log('[Seeder]: All data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`[Seeder Error]: ${err.message}`);
    process.exit(1);
  }
}

seed();
