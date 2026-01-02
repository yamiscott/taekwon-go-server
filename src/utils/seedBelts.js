const Belt = require('../models/belt');

const beltsData = [
  { name: 'White', kup: '10th Kup', level: 'Both', order: 1, color: '#FFFFFF', isDan: false, isPuma: false },
  { name: 'Orange Stripe', kup: 'PUMA 1', level: 'Junior', order: 2, color: '#FFA500', isDan: false, isPuma: true },
  { name: 'Purple Stripe', kup: 'PUMA 2', level: 'Junior', order: 3, color: '#9370DB', isDan: false, isPuma: true },
  { name: 'Yellow Stripe', kup: '9th Kup', level: 'Both', order: 4, color: '#FFEB3B', isDan: false, isPuma: false },
  { name: 'Yellow', kup: '8th Kup', level: 'Both', order: 5, color: '#FDD835', isDan: false, isPuma: false },
  { name: 'Green Stripe', kup: '7th Kup', level: 'Both', order: 6, color: '#4CAF50', isDan: false, isPuma: false },
  { name: 'Green', kup: '6th Kup', level: 'Both', order: 7, color: '#388E3C', isDan: false, isPuma: false },
  { name: 'Blue Stripe', kup: '5th Kup', level: 'Both', order: 8, color: '#2196F3', isDan: false, isPuma: false },
  { name: 'Blue', kup: '4th Kup', level: 'Both', order: 9, color: '#1565C0', isDan: false, isPuma: false },
  { name: 'Red Stripe', kup: '3rd Kup', level: 'Both', order: 10, color: '#F44336', isDan: false, isPuma: false },
  { name: 'Red', kup: '2nd Kup', level: 'Both', order: 11, color: '#C62828', isDan: false, isPuma: false },
  { name: 'Black Stripe', kup: '1st Kup', level: 'Both', order: 12, color: '#424242', isDan: false, isPuma: false },
  { name: 'Black Grade 1', kup: 'Il Dan', level: 'Both', order: 13, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 2', kup: 'Ee Dan', level: 'Both', order: 14, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 3', kup: 'Sam Dan', level: 'Both', order: 15, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 4', kup: 'Sa Dan', level: 'Both', order: 16, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 5', kup: 'Oh Dan', level: 'Both', order: 17, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 6', kup: 'Yuk Dan', level: 'Both', order: 18, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 7', kup: 'Chil Dan', level: 'Both', order: 19, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 8', kup: 'Pal Dan', level: 'Both', order: 20, color: '#000000', isDan: true, isPuma: false },
  { name: 'Black Grade 9', kup: 'Gu Dan', level: 'Both', order: 21, color: '#000000', isDan: true, isPuma: false }
];

async function seedBelts() {
  try {
    // Check if belts already exist
    const count = await Belt.countDocuments();
    if (count > 0) {
      console.log('Belts already seeded. Skipping...');
      return;
    }

    // Insert belts
    await Belt.insertMany(beltsData);
    console.log('✅ Successfully seeded belts data');
  } catch (err) {
    console.error('❌ Error seeding belts:', err);
  }
}

module.exports = seedBelts;
