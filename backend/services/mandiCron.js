const cron = require('node-cron');
const Crop = require('../models/Crop');

/**
 * Updates daily Mandi crop prices and shifts the 14-day history array.
 */
async function syncMandiPrices() {
  try {
    const crops = await Crop.find();
    if (!crops || crops.length === 0) {
      console.log('[Mandi Sync]: No crops found in database to update.');
      return { success: true, count: 0 };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let updatedCount = 0;

    for (const crop of crops) {
      // Simulate market variation based on previous price (-4% to +5%)
      const variationPct = (Math.random() * 9 - 4) / 100;
      const minPrice = crop.price_range?.min || Math.round(crop.current_price * 0.7);
      const maxPrice = crop.price_range?.max || Math.round(crop.current_price * 1.4);

      let newPrice = Math.round(crop.current_price * (1 + variationPct));
      newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

      let trend = 'stable';
      if (newPrice > crop.current_price * 1.01) trend = 'up';
      else if (newPrice < crop.current_price * 0.99) trend = 'down';

      crop.current_price = newPrice;
      crop.trend = trend;

      if (!crop.price_history) crop.price_history = [];

      const existingIndex = crop.price_history.findIndex((h) => h.date === todayStr);
      if (existingIndex >= 0) {
        crop.price_history[existingIndex].price = newPrice;
      } else {
        crop.price_history.push({ date: todayStr, price: newPrice });
      }

      // Maintain latest 14 days history
      if (crop.price_history.length > 14) {
        crop.price_history = crop.price_history.slice(-14);
      }

      await crop.save();
      updatedCount++;
    }

    console.log(`[Mandi Sync]: Updated ${updatedCount} APMC crops on ${todayStr}`);
    return { success: true, count: updatedCount, date: todayStr };
  } catch (error) {
    console.error(`[Mandi Sync Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
}

function initMandiCron() {
  cron.schedule('0 6 * * *', async () => {
    console.log('[Cron Job]: 06:00 AM Daily APMC Mandi Price Update Running...');
    await syncMandiPrices();
  });
  console.log('[Mandi Cron Service]: Registered (Daily at 06:00 AM IST)');
}

module.exports = { syncMandiPrices, initMandiCron };
