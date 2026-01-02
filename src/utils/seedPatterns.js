const Pattern = require('../models/pattern');

const patternsData = [
  { name: '4-Corner Block', belt: 'White', kup: '10th Kup', level: 'Junior', order: 1 },
  { name: 'Sajo Jirugi 1', belt: 'White', kup: '10th Kup', level: 'Adult', order: 2 },
  { name: 'Sajo Jirugi 1', belt: 'White', kup: '10th Kup', level: 'Adult', order: 3 },
  { name: 'Sajo Makgi', belt: 'White', kup: '10th Kup', level: 'Adult', order: 4 },
  { name: 'Sajo Jirugi 1', belt: 'Orange Stripe', kup: 'PUMA 1', level: 'Junior', order: 5 },
  { name: 'Sajo Jirugi 1', belt: 'Orange Stripe', kup: 'PUMA 1', level: 'Junior', order: 6 },
  { name: 'Sajo Makgi', belt: 'Orange Stripe', kup: 'PUMA 1', level: 'Junior', order: 7 },
  { name: 'Sajo Jirugi 1', belt: 'Purple Stripe', kup: 'PUMA 2', level: 'Junior', order: 8 },
  { name: 'Sajo Jirugi 1', belt: 'Purple Stripe', kup: 'PUMA 2', level: 'Junior', order: 9 },
  { name: 'Sajo Makgi', belt: 'Purple Stripe', kup: 'PUMA 2', level: 'Junior', order: 10 },
  { name: 'Chon-Ji', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', order: 11 },
  { name: 'Dan-Gun', belt: 'Yellow', kup: '8th Kup', level: 'Both', order: 12 },
  { name: 'Do-San', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', order: 13 },
  { name: 'Won-Hyo', belt: 'Green', kup: '6th Kup', level: 'Both', order: 14 },
  { name: 'Yul-Gok', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', order: 15 },
  { name: 'Joong-Gun', belt: 'Blue', kup: '4th Kup', level: 'Both', order: 16 },
  { name: 'Toi-Gye', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', order: 17 },
  { name: 'Hwa-Rang', belt: 'Red', kup: '2nd Kup', level: 'Both', order: 18 },
  { name: 'Choong-Moo', belt: 'Black Stripe', kup: '1st Kup', level: 'Both', order: 19 },
  { name: 'Kwang-Gae', belt: 'Black Grade 1', kup: 'Il Dan', level: 'Both', order: 20 },
  { name: 'Po-Eun', belt: 'Black Grade 1', kup: 'Il Dan', level: 'Both', order: 21 },
  { name: 'Ge-Baek', belt: 'Black Grade 1', kup: 'Il Dan', level: 'Both', order: 22 },
  { name: 'Eui-Am', belt: 'Black Grade 2', kup: 'Ee Dan', level: 'Both', order: 23 },
  { name: 'Choong-Jang', belt: 'Black Grade 2', kup: 'Ee Dan', level: 'Both', order: 24 },
  { name: 'Ko-Dang', belt: 'Black Grade 2', kup: 'Ee Dan', level: 'Both', order: 25 },
  { name: 'Sam-Il', belt: 'Black Grade 3', kup: 'Sam Dan', level: 'Both', order: 26 },
  { name: 'Yoo-Sin', belt: 'Black Grade 3', kup: 'Sam Dan', level: 'Both', order: 27 },
  { name: 'Choi-Yong', belt: 'Black Grade 3', kup: 'Sam Dan', level: 'Both', order: 28 },
  { name: 'Yong-Gae', belt: 'Black Grade 4', kup: 'Sa Dan', level: 'Both', order: 29 },
  { name: 'Ul-Ji', belt: 'Black Grade 4', kup: 'Sa Dan', level: 'Both', order: 30 },
  { name: 'Moon-Moo', belt: 'Black Grade 4', kup: 'Sa Dan', level: 'Both', order: 31 },
  { name: 'So-San', belt: 'Black Grade 5', kup: 'Oh Dan', level: 'Both', order: 32 },
  { name: 'Se-Jong', belt: 'Black Grade 5', kup: 'Oh Dan', level: 'Both', order: 33 },
  { name: 'Tong-Il', belt: 'Black Grade 6', kup: 'Yuk Dan', level: 'Both', order: 34 }
];

async function seedPatterns() {
  try {
    // Check if patterns already exist
    const count = await Pattern.countDocuments();
    if (count > 0) {
      console.log('Patterns already seeded. Skipping...');
      return;
    }

    // Insert patterns
    await Pattern.insertMany(patternsData);
    console.log('✅ Successfully seeded patterns data');
  } catch (err) {
    console.error('❌ Error seeding patterns:', err);
  }
}

module.exports = seedPatterns;
