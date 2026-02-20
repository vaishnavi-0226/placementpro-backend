const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// GENERATE RESUME
// GET /api/resume/generate
// Returns a downloadable PDF
router.get('/generate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Tell browser this is a PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${user.name}_resume.pdf"`);
    doc.pipe(res); // stream PDF directly to response

    // NAME & CONTACT
    doc.fontSize(22).font('Helvetica-Bold').text(user.name, { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(user.email, { align: 'center' });
    doc.text(user.phone || '', { align: 'center' });
    doc.moveDown();

    // EDUCATION
    if (user.education?.degree) {
      doc.fontSize(13).font('Helvetica-Bold').text('EDUCATION');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.fontSize(11).font('Helvetica')
        .text(`${user.education.degree} — ${user.education.branch}`)
        .text(`${user.education.college} | ${user.education.year}`)
        .text(`CGPA: ${user.cgpa}`);
      doc.moveDown();
    }

    // SKILLS
    if (user.skills?.length) {
      doc.fontSize(13).font('Helvetica-Bold').text('SKILLS');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.fontSize(11).font('Helvetica').text(user.skills.join(', '));
      doc.moveDown();
    }

    // PROJECTS
    if (user.projects?.length) {
      doc.fontSize(13).font('Helvetica-Bold').text('PROJECTS');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      user.projects.forEach(p => {
        doc.fontSize(11).font('Helvetica-Bold').text(p.title);
        doc.font('Helvetica').text(p.description);
        doc.text(`Tech: ${p.techStack}`);
        doc.moveDown(0.5);
      });
      doc.moveDown();
    }

    // ACHIEVEMENTS
    if (user.achievements?.length) {
      doc.fontSize(13).font('Helvetica-Bold').text('ACHIEVEMENTS');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      user.achievements.forEach(a => {
        doc.fontSize(11).font('Helvetica').text(`• ${a}`);
      });
      doc.moveDown();
    }

    // INTERNSHIPS
    if (user.internships?.length) {
      doc.fontSize(13).font('Helvetica-Bold').text('INTERNSHIPS');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      user.internships.forEach(i => {
        doc.fontSize(11).font('Helvetica-Bold').text(`${i.role} — ${i.company}`);
        doc.font('Helvetica').text(i.duration);
        doc.moveDown(0.5);
      });
    }

    doc.end(); // finalize PDF

  } catch (err) {
    res.status(500).json({ msg: 'Error generating resume', error: err.message });
  }
});

module.exports = router;