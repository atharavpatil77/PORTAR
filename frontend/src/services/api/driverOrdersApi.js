import axiosInstance from '../../utils/http/axiosInstance';
import { API_ENDPOINTS } from '../../config/api.config';
import { withRetry } from '../../utils/network/retryHandler';

// Temporary mock data
const mockDrivers = [
  {
    id: '1',
    name: "John Smith",
    rating: 4.8,
    totalOrders: 156,
    status: "Active",
    orders: [
      {
        id: "ORD001",
        customer: "Alice Johnson",
        pickup: "Mumbai Central",
        delivery: "Andheri West",
        status: "DELIVERED",
        date: new Date().toISOString(),
        amount: 450.00
      },
      {
        id: "ORD002",
        customer: "Bob Wilson",
        pickup: "Bandra East",
        delivery: "Juhu Beach",
        status: "IN_TRANSIT",
        date: new Date().toISOString(),
        amount: 320.75
      }
    ]
  },
  {
    id: '2',
    name: "Sarah Davis",
    rating: 4.9,
    totalOrders: 142,
    status: "Active",
    orders: [
      {
        id: "ORD003",
        customer: "Charlie Brown",
        pickup: "Colaba",
        delivery: "Worli",
        status: "PENDING",
        date: new Date().toISOString(),
        amount: 275.50
      }
    ]
  }
];

export const driverOrdersApi = {
  getAllDriversWithOrders: withRetry(async () => {
    try {
      console.log('Fetching data...');
      
      // For now, return mock data
      // TODO: Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return mockDrivers;

      // Commented out real implementation until backend is ready
      /*
      const ordersResponse = await axiosInstance.get(API_ENDPOINTS.orders.list);
      console.log('Orders response:', ordersResponse);
      const orders = ordersResponse.data || [];

      const driversMap = new Map();
      
      orders.forEach(order => {
        if (order.driver && order.driver._id) {
          if (!driversMap.has(order.driver._id)) {
            driversMap.set(order.driver._id, {
              id: order.driver._id,
              name: order.driver.name || 'Unknown Driver',
              rating: order.driver.rating || 4.5,
              status: order.driver.status || 'Active',
              totalOrders: 0,
              orders: []
            });
          }
          
          const driverData = driversMap.get(order.driver._id);
          driverData.orders.push({
            id: order._id,
            customer: order.user?.name || 'Unknown Customer',
            pickup: order.pickup?.address || 'N/A',
            delivery: order.delivery?.address || 'N/A',
            status: order.status || 'PENDING',
            date: order.createdAt || new Date().toISOString(),
            amount: order.amount || 0
          });
          driverData.totalOrders++;
        }
      });

      return Array.from(driversMap.values());
      */
    } catch (error) {
      console.error('Error in getAllDriversWithOrders:', error);
      throw error;
    }
  }),

  updateOrderStatus: withRetry(async (orderId, status) => {
    try {
      console.log('Updating order status:', { orderId, status });
      
      // For now, just simulate success
      // TODO: Replace with real API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return { success: true };

      /*
      const response = await axiosInstance.patch(API_ENDPOINTS.orders.details(orderId), {
        status
      });
      return response.data;
      */
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  })
};
