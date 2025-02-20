const sampleDrivers = [
  {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@example.com",
    phone: "9876543210",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    vehicleType: "truck",
    vehicleNumber: "MH01AB1234",
    vehicleCapacity: 1000,
    drivingLicense: {
      number: "DL123456789",
      expiryDate: "2025-12-31",
      verified: true
    },
    identityProof: {
      type: "aadhar",
      number: "123456789012",
      verified: true
    },
    status: "available",
    currentLocation: {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Mumbai
    },
    rating: {
      average: 4.8,
      count: 156
    },
    completedOrders: 245,
    totalEarnings: 125000,
    successRate: 98,
    isVerified: true,
    workingHours: {
      start: "09:00",
      end: "18:00"
    }
  },
  {
    firstName: "Priya",
    lastName: "Singh",
    email: "priya.singh@example.com",
    phone: "9876543211",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    vehicleType: "van",
    vehicleNumber: "MH02CD5678",
    vehicleCapacity: 500,
    drivingLicense: {
      number: "DL987654321",
      expiryDate: "2024-12-31",
      verified: true
    },
    identityProof: {
      type: "aadhar",
      number: "987654321098",
      verified: true
    },
    status: "busy",
    currentLocation: {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Mumbai
    },
    rating: {
      average: 4.9,
      count: 98
    },
    completedOrders: 145,
    totalEarnings: 85000,
    successRate: 99,
    isVerified: true,
    workingHours: {
      start: "10:00",
      end: "19:00"
    }
  },
  {
    firstName: "Amit",
    lastName: "Patel",
    email: "amit.patel@example.com",
    phone: "9876543212",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
    vehicleType: "bike",
    vehicleNumber: "MH03EF9012",
    vehicleCapacity: 50,
    drivingLicense: {
      number: "DL456789123",
      expiryDate: "2024-06-30",
      verified: true
    },
    identityProof: {
      type: "aadhar",
      number: "456789123012",
      verified: true
    },
    status: "offline",
    currentLocation: {
      type: "Point",
      coordinates: [72.8777, 19.0760] // Mumbai
    },
    rating: {
      average: 4.7,
      count: 78
    },
    completedOrders: 120,
    totalEarnings: 45000,
    successRate: 97,
    isVerified: true,
    workingHours: {
      start: "08:00",
      end: "17:00"
    }
  }
];

export default sampleDrivers;
