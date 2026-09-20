import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultSeo = [
  { route: '/', title: 'Ports Shipping LLC - Your Global Logistics Partner', description: 'Premier shipping and logistics services based in Dubai, UAE. We offer ocean freight, air freight, and land transport solutions globally.', keywords: 'ports shipping, logistics dubai, ocean freight uae, air freight dubai' },
  { route: '/about', title: 'About Ports Shipping | Company Overview', description: 'Learn about Ports Shipping LLC, our history, mission, and how we became a leading logistics provider in the Middle East.', keywords: 'about ports shipping, logistics company dubai, freight forwarding history' },
  { route: '/services', title: 'Our Services | Ports Shipping', description: 'Explore our comprehensive range of logistics services including ocean freight, air freight, warehousing, and project logistics.', keywords: 'shipping services dubai, ocean freight, air freight, logistics services' },
  { route: '/contact', title: 'Contact Us | Ports Shipping', description: 'Get in touch with Ports Shipping LLC for your logistics and supply chain needs. Request a quote or reach our Dubai office.', keywords: 'contact ports shipping, logistics quote dubai, shipping company contact' },
  { route: '/track', title: 'Track Your Shipment | Ports Shipping', description: 'Track your cargo and shipments in real-time with Ports Shipping. Enter your BL number for instant updates.', keywords: 'track shipment, cargo tracking, ports shipping tracking, bl tracking' },
  { route: '/services/ocean-freight', title: 'Ocean Freight Services | Ports Shipping', description: 'Reliable and cost-effective ocean freight solutions including FCL, LCL, and Break Bulk shipping services.', keywords: 'ocean freight dubai, sea cargo uae, fcl shipping, lcl freight' },
  { route: '/services/air-freight', title: 'Air Freight Services | Ports Shipping', description: 'Fast and secure air freight solutions for your time-sensitive cargo. Global coverage with major airlines.', keywords: 'air freight dubai, air cargo uae, fast shipping' },
  { route: '/services/land-transport', title: 'Land Transport Services | Ports Shipping', description: 'Extensive GCC land transport network offering FTL, LTL, and specialized hauling across borders.', keywords: 'land transport gcc, trucking uae, road freight dubai' },
  { route: '/services/customs-clearance', title: 'Customs Clearance | Ports Shipping', description: 'Expert customs clearance and port handling services in the UAE to ensure smooth transit of your cargo.', keywords: 'customs clearance dubai, uae customs broker, import export clearance' },
  { route: '/services/warehousing', title: 'Warehousing & Storage | Ports Shipping', description: 'State-of-the-art contract warehousing and temperature-controlled storage facilities in Dubai.', keywords: 'warehousing dubai, cold storage uae, logistics warehouse' },
  { route: '/services/project-logistics', title: 'Project Logistics | Ports Shipping', description: 'Specialized logistics solutions for large-scale projects, OOG cargo, and the oil & energy sector.', keywords: 'project logistics dubai, oog cargo, heavy lift transport' },
  { route: '/services/pharma-healthcare', title: 'Pharma & Healthcare Logistics | Ports Shipping', description: 'GDP and HACCP compliant logistics solutions for pharmaceutical and healthcare products.', keywords: 'pharma logistics uae, cold chain shipping, healthcare transport' },
  { route: '/services/defense-diplomatic', title: 'Defense & Diplomatic Logistics | Ports Shipping', description: 'Secure and discreet logistics services for defense contractors, diplomatic missions, and humanitarian aid.', keywords: 'defense logistics, diplomatic cargo, secure transport' },
  { route: '/services/yacht-marine', title: 'Yacht & Marine Logistics | Ports Shipping', description: 'Specialized handling and transport services for yachts, boats, and marine equipment globally.', keywords: 'yacht transport dubai, boat shipping, marine logistics' },
  { route: '/services/aircraft-helicopter', title: 'Aircraft & Helicopter Shifting | Ports Shipping', description: 'Expert transport and relocation services for helicopters and aircraft components.', keywords: 'helicopter transport, aircraft shipping, aviation logistics' },
];

const allMilestones = [
  "Booking Confirmed",
  "Cargo Received at Origin",
  "Customs Cleared (Origin)",
  "Vessel / Flight Departed",
  "In Transit",
  "Arrived at Port of Discharge",
  "Customs Clearance in Progress (UAE)",
  "Out for Delivery",
  "Delivered"
];

const getMilestones = (count: number) => {
  return allMilestones.map((stage, i) => ({
    stage,
    timestamp: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
    note: i < count ? `Completed stage: ${stage}` : undefined,
    completed: i < count
  }));
};

async function main() {
  console.log('Seeding database...');
  
  // Seed SEO Meta
  for (const seo of defaultSeo) {
    await prisma.seoMeta.upsert({
      where: { route: seo.route },
      update: {},
      create: seo,
    });
  }
  
  // Seed Shipments
  const shipments = [
    { blNumber: 'PSDUBAI1001', milestoneCount: 9, status: 'Delivered' },
    { blNumber: 'PSDUBAI1002', milestoneCount: 5, status: 'In Transit' },
    { blNumber: 'PSDUBAI1003', milestoneCount: 7, status: 'Customs Clearance in Progress (UAE)' },
    { blNumber: 'PSDUBAI1004', milestoneCount: 2, status: 'Cargo Received at Origin' },
    { blNumber: 'PSDUBAI1005', milestoneCount: 6, status: 'Arrived at Port of Discharge' },
  ];

  for (const s of shipments) {
    await prisma.shipment.upsert({
      where: { blNumber: s.blNumber },
      update: {},
      create: {
        blNumber: s.blNumber,
        shipper: 'Global Exports Ltd',
        consignee: 'Dubai Importers LLC',
        originPort: 'Shanghai, China',
        destinationPort: 'Jebel Ali, UAE',
        currentStatus: s.status,
        milestones: JSON.stringify(getMilestones(s.milestoneCount)),
        weight: '5000 kg',
        volume: '10 CBM',
        packages: 20
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
