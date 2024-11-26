import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'thanhlongn08@gmail.com',
    pass: 'zbco cvue inzj vnzy'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export const sendBookingConfirmationEmail = async (booking) => {
  try {
    const mailOptions = {
      from: '"Tour Booking" <thanhlongn08@gmail.com>',
      to: booking.customerEmail,
      subject: 'Tour Booking Confirmation',
      html: `
        <h1>Booking Confirmation</h1>
        <p>Dear ${booking.customerName},</p>
        <p>Thank you for booking with us! Your booking has been confirmed.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li>Tour: ${booking.tourName}</li>
          <li>Departure Date: ${new Date(booking.departureDate).toLocaleDateString()}</li>
          <li>Departure Time: ${booking.departureTime}</li>
          <li>Return Date: ${new Date(booking.returnDate).toLocaleDateString()}</li>
          <li>Return Time: ${booking.returnTime}</li>
          <li>Transportation: ${booking.transportation}</li>
          <li>Adults: ${booking.numberOfAdults}</li>
          <li>Children: ${booking.numberOfChildren}</li>
          <li>Total Amount: $${booking.totalPrice}</li>
        </ul>
        <p>If you have any questions, please contact us.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}; 