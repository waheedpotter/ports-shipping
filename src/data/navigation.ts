export interface NavItem {
  label: string;
  href: string;
  hasMega?: boolean;
}

export interface MegaMenuItem {
  slug: string;
  label: string;
  description: string;
  icon: string;
}

export interface MegaMenuSection {
  title: string;
  color: string;
  items: MegaMenuItem[];
}

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services', hasMega: true },
  { label: 'Contact Us', href: '/contact' },
];

export const MEGA_MENU_DATA: MegaMenuSection[] = [
  {
    title: 'Ocean & Air Freight',
    color: 'crimson',
    items: [
      { slug: 'ocean-freight', label: 'Ocean & Sea Freight', description: 'FCL, LCL, Break Bulk & Ro-Ro worldwide', icon: 'Ship' },
      { slug: 'air-freight', label: 'Air Freight & Chartering', description: 'IATA certified, EK SkyCargo & DG handling', icon: 'Plane' },
      { slug: 'aircraft-helicopter', label: 'Aircraft & Helicopter Shifting', description: 'Road, sea & air transport for aviation assets', icon: 'Wind' },
      { slug: 'nvocc', label: 'Main Liner & NVOCC', description: 'LCL to 145 destinations with weekly sailings', icon: 'Waves' },
      { slug: 'consolidation', label: 'Global Consolidation', description: 'FCL / LCL / FTL / LTL — pay for what you ship', icon: 'Package' },
    ],
  },
  {
    title: 'Land Transport & Customs',
    color: 'blue',
    items: [
      { slug: 'land-transport', label: 'GCC Land Transport', description: 'FTL & LTL across 7 GCC/Levant countries', icon: 'Truck' },
      { slug: 'customs-clearance', label: 'Customs Clearance', description: 'Port Rashid, Jebel Ali & Dubai Airport', icon: 'FileCheck' },
      { slug: 'multimodal', label: 'Multi-Modal Operations', description: 'Integrated sea, air, road & rail chains', icon: 'GitMerge' },
    ],
  },
  {
    title: 'Warehousing & Storage',
    color: 'green',
    items: [
      { slug: 'warehousing', label: 'Contract Warehousing', description: '15,000+ sqft ambient, chilled & frozen storage', icon: 'Warehouse' },
      { slug: 'cfs-warehousing', label: 'Container Freight Station', description: 'CFS at Jebel Ali, Oman & Kuwait', icon: 'Container' },
      { slug: 'project-logistics', label: 'Project & OOG Logistics', description: 'Heavy equipment & energy sector solutions', icon: 'HardHat' },
    ],
  },
  {
    title: 'Specialized Services',
    color: 'gold',
    items: [
      { slug: 'pharma-healthcare', label: 'Pharma & Healthcare', description: 'GDP, HACCP & cold chain (-20°C to +25°C)', icon: 'HeartPulse' },
      { slug: 'defense-diplomatic', label: 'Defense & Diplomatic', description: 'Crisis cargo, embassy & UN aid logistics', icon: 'Shield' },
      { slug: 'humanitarian-aid', label: 'Humanitarian Aid', description: 'UN relief & NGO cargo clearances', icon: 'Heart' },
      { slug: 'yacht-marine', label: 'Yacht & Marine Logistics', description: 'Global boat transport with cradle & shrink-wrap', icon: 'Anchor' },
      { slug: 'hotel-retail', label: 'Hotel & Retail Logistics', description: 'FF&E installation & mock-up room staging', icon: 'Building2' },
      { slug: 'household-moving', label: 'Household Moving', description: 'Personal effects relocation — 145 countries', icon: 'Home' },
      { slug: 'foodstuff', label: 'Foodstuff & Cold Chain', description: 'Perishable & frozen goods — HACCP compliant', icon: 'UtensilsCrossed' },
    ],
  },
];
