// Create axios instance
const api = {
  // Base methods can be added here if needed
}

// Simulate API responses
const simulateAPI = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data })
    }, delay)
  })
}

// Update the amenities list in mockProperties
const amenitiesIcons = {
  central_ac: 'FaSnowflake',
  parking: 'FaParking',
  swimming_pool: 'FaSwimmer',
  gym: 'FaDumbbell',
  security: 'FaShieldAlt',
  elevator: 'FaElevator',
  balcony: 'FaArchway',
  garden: 'FaTree',
  maid_room: 'FaUserCog',
  storage: 'FaBoxOpen',
  furnished: 'FaCouch',
  kitchen_appliances: 'FaBlender',
  internet: 'FaWifi',
  satellite: 'FaSatelliteDish',
  intercom: 'FaPhoneSquare',
  maintenance: 'FaTools',
  mosque: 'FaMosque',
  shopping: 'FaShoppingCart',
  schools: 'FaGraduationCap',
  pets_allowed: 'FaPaw'
}

// Update mockProperties amenities with more realistic combinations
const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Al Olaya',
    description: 'Luxurious apartment with modern finishes, featuring an open-plan living area and premium appliances. Located in the heart of Riyadh\'s business district.',
    price: '8,500',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    location: 'riyadh',
    amenities: [
      'central_ac',
      'parking',
      'elevator',
      'security',
      'furnished',
      'kitchen_appliances',
      'internet',
      'satellite',
      'maintenance'
    ],
    images: [
      'https://placehold.co/600x400/png/white?text=Living+Room',
      'https://placehold.co/600x400/png/white?text=Kitchen',
      'https://placehold.co/600x400/png/white?text=Bedroom',
      'https://placehold.co/600x400/png/white?text=Bathroom',
    ],
    yearBuilt: 2020,
    furnished: true,
    views: ['city view', 'landmark view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 2,
    title: 'Luxury Villa in Al Nakheel',
    description: 'Spacious family villa with private garden and swimming pool. Features high-end finishes, smart home system, and maid\'s quarters.',
    price: '25,000',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    area: 450,
    location: 'riyadh',
    amenities: ['parking', 'pool', 'garden', 'security', 'maid_room', 'driver_room'],
    images: [
      'https://placehold.co/600x400/png/white?text=Villa+Exterior',
      'https://placehold.co/600x400/png/white?text=Garden',
      'https://placehold.co/600x400/png/white?text=Master+Bedroom',
      'https://placehold.co/600x400/png/white?text=Living+Area',
    ],
    yearBuilt: 2019,
    furnished: false,
    views: ['garden view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 3,
    title: 'Premium Office Space in Jeddah Gate',
    description: 'Modern office space with floor-to-ceiling windows, offering stunning views of the Red Sea. Includes dedicated parking and 24/7 security.',
    price: '15,000',
    type: 'office',
    bathrooms: 2,
    area: 200,
    location: 'jeddah',
    amenities: ['parking', 'security', 'reception', 'meeting_rooms'],
    images: [
      'https://placehold.co/600x400/png/white?text=Office+Space',
      'https://placehold.co/600x400/png/white?text=Meeting+Room',
      'https://placehold.co/600x400/png/white?text=Reception',
      'https://placehold.co/600x400/png/white?text=Pantry',
    ],
    yearBuilt: 2021,
    furnished: true,
    views: ['sea view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 4,
    title: 'Cozy Studio in Al Khobar Corniche',
    description: 'Fully furnished studio apartment with stunning sea views. Perfect for singles or couples.',
    price: '4,500',
    type: 'apartment',
    bedrooms: 0,
    bathrooms: 1,
    area: 55,
    location: 'khobar',
    amenities: ['parking', 'gym', 'security', 'balcony'],
    images: [
      'https://placehold.co/600x400/png/white?text=Studio+View',
      'https://placehold.co/600x400/png/white?text=Kitchen+Area',
      'https://placehold.co/600x400/png/white?text=Bathroom',
      'https://placehold.co/600x400/png/white?text=Balcony',
    ],
    yearBuilt: 2018,
    furnished: true,
    views: ['sea view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 5,
    title: 'Retail Space in Al Rashid Mall',
    description: 'Prime retail location with high foot traffic. Suitable for retail or food & beverage businesses.',
    price: '12,000',
    type: 'shop',
    bathrooms: 1,
    area: 85,
    location: 'dammam',
    amenities: ['parking', 'security', 'storage'],
    images: [
      'https://placehold.co/600x400/png/white?text=Shop+Front',
      'https://placehold.co/600x400/png/white?text=Interior',
      'https://placehold.co/600x400/png/white?text=Storage',
      'https://placehold.co/600x400/png/white?text=Mall+Entrance',
    ],
    yearBuilt: 2017,
    furnished: false,
    views: ['mall view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 6,
    title: 'Residential Land in Al Narjis',
    description: 'Prime residential land plot in a developing area. Perfect for building your dream home.',
    price: '850,000',
    type: 'land',
    area: 750,
    location: 'riyadh',
    amenities: ['electricity', 'water', 'sewage'],
    images: [
      'https://placehold.co/600x400/png/white?text=Land+Plot',
      'https://placehold.co/600x400/png/white?text=Street+View',
      'https://placehold.co/600x400/png/white?text=Area+Map',
      'https://placehold.co/600x400/png/white?text=Surroundings',
    ],
    yearBuilt: null,
    furnished: false,
    views: ['street view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 7,
    title: 'Penthouse in Al Hamra Tower',
    description: 'Luxurious penthouse with panoramic city views, featuring high-end finishes and private roof terrace.',
    price: '35,000',
    type: 'apartment',
    bedrooms: 4,
    bathrooms: 5,
    area: 380,
    location: 'jeddah',
    amenities: ['parking', 'pool', 'gym', 'security', 'private_roof', 'maid_room'],
    images: [
      'https://placehold.co/600x400/png/white?text=Living+Space',
      'https://placehold.co/600x400/png/white?text=Master+Suite',
      'https://placehold.co/600x400/png/white?text=Terrace',
      'https://placehold.co/600x400/png/white?text=View',
    ],
    yearBuilt: 2022,
    furnished: true,
    views: ['city view', 'sea view'],
    status: 'active',
    bookingStatus: 'available'
  },
  {
    id: 8,
    title: 'Family Compound in Al Rawdah',
    description: 'Private compound with multiple villas, shared pool, and landscaped gardens. Perfect for large families.',
    price: '45,000',
    type: 'villa',
    bedrooms: 12,
    bathrooms: 14,
    area: 1200,
    location: 'dammam',
    amenities: ['parking', 'pool', 'garden', 'security', 'maid_rooms', 'driver_rooms', 'playground'],
    images: [
      'https://placehold.co/600x400/png/white?text=Compound+Entry',
      'https://placehold.co/600x400/png/white?text=Main+Villa',
      'https://placehold.co/600x400/png/white?text=Pool+Area',
      'https://placehold.co/600x400/png/white?text=Garden',
    ],
    yearBuilt: 2016,
    furnished: false,
    views: ['garden view'],
    status: 'active',
    bookingStatus: 'available'
  }
]

const mockTourRequests = [
  {
    id: 1,
    propertyId: 1,
    propertyTitle: 'Luxury Villa with Pool',
    renterName: 'Ahmed Mohammed',
    renterPhone: '+966 50 XXX XXXX',
    renterEmail: 'ahmed@example.com',
    date: '2024-03-20',
    time: '14:00',
    status: 'pending',
    location: 'Riyadh, Al Olaya District'
  },
  // Add more mock tour requests...
];

export const authAPI = {
  register: async (userData) => {
    // Simulate registration
    return simulateAPI({
      registration_id: Math.random().toString(36).substr(2, 9),
      user: userData
    })
  },

  verifyOTP: async (data) => {
    // Simulate OTP verification
    return simulateAPI({
      success: true,
      token: 'fake_jwt_token_' + Math.random(),
      user: {
        id: Math.random().toString(36).substr(2, 9),
        ...data
      }
    })
  },
}

export const propertyAPI = {
  getAvailable: async () => {
    return simulateAPI({ properties: mockProperties })
  },

  getPropertyDetails: async (id) => {
    const property = mockProperties.find(p => p.id === parseInt(id))
    if (!property) {
      throw new Error('Property not found')
    }
    return simulateAPI(property)
  },

  getOwnerProperties: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: mockProperties };
  },

  createProperty: async (propertyData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProperty = {
      id: mockProperties.length + 1,
      ...propertyData,
      status: 'pending',
      bookingStatus: 'available'
    };
    mockProperties.push(newProperty);
    return { data: newProperty };
  },

  updateProperty: async (id, propertyData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockProperties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      mockProperties[index] = { ...mockProperties[index], ...propertyData };
      return { data: mockProperties[index] };
    }
    throw new Error('Property not found');
  },

  deleteProperty: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = mockProperties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      mockProperties.splice(index, 1);
      return { success: true };
    }
    throw new Error('Property not found');
  },

  getTourRequests: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: mockTourRequests };
  },

  updateTourRequest: async (requestId, status) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const request = mockTourRequests.find(r => r.id === requestId);
    if (request) {
      request.status = status;
      return { data: request };
    }
    throw new Error('Tour request not found');
  },

  updatePropertyStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const property = mockProperties.find(p => p.id === id);
    if (property) {
      property.bookingStatus = status;
      return { data: property };
    }
    throw new Error('Property not found');
  },
}

// Export the base api object
export default api