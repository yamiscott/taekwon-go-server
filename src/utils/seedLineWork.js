const LineWork = require('../models/lineWork');

const lineWorkData = [
  { name: 'Pressups', belt: 'White', kup: '10th Kup', level: 'Both', reps: 10, sets: 1, cadence: 2, order: 1 },
  { name: 'Stance Single Punch', belt: 'White', kup: '10th Kup', level: 'Both', reps: 10, sets: 1, cadence: 1.5, order: 2 },
  { name: 'Front Rising Kick', belt: 'White', kup: '10th Kup', level: 'Both', reps: 10, sets: 2, cadence: 2, order: 3 },
  { name: 'Jab Cross', belt: 'White', kup: '10th Kup', level: 'Both', reps: 10, sets: 1, cadence: 2, order: 4 },
  { name: 'Walking Stance Middle Punch', belt: 'White', kup: '10th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 5 },
  { name: 'Walking Stance Low Outer Forearm Block', belt: 'White', kup: '10th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 6 },
  { name: 'Walking Stance Middle Punch & Reverse Punch', belt: 'White', kup: '10th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3, order: 7 },
  { name: 'Sitting Stance Double Punches', belt: 'Orange', kup: 'PUMA 1', level: 'Junior', reps: 10, sets: 1, cadence: 2, order: 8 },
  { name: 'Guarding Stance Front kick & Jab Cross', belt: 'Orange', kup: 'PUMA 1', level: 'Junior', reps: 10, sets: 1, cadence: 2.5, order: 9 },
  { name: 'Walking Stance Rising block', belt: 'Orange', kup: 'PUMA 1', level: 'Junior', reps: 3, sets: 4, cadence: 2, order: 10 },
  { name: 'Jumping Front Kick', belt: 'Purple', kup: 'PUMA 2', level: 'Junior', reps: 3, sets: 1, cadence: 3, order: 11 },
  { name: 'Side Kick', belt: 'Purple', kup: 'PUMA 2', level: 'Junior', reps: 3, sets: 1, cadence: 3, order: 12 },
  { name: 'Sitting Stance Double Punches', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', reps: 10, sets: 1, cadence: 2, order: 13 },
  { name: 'L\'Stance Forearm Guarding Block', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 14 },
  { name: 'Walking Stance Low Block & Rising Block', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3, order: 15 },
  { name: 'Walking Stance Front Kick, Double Punch (Fast Motion)', belt: 'Yellow Stripe', kup: '9th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 16 },
  { name: 'L\'Stance Double Knifehand Guarding Block', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 17 },
  { name: 'L\'Stance Twin Forearm Block', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 18 },
  { name: 'L\'Stance Knifehand Strike', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 19 },
  { name: 'L\'Stance Inward Outer Forearm Block', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 20 },
  { name: 'Sparring Turning Kick', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 21 },
  { name: 'Traditional Turning Kick', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 22 },
  { name: 'Traditional Side Kick', belt: 'Yellow', kup: '8th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 23 },
  { name: 'Walking Stance High Section Outer Forearm Block & Reverse Punch', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 24 },
  { name: 'Walking Stance Wedging Block & front Kick Double Punch (Fast Motion)', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 25 },
  { name: 'Walking Stance Spearfinger Thrust', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 26 },
  { name: 'Walking Stance Backfist Strike', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 27 },
  { name: 'Guarding Stance Front Snap Kick', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 28 },
  { name: 'Guarding Stance Turning Kick', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 29 },
  { name: 'Guarding Stance Side Kick', belt: 'Green Stripe', kup: '7th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 30 },
  { name: 'L\'Stance Twin Forearm Block & Inward Knifehand Strike', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 31 },
  { name: 'L\'Stance Twin Forearm Block & Inward Knifehand Strike moving to Fixed Stance & Side punch', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3.5, order: 32 },
  { name: 'Bending Stance & Side kick land in Knifehand Guard Block', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 3, sets: 2, cadence: 4, order: 33 },
  { name: 'Walking Stance Circular Block', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3, order: 34 },
  { name: 'Walking Stance Circular Block, Snap kick & Reverse Punch', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4.5, order: 35 },
  { name: 'Guarding Stance Front Snap Kick & Turning Kick', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4, order: 36 },
  { name: 'Guarding Stance Side Kick & Turning Kick', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4, order: 37 },
  { name: 'Guarding Stance Side Kick & Back Kick', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4.5, order: 38 },
  { name: 'Guarding Stance Turning Kick & Back Kick', belt: 'Green', kup: '6th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4.5, order: 39 },
  { name: 'Walking Stance Hooking Block', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 40 },
  { name: 'Walking Stance Double Hooking Block & Punch', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3.5, order: 41 },
  { name: 'Bending Stance Side kick & Elbow Strike', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 2, cadence: 4.5, order: 42 },
  { name: 'L\'Stance Twin Knifehand Block', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 43 },
  { name: 'X Stance', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 1, sets: 6, cadence: 3, order: 44 },
  { name: 'Walking Stance Double Forearm Block', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 45 },
  { name: 'Guarding Stance Downward (Axe) Kick', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 3, sets: 2, cadence: 3, order: 46 },
  { name: 'Guarding Stance Reverse Turning Kick', belt: 'Blue Stripe', kup: '5th Kup', level: 'Both', reps: 2, sets: 4, cadence: 3.5, order: 47 },
  { name: 'L\'Stance Reverse Knifehand Block', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 48 },
  { name: 'L\'Stance Upward Plam Block', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 49 },
  { name: 'Low Stance Pressing Block', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 3, order: 50 },
  { name: 'Fixed Stance U\'Shape Block', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 51 },
  { name: 'Walking Stance Twin Vertical Fist', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 52 },
  { name: 'Walking Stance Rising X\'Fist Block', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 53 },
  { name: 'Walking Stance Backfist, Release & Punch combo', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 4, cadence: 4, order: 54 },
  { name: 'Guarding Stance Hook Kick', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 3, sets: 2, cadence: 4, order: 55 },
  { name: 'Guarding Stance Reverse Turning Kick', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4, order: 56 },
  { name: 'Guarding Stance Reverse Turning Hooking Kick', belt: 'Blue', kup: '4th Kup', level: 'Both', reps: 2, sets: 4, cadence: 4, order: 57 },
  { name: 'Walking Stance Upset Spearfinger Thrust', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 3, order: 58 },
  { name: 'High section Flat Spearfinger Thrust in L\'Stance', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 59 },
  { name: 'W\'shape block in Sitting stance', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 10, sets: 1, cadence: 2, order: 60 },
  { name: 'Upward Knee strike', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 61 },
  { name: 'X\'fist pressing block', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 62 },
  { name: 'L\'stance & Low Double Forearm pushing Block', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2.5, order: 63 },
  { name: 'L\'Stance Low Double Knifehand Guarding Block', belt: 'Red Stripe', kup: '3rd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 64 },
  { name: 'L\'Stance & Upwards Punch', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 65 },
  { name: 'Vertical Stance & Downward Knifehand Strike', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 66 },
  { name: 'Grasp, Side Kick &Knifehand Strike Combo', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 3, sets: 4, cadence: 4, order: 67 },
  { name: '2 x High Turning kick - Consecutive kicks', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 2, sets: 4, cadence: 5, order: 68 },
  { name: 'L\'Stance & Mid Obverse Punch', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 3, sets: 4, cadence: 2, order: 69 },
  { name: 'L\'Stance Mid Obverse Punch, shifting to Walking Stance X\'fist pressing Block & Side Elbow Strike', belt: 'Red', kup: '2nd Kup', level: 'Both', reps: 2, sets: 4, cadence: 5, order: 70 }
];

const seedLineWork = async () => {
  try {
    const count = await LineWork.countDocuments();
    if (count === 0) {
      await LineWork.insertMany(lineWorkData);
      console.log('Line work data seeded');
    }
  } catch (err) {
    console.error('Error seeding line work:', err);
  }
};

module.exports = seedLineWork;
