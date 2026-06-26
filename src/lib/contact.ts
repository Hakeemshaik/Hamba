// Your support contact details — set these to your real channels once you have
// them. They power the Help, Contact us and complaint screens in one place.
export const SUPPORT = {
  whatsapp: '27000000000', // digits only, international format (no + or spaces)
  phone: '+27 00 000 0000',
  email: 'support@hamba.co.za',
  hours: 'Mon–Sat · 07:00–19:00',
}

export const whatsappLink = `https://wa.me/${SUPPORT.whatsapp}`
export const telLink = `tel:${SUPPORT.phone.replace(/\s/g, '')}`
export const mailLink = `mailto:${SUPPORT.email}`
