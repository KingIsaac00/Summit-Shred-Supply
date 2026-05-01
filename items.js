const ITEMS = [
  {
    id: 1,
    itemName: 'Summit Carver 155',
    category: 'Snowboards',
    price: 59900,
    description: 'All-mountain directional twin with a poplar core and sintered base. Excellent edge hold on hardpack with enough flex for park laps.',
    imageUrls: ['../images/Snowboard1demo.jpg'],
  },
  {
    id: 2,
    itemName: 'Alpine Freestyle 148',
    category: 'Snowboards',
    price: 47900,
    description: 'True twin shape built for freestyle riding. Soft flex, lightweight fiberglass layup, and a super-butter base that loves the park.',
    imageUrls: ['../images/Snowboard2demo.jpg'],
  },
  {
    id: 3,
    itemName: 'Peak Lock Bindings',
    category: 'Bindings',
    price: 22900,
    description: 'High-back bindings with tool-free adjustment and a cushioned EVA footbed. Compatible with all major boot standards.',
    imageUrls: ['../images/bindings3demo.png'],
  },
  {
    id: 4,
    itemName: 'Ridge Step Boots',
    category: 'Boots',
    price: 18900,
    description: 'Medium-stiff freestyle boot with a heat-moldable liner, BOA closure system, and a grippy Vibram outsole.',
    imageUrls: ['../images/boots4demo.png'],
  },
  {
    id: 5,
    itemName: 'Apex MIPS Helmet',
    category: 'Helmets',
    price: 14900,
    description: 'In-mold construction with MIPS rotational protection, 12 adjustable vents, and a compatible goggle clip.',
    imageUrls: ['../images/helmet5demo.jpg'],
  },
  {
    id: 6,
    itemName: 'ClearVision OTG Goggles',
    category: 'Goggles',
    price: 11900,
    description: 'Cylindrical dual-lens goggles with anti-fog coating, 100% UV protection, and an over-the-glasses design.',
    imageUrls: ['../images/goggles6demo.jpg'],
  },
  {
    id: 7,
    itemName: 'Powder Pro Jacket',
    category: 'Jackets',
    price: 28900,
    description: '20K waterproof rating, taped seams, underarm vents, and a helmet-compatible powder skirt. Built for big days.',
    imageUrls: ['../images/jacket7demo.jpg'],
  },
  {
    id: 8,
    itemName: 'Summit Grip Gloves',
    category: 'Gloves',
    price: 6900,
    description: 'Waterproof shell with synthetic insulation, pre-curved fingers, and a silicone grip palm for confident pole handling.',
    imageUrls: ['../images/gloves8demo.jpg'],
  },
  {
    id: 9,
    itemName: 'Speed Wax Kit',
    category: 'Wax & Tuning',
    price: 3900,
    description: 'All-temp hydrocarbon wax, edge file, and a plastic scraper. Everything you need to keep your base flying.',
    imageUrls: ['../images/waxKit9demo.jpg'],
  },
  {
    id: 10,
    itemName: 'Boot Bag Pro',
    category: 'Bags',
    price: 4900,
    description: 'Ventilated boot bag with a separate wet/dry compartment, shoulder strap, and a durable 600D nylon exterior.',
    imageUrls: ['../images/bag10demo.jpg'],
  },
  {
    id: 11,
    itemName: 'Pocket Tune Tool',
    category: 'Wax & Tuning',
    price: 1900,
    description: 'Multi-function screwdriver, edge tuning guide, and binding adjustment tool all in one compact carry-on size unit.',
    imageUrls: ['../images/pockettool11demo.jpg'],
  },
  {
    id: 12,
    itemName: 'Thermo Bib Pants',
    category: 'Pants',
    price: 24900,
    description: 'Bib-style shell pants with 15K waterproofing, articulated knees, boot gaiters, and reinforced cuffs.',
    imageUrls: ['../images/pants12demo.jpg'],
  },
  {
    id: 13,
    itemName: 'Merino Base Layer Set',
    category: 'Base Layers',
    price: 9900,
    description: '100% merino wool top and bottom. Moisture-wicking, odor-resistant, and naturally temperature-regulating.',
    imageUrls: ['../images/baselayer13demo.jpg'],
  },
  {
    id: 14,
    itemName: 'Cushion Sock 3-Pack',
    category: 'Socks',
    price: 2900,
    description: 'Over-the-calf ski socks with targeted cushioning zones, arch support, and a merino/nylon blend.',
    imageUrls: ['../images/socks14demo.jpg'],
  },
];

function getItemsByCategory(category) {
  if (!category || category === 'All') return ITEMS;
  return ITEMS.filter(item => item.category === category);
}

function searchItems(query) {
  const q = query.toLowerCase().trim();
  if (!q) return ITEMS;
  return ITEMS.filter(
    item =>
      item.itemName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}
