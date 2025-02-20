import { body } from 'express-validator';

export const orderValidation = {
  createOrder: [
    body()
      .custom((value, { req }) => {
        const requiredFields = [
          'pickupAddress',
          'pickupContact',
          'deliveryAddress',
          'deliveryContact',
          'packageType',
          'weight',
          'scheduledDate',
          'priority',
          'cost',
          'estimatedDelivery'
        ];

        for (const field of requiredFields) {
          if (!req.body[field]) {
            throw new Error(`${field} is required`);
          }
        }

        return true;
      })
  ],

  updateStatus: [
    body('status')
      .exists()
      .withMessage('Status is required')
      .isIn(['in_transit', 'delivered', 'cancelled'])
      .withMessage('Invalid status')
  ]
};