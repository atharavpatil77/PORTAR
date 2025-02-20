export const ORDER_STATUS = {
  PENDING: 'pending',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const getStatusColor = (status) => {
  const colors = {
    [ORDER_STATUS.PENDING]: 'yellow',
    [ORDER_STATUS.PICKED_UP]: 'blue',
    [ORDER_STATUS.IN_TRANSIT]: 'indigo',
    [ORDER_STATUS.DELIVERED]: 'green',
    [ORDER_STATUS.CANCELLED]: 'red'
  };
  return colors[status] || 'gray';
};

export const getStatusLabel = (status) => {
  const labels = {
    [ORDER_STATUS.PENDING]: 'Pending Pickup',
    [ORDER_STATUS.PICKED_UP]: 'Picked Up',
    [ORDER_STATUS.IN_TRANSIT]: 'In Transit',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.CANCELLED]: 'Cancelled'
  };
  return labels[status] || 'Unknown';
};