const express = require('express');
const Admin = require('../models/admin');
const User = require('../models/user');
const School = require('../models/school');
const auth = require('../middleware/auth');

const router = express.Router();

async function getRequester(req) {
  if (!req.user || !req.user.sub) return null;
  return Admin.findById(req.user.sub).populate('school');
}

// Get dashboard statistics
router.get('/stats', auth, async (req, res, next) => {
  try {
    const requester = await getRequester(req);
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    if (requester.role === 'school') {
      // School Admin Dashboard
      const schoolId = requester.school?._id || requester.school;
      if (!schoolId) return res.json({ error: 'No school assigned' });

      const school = await School.findById(schoolId);
      const users = await User.find({ school: schoolId });
      const totalStudents = users.length;
      const acceptedStudents = users.filter(u => u.acceptedAt).length;

      return res.json({
        school: {
          name: school?.name || '',
          address: school?.address || '',
          logoUrl: school?.logoUrl || null
        },
        totalStudents,
        acceptedStudents
      });
    }

    // Super Admin Dashboard
    const schools = await School.find();
    const users = await User.find();
    const admins = await Admin.find();

    // Count users by school for ranking
    const schoolUserCounts = await User.aggregate([
      { $match: { school: { $ne: null } } },
      { $group: { _id: '$school', count: { $sum: 1 }, acceptedCount: { $sum: { $cond: [{ $ne: ['$acceptedAt', null] }, 1, 0] } } } },
      { $sort: { acceptedCount: -1 } },
      { $limit: 10 }
    ]);

    // Populate school names for top schools by members
    const topSchoolsByMembers = await Promise.all(
      schoolUserCounts.map(async (item) => {
        const school = await School.findById(item._id);
        return {
          _id: item._id,
          name: school?.name || 'Unknown',
          count: item.acceptedCount
        };
      })
    );

    // Count admins by school for ranking
    const schoolAdminCounts = await Admin.aggregate([
      { $match: { school: { $ne: null }, role: 'school' } },
      { $group: { _id: '$school', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Populate school names for top schools by admins
    const topSchoolsByAdmins = await Promise.all(
      schoolAdminCounts.map(async (item) => {
        const school = await School.findById(item._id);
        return {
          _id: item._id,
          name: school?.name || 'Unknown',
          count: item.count
        };
      })
    );

    return res.json({
      totalSchools: schools.length,
      totalUsers: users.length,
      acceptedUsers: users.filter(u => u.acceptedAt).length,
      topSchoolsByMembers,
      topSchoolsByAdmins
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
