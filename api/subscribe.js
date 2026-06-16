const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'KellerWatt <signup@kellerwatt.de>',
    to: process.env.NOTIFY_EMAIL,
    subject: 'New KellerWatt registration',
    text: `New signup from kellerwatt.de:\n\nEmail: ${email}`,
  });

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true, id: data?.id });
};
