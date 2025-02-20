import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

class EmailService {
  constructor() {
    // Only create transporter if SMTP settings are configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      logger.warn('Email service not configured. Emails will be logged but not sent.');
    }
  }

  async sendEmail(to, subject, html) {
    try {
      // If email service is not configured, just log the email
      if (!this.transporter) {
        logger.info('Would send email:', { to, subject, html });
        return { messageId: 'EMAIL_SERVICE_NOT_CONFIGURED' };
      }

      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@porter-logistics.com',
        to,
        subject,
        html
      });
      logger.info('Email sent:', info.messageId);
      return info;
    } catch (error) {
      logger.error('Email error:', error);
      // Don't throw the error, just return null
      return null;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Porter Logistics';
    const html = `
      <h1>Welcome aboard, ${user.fullName}!</h1>
      <p>Thank you for joining Porter Logistics. We're excited to have you as part of our community.</p>
    `;
    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation #${order._id}`;
    const html = `
      <h1>Order Confirmation</h1>
      <p>Your order has been successfully placed.</p>
      <p>Order ID: ${order._id}</p>
      <p>Status: ${order.status}</p>
      <h2>Order Details</h2>
      <ul>
        <li>Pickup Address: ${order.pickupAddress}</li>
        <li>Delivery Address: ${order.deliveryAddress}</li>
        <li>Package Type: ${order.packageType}</li>
        <li>Weight: ${order.weight} kg</li>
        <li>Scheduled Date: ${new Date(order.scheduledDate).toLocaleString()}</li>
        <li>Cost: $${order.cost}</li>
      </ul>
    `;
    return this.sendEmail(user.email, subject, html);
  }

  async sendOrderStatusUpdate(user, order) {
    const subject = `Order Status Update #${order._id}`;
    const html = `
      <h1>Order Status Update</h1>
      <p>Your order status has been updated.</p>
      <p>Order ID: ${order._id}</p>
      <p>New Status: ${order.status}</p>
      <p>Updated at: ${new Date().toLocaleString()}</p>
    `;
    return this.sendEmail(user.email, subject, html);
  }
}

export default new EmailService();