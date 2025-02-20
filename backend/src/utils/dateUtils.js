export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

export const calculateDeliveryWindow = (date, packageType) => {
  const deliveryTimes = {
    document: 1,
    parcel: 2,
    fragile: 3,
    heavy: 4
  };

  const days = deliveryTimes[packageType] || 2;
  return addDays(date, days);
};