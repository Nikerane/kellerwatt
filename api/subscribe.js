const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'KellerWatt <signup@kellerwatt.de>',
      to: process.env.NOTIFY_EMAIL,
      subject: 'New KellerWatt registration',
      text: `New signup from kellerwatt.de:\n\nEmail: ${email}`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send email:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
};
