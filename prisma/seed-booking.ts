import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding booking data...');

  // Initialize BookingCounter
  await prisma.bookingCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, current: 0 },
  });

  // Seed Ports
  const ports = [
    { portCode: 'AEJEA', portName: 'Jebel Ali, UAE' },
    { portCode: 'AESHJ', portName: 'Sharjah, UAE' },
    { portCode: 'QAHMD', portName: 'Hamad Port, Qatar' },
    { portCode: 'BHBAH', portName: 'Khalifa Bin Salman, Bahrain' },
    { portCode: 'SADMM', portName: 'King Abdullah Port, Saudi Arabia' },
    { portCode: 'KWSWK', portName: 'Shuwaikh, Kuwait' },
    { portCode: 'AEAUH', portName: 'Abu Dhabi, UAE' },
    { portCode: 'IQUQR', portName: 'Umm Qasr, Iraq' },
  ];

  for (const port of ports) {
    await prisma.port.upsert({
      where: { portCode: port.portCode },
      update: { portName: port.portName },
      create: port,
    });
  }

  // Seed Voyage References
  const voyageRefs = ['PS030', 'PS0928', 'PS78093'];
  for (const ref of voyageRefs) {
    await prisma.voyageReference.upsert({
      where: { voyageRef: ref },
      update: {},
      create: { voyageRef: ref, active: true },
    });
  }

  // Re-seed original shipment data
  const allMilestones = [
    'Booking Confirmed',
    'Cargo Received at Origin',
    'Customs Cleared (Origin)',
    'Vessel / Flight Departed',
    'In Transit',
    'Arrived at Port of Discharge',
    'Customs Clearance in Progress (UAE)',
    'Out for Delivery',
    'Delivered',
  ];

  const getMilestones = (count: number) =>
    allMilestones.map((stage, i) => ({
      stage,
      timestamp: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
      note: i < count ? `Completed stage: ${stage}` : undefined,
      completed: i < count,
    }));

  const shipments = [
    { blNumber: 'PSDUBAI1001', containerNumber: 'TCNU3456789', shipper: 'Al Futtaim Trading LLC', consignee: 'London Imports Ltd', originPort: 'Jebel Ali, Dubai (AEJEA)', destinationPort: 'Felixstowe (GBFXT)', vesselName: 'MSC GÜLSÜN', voyageNumber: 'FE241W', currentStatus: 'Delivered', milestoneCount: 9, commodity: 'Electronics & Consumer Goods', weight: '22,500 kg', volume: '45 CBM', packages: 850 },
    { blNumber: 'PSDUBAI1002', containerNumber: 'MSKU8765432', shipper: 'Emirates Global Exports', consignee: 'Hamburg Logistics GmbH', originPort: 'Jebel Ali, Dubai (AEJEA)', destinationPort: 'Hamburg (DEHAM)', vesselName: 'EVER GIVEN', voyageNumber: 'AE241E', currentStatus: 'In Transit', milestoneCount: 5, commodity: 'Petrochemicals', weight: '18,200 kg', volume: '32 CBM', packages: 120 },
    { blNumber: 'PSDUBAI1003', containerNumber: 'CMAU4567890', shipper: 'Gulf Petrochemicals FZE', consignee: 'Rotterdam Distribution BV', originPort: 'Jebel Ali, Dubai (AEJEA)', destinationPort: 'Rotterdam (NLRTM)', vesselName: 'CMA CGM MARCO POLO', voyageNumber: 'ME241N', currentStatus: 'Customs Clearance in Progress (UAE)', milestoneCount: 7, commodity: 'Hazardous Chemicals (IMCO 3)', weight: '31,000 kg', volume: '28 CBM', packages: 240 },
    { blNumber: 'PSDUBAI1004', containerNumber: 'HLBU2345678', shipper: 'Abu Dhabi Polymers Co.', consignee: 'Singapore Plastics Pte Ltd', originPort: 'Khalifa Port, Abu Dhabi (AEAUH)', destinationPort: 'Singapore (SGSIN)', vesselName: 'HAPAG LLOYD TOKYO', voyageNumber: 'AS241S', currentStatus: 'Cargo Received at Origin', milestoneCount: 2, commodity: 'Polymer Granules', weight: '26,400 kg', volume: '40 CBM', packages: 560 },
    { blNumber: 'PSDUBAI1005', containerNumber: 'OOLU9876543', shipper: 'Sharjah Steel Industries', consignee: 'Mumbai Steel Corp Pvt Ltd', originPort: 'Khalifa Port, Abu Dhabi (AEAUH)', destinationPort: 'Nhava Sheva (INNSA)', vesselName: 'OOCL INDIA', voyageNumber: 'MI241E', currentStatus: 'Arrived at Port of Discharge', milestoneCount: 6, commodity: 'Steel Coils & Plates', weight: '42,000 kg', volume: '52 CBM', packages: 88 },
  ];

  for (const s of shipments) {
    const { milestoneCount, ...shipmentData } = s;
    await prisma.shipment.upsert({
      where: { blNumber: s.blNumber },
      update: { currentStatus: s.currentStatus, milestones: JSON.stringify(getMilestones(milestoneCount)) },
      create: { ...shipmentData, milestones: JSON.stringify(getMilestones(milestoneCount)) },
    });
  }

  console.log('Booking seed completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
