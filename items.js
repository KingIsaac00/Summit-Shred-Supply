// Real snowboard/shred gear product database
const REAL_ITEMS = [
  {
    itemId: 'item_001',
    sellerId: null, // Will be populated from actual users
    itemName: 'Burton Custom Flying V',
    description: 'Premium all-mountain freestyle snowboard. Lightweight bamboo core with responsive edge. Perfect for intermediate to advanced riders.',
    price: 59999, // $599.99
    category: 'Snowboards',
    imageUrls: ['/images/Snowboard1demo.jpg'],
    createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_002',
    sellerId: null,
    itemName: 'Rome Powder Knife Pro',
    description: 'Deep powder specialist with directional twin shape. Forgiving and fun in deep snow. Best choice for backcountry enthusiasts.',
    price: 64999, // $649.99
    category: 'Snowboards',
    imageUrls: ['/images/Snowboard2demo.jpg'],
    createdAt: new Date(Date.now() - 25*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_003',
    sellerId: null,
    itemName: 'Capita DOA - Defenders of Awesome',
    description: 'Freestyle-focused all-mountain board with playful characteristics. Durable and forgiving for trick progression.',
    price: 54999, // $549.99
    category: 'Snowboards',
    imageUrls: ['/images/Snowboard1demo.jpg'],
    createdAt: new Date(Date.now() - 20*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_004',
    sellerId: null,
    itemName: 'Union Force Bindings',
    description: 'Industry-leading response and comfort. Responsive strap design with padded ankle strap for all-day comfort.',
    price: 22999, // $229.99
    category: 'Bindings',
    imageUrls: ['/images/bindings3demo.png'],
    createdAt: new Date(Date.now() - 15*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_005',
    sellerId: null,
    itemName: 'NOW Hyper Bindings',
    description: 'Ultra-responsive and lightweight. Perfect for park and freeride. Easy entry/exit heel mechanism.',
    price: 24999, // $249.99
    category: 'Bindings',
    imageUrls: ['/images/bindings3demo.png'],
    createdAt: new Date(Date.now() - 12*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_006',
    sellerId: null,
    itemName: 'Salomon Lord SJ',
    description: 'Aggressive freeride boots with Quickfit lacing. Performance-oriented with excellent ankle support.',
    price: 34999, // $349.99
    category: 'Boots',
    imageUrls: ['/images/boots4demo.png'],
    createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_007',
    sellerId: null,
    itemName: 'Burton Photon BOA',
    description: 'Dial-in fit with BOA technology. Lightweight and responsive. Excellent heat moldable liner.',
    price: 36999, // $369.99
    category: 'Boots',
    imageUrls: ['/images/boots4demo.png'],
    createdAt: new Date(Date.now() - 8*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_008',
    sellerId: null,
    itemName: 'Smith Maze Helmet',
    description: 'Lightweight MIPS helmet with excellent ventilation. Industry-leading impact protection.',
    price: 17999, // $179.99
    category: 'Helmets',
    imageUrls: ['/images/helmet5demo.jpg'],
    createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_009',
    sellerId: null,
    itemName: 'Anon M3 Goggles',
    description: 'Cylindrical lens design with wide field of view. All-weather lens technology for optimal visibility.',
    price: 19999, // $199.99
    category: 'Goggles',
    imageUrls: ['/images/goggles6demo.jpg'],
    createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_010',
    sellerId: null,
    itemName: 'Dragon X1s Goggle',
    description: 'Premium lens technology with lumalens option. Perfect for varying light conditions.',
    price: 22999, // $229.99
    category: 'Goggles',
    imageUrls: ['/images/goggles6demo.jpg'],
    createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_011',
    sellerId: null,
    itemName: 'Burton AK Gore-Tex Jacket',
    description: 'Premium waterproof technical shell. GORE-TEX 3L fabric with sealed seams. Best-in-class durability.',
    price: 49999, // $499.99
    category: 'Jackets',
    imageUrls: ['/images/jacket7demo.jpg'],
    createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_012',
    sellerId: null,
    itemName: 'The North Face Freedom Jacket',
    description: 'Insulated snow jacket with FlexVent technology. Excellent warmth-to-weight ratio.',
    price: 39999, // $399.99
    category: 'Jackets',
    imageUrls: ['/images/jacket7demo.jpg'],
    createdAt: new Date(Date.now() - 6*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_013',
    sellerId: null,
    itemName: 'Burton AK Gore-Tex Pants',
    description: 'Premium waterproof snow pants. GORE-TEX protection with pit zips for ventilation.',
    price: 44999, // $449.99
    category: 'Pants',
    imageUrls: ['/images/pants12demo.jpg'],
    createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_014',
    sellerId: null,
    itemName: 'Picture Organic Pants',
    description: 'Sustainable snow pants with organic materials. Excellent fit and durability.',
    price: 34999, // $349.99
    category: 'Pants',
    imageUrls: ['/images/pants12demo.jpg'],
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_015',
    sellerId: null,
    itemName: 'Hestra Army Leather Gloves',
    description: 'Premium leather insulated gloves. Superior warmth and dexterity for technical riding.',
    price: 10999, // $109.99
    category: 'Gloves',
    imageUrls: ['/images/gloves8demo.jpg'],
    createdAt: new Date(Date.now() - 9*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_016',
    sellerId: null,
    itemName: 'Dakine Scout Gloves',
    description: 'Durable and warm leather/synthetic blend. Great for all-day comfort and performance.',
    price: 7999, // $79.99
    category: 'Gloves',
    imageUrls: ['/images/gloves8demo.jpg'],
    createdAt: new Date(Date.now() - 11*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_017',
    sellerId: null,
    itemName: 'Smartwool Merino Ski Socks',
    description: 'Merino wool blend for warmth and moisture control. Durable and comfortable all day.',
    price: 2999, // $29.99
    category: 'Socks',
    imageUrls: ['/images/socks14demo.jpg'],
    createdAt: new Date(Date.now() - 14*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_018',
    sellerId: null,
    itemName: 'Darn Tough Merino Socks',
    description: 'Premium merino construction with lifetime guarantee. Best-in-class durability.',
    price: 1999, // $19.99
    category: 'Socks',
    imageUrls: ['/images/socks14demo.jpg'],
    createdAt: new Date(Date.now() - 13*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_019',
    sellerId: null,
    itemName: 'Liquid Genius Wax Kit',
    description: 'Complete wax maintenance kit for all temperature ranges. Includes scraper and brush.',
    price: 5999, // $59.99
    category: 'Wax & Tuning',
    imageUrls: ['/images/waxKit9demo.jpg'],
    createdAt: new Date(Date.now() - 16*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_020',
    sellerId: null,
    itemName: 'Burton Board Bag',
    description: 'Padded travel bag for safe snowboard transport. Fits most boards up to 166cm.',
    price: 14999, // $149.99
    category: 'Bags',
    imageUrls: ['/images/bag10demo.jpg'],
    createdAt: new Date(Date.now() - 18*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_021',
    sellerId: null,
    itemName: 'Dakine Wheelie Board Bag',
    description: 'Roller bag for easy airport transport. Durable and TSA-friendly.',
    price: 24999, // $249.99
    category: 'Bags',
    imageUrls: ['/images/bag10demo.jpg'],
    createdAt: new Date(Date.now() - 17*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_022',
    sellerId: null,
    itemName: 'Leatt DBX Base Layer Set',
    description: 'Moisture-wicking thermal base layer. Perfect for cold weather performance.',
    price: 12999, // $129.99
    category: 'Base Layers',
    imageUrls: ['/images/baselayer13demo.jpg'],
    createdAt: new Date(Date.now() - 19*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_023',
    sellerId: null,
    itemName: 'Rab Alpha Flash',
    description: 'Lightweight insulated base layer with fleece backing. Premium thermal comfort.',
    price: 14999, // $149.99
    category: 'Base Layers',
    imageUrls: ['/images/baselayer13demo.jpg'],
    createdAt: new Date(Date.now() - 21*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_024',
    sellerId: null,
    itemName: 'Burton Multitool',
    description: 'All-in-one maintenance tool for bindings and board care. Compact and essential.',
    price: 1999, // $19.99
    category: 'Accessories',
    imageUrls: ['/images/pockettool11demo.jpg'],
    createdAt: new Date(Date.now() - 22*24*60*60*1000).toISOString()
  },
  {
    itemId: 'item_025',
    sellerId: null,
    itemName: 'GoPro Hero 11',
    description: 'Capture your shred sessions in stunning 4K. Waterproof and rugged.',
    price: 49999, // $499.99
    category: 'Accessories',
    imageUrls: ['/images/pockettool11demo.jpg'],
    createdAt: new Date(Date.now() - 23*24*60*60*1000).toISOString()
  }
];

// Get all items
function getAllItems() {
  return REAL_ITEMS;
}

// Get items by category
function getItemsByCategory(category) {
  if (category === 'All') {
    return REAL_ITEMS;
  }
  return REAL_ITEMS.filter(item => item.category === category);
}

// Get item by ID
function getItemById(itemId) {
  return REAL_ITEMS.find(item => item.itemId === itemId);
}

// Get unique categories
function getCategories() {
  const categories = new Set(REAL_ITEMS.map(item => item.category));
  return Array.from(categories).sort();
}
