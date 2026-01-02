const Sparring = require('../models/sparring');

const sparringData = [
  { name: 'Three Step Sparring 1', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', order: 1, type: 'Three Step' },
  { name: 'Three Step Sparring 2', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', order: 2, type: 'Three Step' },
  { name: 'Three Step Sparring 3', belt: 'Yellow', kup: '8th Kup', level: 'Both', order: 3, type: 'Three Step' },
  { name: 'Three Step Sparring 4', belt: 'Yellow', kup: '8th Kup', level: 'Both', order: 4, type: 'Three Step' },
  { name: 'Three Step Sparring 5', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', order: 5, type: 'Three Step' },
  { name: 'Three Step Sparring 6', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', order: 6, type: 'Three Step' },
  { name: 'Two Step Sparring 1', belt: 'Green', kup: '6th Kup', level: 'Both', order: 7, type: 'Two Step' },
  { name: 'Two Step Sparring 2', belt: 'Green', kup: '6th Kup', level: 'Both', order: 8, type: 'Two Step' },
  { name: 'Two Step Sparring 3', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', order: 9, type: 'Two Step' },
  { name: 'Two Step Sparring 4', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', order: 10, type: 'Two Step' },
  { name: 'Free Sparring (Padded)', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', order: 11, type: 'Free' },
  { name: 'One Step Sparring', belt: 'Blue', kup: '4th Kup', level: 'Both', order: 12, type: 'One Step' }
];

async function seedSparring() {
  try {
    // Check if sparring already exists
    const count = await Sparring.countDocuments();
    if (count > 0) {
      console.log('Sparring already seeded. Skipping...');
      return;
    }

    // Insert sparring
    await Sparring.insertMany(sparringData);
    console.log('✅ Successfully seeded sparring data');
  } catch (err) {
    console.error('❌ Error seeding sparring:', err);
  }
}

module.exports = seedSparring;
