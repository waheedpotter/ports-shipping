export interface ServicePage {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: 'Ocean & Air' | 'Land & Customs' | 'Warehousing' | 'Specialized';
  heroTitle: string;
  content: string;
  features: string[];
  keywords: string[];
  image?: string;
}

export const ALL_SERVICES: ServicePage[] = [
  {
    slug: 'ocean-freight',
    title: 'Ocean & Sea Freight (NVOCC)',
    shortDescription: 'Global FCL, LCL, Break Bulk and Ro-Ro services with competitive rates and strong carrier partnerships from Dubai.',
    icon: 'Ship',
    image: '/images/service-ocean.jpg',
    category: 'Ocean & Air',
    heroTitle: 'Reliable Global Ocean Freight Solutions',
    content: `At Ports Shipping LLC, we specialize in providing cost-effective and reliable ocean freight services from Dubai to major ports worldwide. With years of experience and strong partnerships with leading carriers, we ensure your cargo reaches its destination safely, on time, and within budget.

Whether you're shipping full container loads (FCL), less than container loads (LCL), or special project cargo, our team delivers tailored solutions to meet your business needs.

As a Non-Vessel Operating Common Carrier (NVOCC), Ports Shipping is rated among the top customers of almost all leading shipping lines operating in the region. This reputation has ensured us competitive rates & space with major liners for consolidated shipments on a regular basis.

Our LCL services reach an impressive 145 destinations worldwide. We represent various NVOs globally and operate weekly scheduled arrivals & departures using reputed carriers.`,
    features: [
      'FCL (Full Container Load) — dedicated container for large shipments',
      'LCL (Less than Container Load) — cost-efficient shared container space',
      'Break Bulk & Project Cargo — oversized and non-containerizable cargo',
      'Ro-Ro Services — roll-on/roll-off for vehicles and machinery',
      'Cross-stuffing at Jebel Ali Free Zone',
      'Door-to-Door Delivery worldwide',
      'Comprehensive Customs Clearance & Documentation',
      'LCL services to 145+ destinations globally',
      'Weekly scheduled sailings with leading carriers',
      'Competitive NVOCC rates & guaranteed space',
    ],
    keywords: ['ocean freight Dubai', 'FCL shipping UAE', 'LCL shipping Dubai', 'NVOCC UAE', 'sea freight Dubai', 'container shipping'],
  },
  {
    slug: 'air-freight',
    title: 'Air Freight & Chartering',
    shortDescription: 'IATA-certified air cargo operations covering Dubai International Airport terminals T3 & FG5, EK SkyCargo, and full charter solutions.',
    icon: 'Plane',
    image: '/images/service-air.jpg',
    category: 'Ocean & Air',
    heroTitle: 'Air Freight Management',
    content: `Ports Shipping's Air Freight Division offers effective Air Cargo services. Our Air Freight team offers complete logistical solutions and is a trusted partner for Air Cargo Management. Our expertise in operations, customs regulations, licenses & consular documentation help achieve optimum results.

We operate as an IATA certified agent with access to Dubai International Airport's EK SkyCargo, T3, FG5 & DWC terminals, ensuring your cargo moves with the world's leading airline operators.

Our bonded warehouse facility in Dubai Cargo Village and Jebel Ali Free Zone provides secure storage for transit and consolidation cargo. As a GCAA and IATA approved DG Agent, we handle Dangerous Goods with full regulatory compliance.`,
    features: [
      'IATA capabilities with Dubai International Airports, EK SkyCargo, T3, FG5 & DWC',
      'Air Freight Export/Import Consolidation',
      'Multimodal Operations (Sea/Air, Sea/Land Management)',
      'Project, Perishable & DG Cargo handling',
      'Aircraft Chartering, clearing & forwarding',
      'Door-to-door service worldwide',
      'Customs clearance and delivery',
      'Supply Chain and Logistics Management',
      'Cargo General Sales Agent services',
      'Bonded warehouse in Dubai Cargo Village & Jebel Ali Free Zone',
      'GCAA and IATA approved DG Agent',
      'Online customs clearance and freight booking facility',
    ],
    keywords: ['air freight Dubai', 'air cargo UAE', 'IATA agent Dubai', 'DG cargo UAE', 'aircraft charter Dubai', 'EK SkyCargo partner'],
  },
  {
    slug: 'land-transport',
    title: 'GCC Land Transport & Overland Trucking',
    shortDescription: 'Cross-border FTL & LTL fleets servicing UAE, KSA, Kuwait, Bahrain, Oman, Jordan, Egypt and Yemen with GPS-monitored vehicles.',
    icon: 'Truck',
    category: 'Land & Customs',
    heroTitle: 'Land Transportation Management',
    content: `Ports Shipping has one of the best and most comprehensive networks across all GCC countries, including offices and agents across all the borders to facilitate smooth clearances of the trucks. We are specialized in carrying Project, OOG, Diplomatic, Humanitarian Aid, General and Break Bulk cargo.

We are specialized in FTL & LTL trucking at very competitive rates and services. We mainly operate with our own fleet of trucks which gives us an edge on service standards as well as competitive rates.

Our network spans UAE, Saudi Arabia (KSA), Kuwait, Bahrain, Oman, Jordan, Egypt, and Yemen — covering the full GCC and Levant region with knowledgeable expert drivers who take care of your goods during long-distance transit.`,
    features: [
      'Movement of all types of cargo to GCC & Levant Countries',
      'Movement of Perishable, Healthcare and Frozen cargo',
      'Various sizes and types of trucks/trailers to match client needs',
      'Border Clearances — shifting of cargo with own cranes at the border',
      'Escort facilities for High Value, Break Bulk, OOG Cargo',
      'UAE, KSA, Bahrain, Oman, Jordan, Egypt, Yemen registered fleets',
      'Heavy haulage and Out-of-Gauge (OOG) transport',
      'Hydraulic trailers and specialized equipment',
      'GPS-monitored fleet for real-time tracking',
      'Knowledgeable expert drivers for long-distance transit',
      'Local & across border transportation',
    ],
    keywords: ['land transport UAE', 'GCC trucking', 'FTL LTL Dubai', 'cross border transport UAE', 'OOG transport', 'heavy haulage Dubai'],
  },
  {
    slug: 'customs-clearance',
    title: 'Customs Clearance & Port Handling',
    shortDescription: 'Full-service customs clearance at Port Rashid, Jebel Ali Free Zone, and Dubai International Airport with expert documentation handling.',
    icon: 'FileCheck',
    category: 'Land & Customs',
    heroTitle: 'Customs Clearance & Port Handling',
    content: `Ports Shipping provides comprehensive customs clearance services across all major UAE entry points — Port Rashid, Jebel Ali Free Zone, and Dubai International Airport terminals.

Our experienced team handles all aspects of customs documentation, consular legalization, and transit clearances, ensuring your cargo moves through customs efficiently and in full regulatory compliance.

We maintain strong working relationships with UAE Customs, Dubai Municipality, and all relevant government authorities, giving your shipments priority processing and minimal delays.`,
    features: [
      'Customs clearance at Port Rashid, Jebel Ali Free Zone & Dubai Airport',
      'Comprehensive customs documentation preparation',
      'Consular legalization and attestation services',
      'Transit clearances for re-export cargo',
      'Import/export permit management',
      'Duty exemption and free zone documentation',
      'Food, pharmaceutical & specialized commodity clearance',
      'Online customs clearance submission',
      'FIRS, Dubai Municipality & laboratory coordination',
      'Swift resolution of customs holds and queries',
    ],
    keywords: ['customs clearance Dubai', 'Jebel Ali customs agent', 'import clearance UAE', 'export clearance Dubai', 'customs broker UAE'],
  },
  {
    slug: 'warehousing',
    title: 'Contract Warehousing & Temperature-Controlled Storage',
    shortDescription: 'Over 15,000 sq. ft of ambient, chilled and frozen storage in Dubai with 24/7 HSE monitoring, high-density racking and comprehensive VAS.',
    icon: 'Warehouse',
    category: 'Warehousing',
    heroTitle: 'Logistics, Warehousing & Contract Logistics',
    content: `Ports Shipping's Logistics team of experienced professionals consults with each customer to agree the best dedicated or shared warehousing solution, customized according to the scale of the individual business requirement, location and operational model.

Ever attentive to customers' needs and current economic forces, Ports Shipping provides innovative integrated solutions designed to help drive value, via a comprehensive range of warehousing and distribution solutions which combine advanced technologies and value-added services.

With facilities comprising over 15,000 sq. m of ambient and temperature-controlled storage, Ports Shipping caters to the requirements of large and small businesses alike. Our facilities serve sectors as diverse as automotive spare parts, retail, fashion, watches, consumer electronics, hardware, machinery, home furnishings, and humanitarian aid.

We offer three different temperature zones for your cold chains: Ambient (15°C to 25°C), Chilled (2°C to 8°C), and Frozen (-20°C and below).`,
    features: [
      '15,000+ sq. ft. dedicated & shared facilities in Dubai',
      'High-density racking, CCTV & 24/7 HSE monitoring',
      'Bonded CFS storage at Jebel Ali',
      'Ambient (15°C–25°C), Chilled (2°C–8°C) & Frozen (-20°C) storage zones',
      'Pick & pack, barcoding, labeling & repalletization',
      'Web-enabled inventory visibility with real-time access',
      'End-to-end scanning and best-practice operations',
      'Standard pallet, shelved, bins, hanging garment & bulk handling',
      'Last-mile delivery and assembly services',
      'B2C logistics model with advanced TMS technology',
      'Value-Added Services for retail sales periods',
    ],
    keywords: ['warehousing Dubai', 'cold storage UAE', 'temperature controlled storage Dubai', 'contract logistics UAE', '3PL Dubai'],
  },
  {
    slug: 'project-logistics',
    title: 'Project Logistics, OOG & Oil & Energy',
    shortDescription: 'End-to-end solutions for heavy equipment, Out-of-Gauge cargo, and energy sector logistics with expert on-site supervision and technical planning.',
    icon: 'HardHat',
    category: 'Specialized',
    heroTitle: 'Projects, OOG & Oil & Energy Logistics Specialist',
    content: `Ports Shipping's Projects, Oil & Energy division is a proven success in the Middle East. Providing end-to-end solutions in projects management, the company is seen as an expert in the global energy business.

The division carefully studies the geographical and product mix of our clients to provide optimal solutions and save everyone's time and money. Our scheduling flexibility, reliability, availability and management accessibility are renowned in the industry.

From global heavy equipment logistics to monitoring purchase orders and providing expert on-site supervision, we manage every aspect of logistics during the project's entire life span. Our technical planning for heavy lifts and over-dimension loads via special trucks, barges, ocean vessels and aircraft ensures your project is delivered on time and within budget.`,
    features: [
      'Global, international Heavy Equipment Logistics — door-to-door via Truck, Sea, Air & Rail',
      'Complete project lifecycle logistics management',
      'Global purchase order monitoring and updating',
      'Dedicated hands-on project/contract coordination',
      'Expert on-site supervision at origin, destination or transit points',
      'Express cargo shipments when required',
      'Technical planning for heavy lifts & over-dimension loads',
      'Optimal combination of liner services and charters',
      'Detailed documentation with updated status reports',
      'Advice on optimal cargo specs to minimize cost',
      'Door to Airport/Sea Port and vice versa services',
      'Preparation of dispatch paperwork & export documentation',
    ],
    keywords: ['project logistics UAE', 'OOG cargo Dubai', 'oil energy logistics', 'heavy lift UAE', 'project cargo Dubai'],
  },
  {
    slug: 'pharma-healthcare',
    title: 'Pharmaceuticals & Healthcare Logistics',
    shortDescription: 'GDP & HACCP compliant cold chain with FEFO tracking, clinical trial management, and three temperature zones from -20°C to +25°C.',
    icon: 'HeartPulse',
    category: 'Specialized',
    heroTitle: 'Handling of Pharmaceuticals & Healthcare (Storage & Shipping)',
    content: `Our innovative supply chain solutions mirror the shift towards product transparency and direct delivery models from traditional distribution models in the billion-dollar global biopharma market. Our specialized warehouse and distribution services include FEFO picking, clinical trial management, repacking and display configuration.

Delivery services eliminate costs and inefficiencies and include next-day delivery, direct-to-hospital department deliveries, 24/7 standby service and recall management — all available in condition-controlled environments.

Good Distribution Practice (GDP) requires medicines to be obtained from a licensed supply chain and then stored, transported and handled under stipulated conditions. We are fully GDP compliant and HACCP certified, ensuring your pharmaceutical products move through the supply chain with full regulatory integrity.

Our three temperature zones: 15°C to 25°C (ambient), 2°C to 8°C (chilled), and -20°C (frozen) accommodate all pharmaceutical and healthcare storage requirements.`,
    features: [
      'GDP (Good Distribution Practice) compliant operations',
      'HACCP certified cold chain management',
      'FEFO (First Expired First Out) picking and tracking',
      'Clinical trial logistics management',
      'Three temperature zones: 15–25°C, 2–8°C, and -20°C',
      'Next-day delivery and direct-to-hospital department deliveries',
      '24/7 standby service and recall management',
      'Packaging, repackaging, labeling and kitting services',
      'Direct delivery to pharmacies, hospitals, care homes and patients',
      'Diverse temperature-controlled fleet (ambient, refrigerated, frozen)',
      'Hazardous goods handling capability',
      'Brokerage services with compliant cold chain facilities network',
    ],
    keywords: ['pharma logistics Dubai', 'cold chain UAE', 'GDP logistics Dubai', 'healthcare logistics UAE', 'pharmaceutical shipping'],
  },
  {
    slug: 'defense-diplomatic',
    title: 'Defense, Diplomatic & Humanitarian Aid',
    shortDescription: 'Rapid crisis-response cargo, embassy handling, UN supply chain support and mission-critical deliveries with full regulatory compliance.',
    icon: 'Shield',
    category: 'Specialized',
    heroTitle: 'Defense, Diplomatic & Humanitarian Aid Cargo',
    content: `At Ports Shipping LLC, we specialize in the swift, secure and compliant movement of humanitarian relief consignments and diplomatic cargo. Whether your shipment is heading to a crisis zone, a UN mission, an embassy or an international aid organization, our team is ready to provide end-to-end logistics support from origin to destination.

Based in Dubai, we benefit from the UAE's status as an established logistics & humanitarian hub, enabling rapid processing and dispatch of relief cargo. Dubai Customs has streamlined aid-clearance procedures to accelerate global deliveries.

Our team is equipped to manage the special documentation, diplomatic-clearance channels and regulatory requirements associated with humanitarian and governmental shipments. We understand the time-sensitivity, stakeholder-coordination and transparency requirements of aid and diplomatic logistics.`,
    features: [
      'Comprehensive handling of humanitarian aid shipments — food, medical, shelter, emergency kits',
      'Expert management of diplomatic and sensitive cargo',
      'Embassy consignments and official government freight handling',
      'Full customs clearance support in UAE and globally',
      'Multi-modal transport (sea, air, road) to remote/challenging destinations',
      'Real-time coordination and tracking for urgent operations',
      'Special diplomatic-clearance channels and documentation',
      'Defense, military and armoured cargo logistics',
      '350+ global agents including UN mission zones and conflict areas',
      'Swift action and mobilization when time is critical',
      'Rigorous compliance with applicable laws and diplomatic protocols',
    ],
    keywords: ['diplomatic cargo Dubai', 'humanitarian aid logistics UAE', 'defense logistics', 'embassy cargo handling Dubai', 'UN logistics UAE'],
  },
  {
    slug: 'yacht-marine',
    title: 'Yacht & Marine Logistics',
    shortDescription: 'Global boat transportation and freight forwarding via air, road, rail and sea with specialized cradles, shrink-wrapping and load master supervision.',
    icon: 'Anchor',
    category: 'Specialized',
    heroTitle: 'Yacht & Marine Logistics',
    content: `We are highly specialized providers of marine logistics, offering global boat transportation and freight forwarding via air, road, rail and sea from a worldwide network of offices and exclusive agencies. Ports Shipping is the preferred shipper for many of the world's leading yacht manufacturers.

Our expertise in marine logistics includes access to shipping cradles, load masters and surveyors who oversee all operations, covers and shrink wrapping to ensure boats arrive in the best condition from origin to destination, and direct handling through our local offices for all shipment sizes regardless of scale.

Every marine shipment is handled with the same level of care and expertise, whether it's a small pleasure craft or a large luxury superyacht.`,
    features: [
      'Global boat transportation via air, road, rail and sea',
      'Access to specialized shipping cradles and securing equipment',
      'Load Masters & Surveyors overseeing all operations',
      'Covers and shrink wrapping for weather protection',
      'Direct handling through local offices for all sizes',
      'Custom cradle manufacturing for unique vessel dimensions',
      'Rig-move support and offshore logistics',
      'Import/export documentation for marine vessels',
      'Coordination with marinas and boatyards worldwide',
      'Insurance arrangement for high-value marine assets',
    ],
    keywords: ['yacht shipping UAE', 'boat transport Dubai', 'marine logistics UAE', 'superyacht shipping', 'boat freight Dubai'],
  },
  {
    slug: 'aircraft-helicopter',
    title: 'Helicopter & Aircraft Shifting',
    shortDescription: 'Precision road, sea and air transport for helicopters and aircraft, including disassembly, packaging, chartering and full project management.',
    icon: 'Wind',
    category: 'Specialized',
    heroTitle: 'Helicopter, Aircraft & Luxury Aviation Logistics',
    content: `At Ports Shipping LLC, we specialise in the logistics of moving helicopters and aircraft — whether by road, sea or air — with precision, safety and efficiency. We recently handled the road-transport shifting of a helicopter from Abu Dhabi to Jebel Ali Port in Dubai, a project which highlights our capability in moving high-value and specialist cargo.

We also provide aircraft and helicopter chartering solutions for heavy or oversized cargo that cannot be accommodated in standard freighters. Our charter fleet includes nose-loading freighters, rear-loading freighters, ramp-loading aircraft and aircraft with onboard cranes.

Handling aircraft and helicopters requires rigorous planning, truss-packaging, weight/balance control, and route-clearances — areas where we bring deep expertise and specialized equipment.`,
    features: [
      'Road transport of helicopters and aircraft (including disassembly and packaging)',
      'Aircraft charter with sling-lifting capability for heavy items',
      'Multimodal integration (road, sea, air) for full chain management',
      'Full project-management: planning, permits, equipment coordination',
      'Nose-loading, rear-loading and ramp-loading freighter access',
      'Aircraft with onboard cranes for special lifts',
      'Weight/balance control and technical route planning',
      'Truss-packaging and specialized securing systems',
      'Aerospace road transport permits and escort management',
      'From disassembly through crating to reassembly at destination',
    ],
    keywords: ['helicopter transport UAE', 'aircraft shipping Dubai', 'aviation logistics UAE', 'helicopter charter Dubai', 'aircraft relocation'],
  },
  {
    slug: 'cfs-warehousing',
    title: 'Container Freight Station (CFS)',
    shortDescription: 'State-of-the-art fully-racked CFS facilities in Jebel Ali, Oman and Kuwait with HSE monitoring, CCTV and custom-built dock levellers.',
    icon: 'Container',
    category: 'Warehousing',
    heroTitle: 'Container Freight Station (CFS) Operations',
    content: `The Ports Shipping Container Freight Station has become a landmark success, located in Jebel Ali, Oman & Kuwait. Our CFS facility represents a strategic investment in world-class cargo handling infrastructure.

Our state-of-the-art, fully-racked insured warehouse facility incorporates custom built dock levellers to facilitate easy access for trailers, ensuring safe and efficient loading/unloading of cargo at all times.

Health, Safety and Environment (HSE) is paramount across all CFS operations, with the latest fire protection systems installed throughout. All operations are monitored continuously by CCTV to ensure full security and accountability.`,
    features: [
      'State-of-the-art fully-racked insured warehouse facility',
      'Locations in Jebel Ali, Oman & Kuwait',
      'Custom-built dock levellers for easy trailer access',
      'Safe and efficient loading/unloading operations',
      'HSE compliance with latest fire protection systems',
      '24/7 CCTV monitoring of all operations',
      'Bonded warehouse status for transit cargo',
      'LCL cargo consolidation and deconsolidation',
      'Direct Jebel Ali Port connectivity',
      'Cross-docking capability',
    ],
    keywords: ['CFS Jebel Ali', 'container freight station UAE', 'bonded warehouse Dubai', 'LCL warehouse Jebel Ali'],
  },
  {
    slug: 'household-moving',
    title: 'Household & Personal Effects Relocation',
    shortDescription: 'White-glove household moving and personal effects shipping with specialized packers, 350 global agents and dedicated project coordinators.',
    icon: 'Home',
    category: 'Specialized',
    heroTitle: 'Household & Personal Effects Moving & Relocations',
    content: `We understand the sentiments of leaving home and the enthusiasm of relocating to a brand-new home. We comprehend these mixed emotions. Hence, respecting these, our team ensures customized solutions, packing and worry-free shifting and moving of your cargo.

Our movers and packers and handyman experts have years of on-field experience and extensive knowledge and understanding of the business, which ensures high-quality moving, shifting and relocating services to corporates, families and individuals.

We nominate a specialized project coordinator for every enquiry because we believe each of our moves is special and unique. With around 350 agents across 145 countries — including countries which have civil conflicts, United Nations missions and movements of diplomatic counsellors — we can move you anywhere in the world.`,
    features: [
      'Customized packing and worry-free moving solutions',
      'Experienced movers & packers and handyman experts',
      'Dedicated project coordinator for every move',
      '350+ agents across 145 countries worldwide',
      'Coverage including UN mission zones and conflict areas',
      'Diplomatic counsellor relocation expertise',
      'Sea freight, air freight and road transport options',
      'Comprehensive insurance for household goods',
      'Customs clearance at origin and destination',
      'Vehicle shipping and registration assistance',
      'Storage solutions during transition periods',
    ],
    keywords: ['household moving Dubai', 'personal effects shipping UAE', 'relocation services Dubai', 'international moving UAE', 'expat relocation'],
  },
  {
    slug: 'hotel-retail',
    title: 'Hotel, Retail & Shop Logistics',
    shortDescription: 'Full FF&E installation logistics, mock-up room staging, retail distribution and brand refurbishment rollouts for hotels and retail chains.',
    icon: 'Building2',
    category: 'Specialized',
    heroTitle: 'Hotel, Retail & Shop Logistics',
    content: `Opening a hotel or retail shop on time requires a robust supply chain and a dedicated team managing the needs of our clients. Our logistics specialists ensure delivery on time, every time. We work closely with clients to project manage every installation program and use our sophisticated IT solutions to provide an unrivalled service.

With our far-reaching experience and networks of agents worldwide, we can manage and organise your project needs from any origin. Working with your manufacturers, managing your purchase orders, shipping, storage, warehouse management, organising mock-up rooms, delivery, assembly and installation — we have every angle covered.

Our trusted, personalised and proven service will deliver on time every time.`,
    features: [
      'Hotel logistics experts with global network reach',
      'Full transparency of shipments in route, in storage and on site',
      'Freight, warehousing, customs, delivery and installation worldwide',
      'Mock-up room organisation and staging',
      'FF&E (Furniture, Fixtures & Equipment) installation management',
      'Purchase order management from manufacturer to site',
      'Retail distribution and shop fit-out logistics',
      'Brand refurbishment rollout coordination',
      'Design consultancy for sustainable supply chain solutions',
      'Personalized services according to specific project requirements',
      'Opening plan design to timely replenishment of refurbishments',
    ],
    keywords: ['hotel logistics Dubai', 'FF&E installation UAE', 'retail logistics Dubai', 'shop fit-out logistics', 'hotel opening logistics UAE'],
  },
  {
    slug: 'multimodal',
    title: 'Multi-Modal Operations',
    shortDescription: 'Integrated transport chains combining sea, air, road and rail to optimize lead time, reduce costs and maximize supply chain efficiency.',
    icon: 'GitMerge',
    category: 'Land & Customs',
    heroTitle: 'Multi-Modal Transportation Solutions',
    content: `Multimodal transportation is essentially an international through-transport combination with various modes of transport. This results in an integrated transport chain where the strength of each alternative is utilized.

Main characteristics of multimodal transportation are trans-shipment terminals that allow efficient cargo handling between short-distance and long-distance traffic, as well as application of standardized and reusable loading units.

Multimodal modes of transport basically combine the flexibility of trucks with economies of scale of long-distance transport modes. We are able to provide multiple transportation models to optimize efficiency and reduce costs in relation to transportation. Through our services we optimize lead time and reduce inventory costs, thus offering the best possible prices.`,
    features: [
      'Sea/Air multimodal combinations for cost/speed balance',
      'Sea/Land combinations for GCC and regional distribution',
      'Air/Road last-mile delivery solutions',
      'Trans-shipment terminal handling expertise',
      'Standardized and reusable loading unit management',
      'Flexible truck network combined with long-distance economies',
      'Optimized routing to reduce lead time and inventory costs',
      'Single point of contact for all transport modes',
      'Real-time tracking across all transport legs',
      'Documentation management for all modes and border crossings',
    ],
    keywords: ['multimodal transport Dubai', 'sea air freight UAE', 'combined transport logistics', 'intermodal shipping Dubai'],
  },
  {
    slug: 'nvocc',
    title: 'Main Liner & NVOCC Services',
    shortDescription: 'Top-rated NVOCC with LCL services to 145 destinations, weekly sailings on major trade lanes, and competitive consolidation rates.',
    icon: 'Waves',
    category: 'Ocean & Air',
    heroTitle: 'Main Liner & NVOCC (Non-Vessel Operating Common Carrier)',
    content: `As a Non-Vessel Operating Common Carrier, Ports Shipping is rated among the top customers of almost all leading shipping lines operating in the region. This reputation has ensured us competitive rates & space with major liners for consolidated shipments on a regular basis.

We provide seamless ocean freight solutions under both Liner and NVOCC models. Our Main Liner Service offers scheduled sailings on fixed trade-routes by major ocean carriers, with predictable departures, published transit times and standard container services.

As your NVOCC, we act as your carrier or principal — securing bulk space with major liner operators, issuing our own house Bill of Lading, and consolidating cargo where required to offer competitive rates and flexible routing.`,
    features: [
      'LCL services to 145+ global destinations',
      'Representation of various NVOs globally',
      'Weekly scheduled arrivals & departures using reputed carriers',
      'Dedicated sales and customer service team',
      'House Bill of Lading issuance as NVOCC principal',
      'Bulk space contracts with major liner operators',
      'Flexible routing and competitive consolidation rates',
      'Main Liner Service with predictable schedules',
      'Fixed trade-route coverage across major shipping lanes',
      'Real-time cargo tracking and status updates',
    ],
    keywords: ['NVOCC Dubai', 'LCL shipping UAE', 'ocean consolidation Dubai', 'house bill of lading UAE', 'liner agent Dubai'],
  },
  {
    slug: 'foodstuff',
    title: 'Foodstuff Clearance & Cold Chain',
    shortDescription: 'Time-sensitive clearance for ambient, chilled and frozen foodstuffs with full Dubai Municipality compliance, FIRS coordination and HACCP standards.',
    icon: 'UtensilsCrossed',
    category: 'Specialized',
    heroTitle: 'Handling of Foodstuff & Perishable Goods',
    content: `Ports Shipping's foodstuff clearance services cover everything from ambient, chiller and frozen perishable commodities. Our customs clearances, deliveries and handling of foodstuff are time-sensitive, and we ensure your foodstuff arrives on time. We are among the most reliable foodstuff exporters/importers in Dubai and are known to be cost-efficient.

We ensure comprehensive management of fresh vegetables, frozen meat, seafood and supply chain needs from beginning to end. We are duly aware of the processes and regulations required to comply with local authorities including FIRS, foodstuff inspections, labelling, customs, Dubai Municipality and laboratories.

With dedicated ambient (15°C–25°C), chilled (2°C–8°C) and frozen (-20°C and below) logistics zones, we ensure your perishable goods maintain full integrity throughout the journey.`,
    features: [
      'Comprehensive service for all categories: ambient, chilled, frozen, perishable',
      'Ambient (15°C–25°C), Chilled (2°C–8°C) & Frozen (-20°C) zones',
      'FIRS, Dubai Municipality & laboratory coordination',
      'Foodstuff inspection and certification management',
      'Labelling compliance for UAE import/export standards',
      'Fresh vegetables, frozen meat, seafood & dairy supply chain',
      'Temperature-controlled vehicles and warehouses',
      'Real-time monitoring systems throughout the journey',
      'HACCP-compliant handling and storage protocols',
      'Traceability and expiry date management',
      'Competitive pricing for food import/export flows',
      '24/7 support for mission-critical perishable shipments',
    ],
    keywords: ['foodstuff clearance Dubai', 'cold chain UAE', 'perishable logistics Dubai', 'frozen food shipping UAE', 'food import UAE'],
  },
  {
    slug: 'consolidation',
    title: 'Global Consolidation (FCL/LCL/FTL/LTL)',
    shortDescription: 'Flexible FCL, LCL, FTL and LTL consolidation across major trade lanes with one partner, one point of contact and end-to-end visibility.',
    icon: 'Package',
    category: 'Ocean & Air',
    heroTitle: 'Global Consolidators — FCL / LCL / FTL / LTL',
    content: `At Ports Shipping LLC, we specialize in global consolidation services for all shipment sizes and transport modes — from full-loads to smaller freight. Choose the right solution for your cargo: Full Container Load (FCL), Less-Than-Container Load (LCL), Full Truck Load (FTL) or Less-Than-Truck Load (LTL).

With FCL/FTL, your cargo benefits from dedicated containers or trucks — ideal for larger shipments, high-volume loads or when you require exclusive space and faster transit.

With LCL/LTL, you pay only for what you use, leveraging consolidation of multiple shippers' freight into shared containers or trailers — a cost-efficient solution for smaller consignments.

Our global consolidator network ensures seamless connectivity between major trade lanes, with weekly/bi-weekly sailings or shipments, transparent tracking, and optimized routing for both sea and land transport.`,
    features: [
      'FCL — Full Container Load for large/high-volume shipments',
      'LCL — Less-Than-Container Load — pay only for what you ship',
      'FTL — Full Truck Load for dedicated road freight',
      'LTL — Less-Than-Truck Load for cost-efficient smaller consignments',
      'Weekly/bi-weekly sailings on major trade lanes',
      'Global agent and partner network for optimized routing',
      'Collection, consolidation, documentation and delivery — one partner',
      'Customs clearance included in service scope',
      'Transparent tracking and proactive status updates',
      'Tailored cost-effective solutions for all cargo types',
      'International, GCC and domestic movement coverage',
    ],
    keywords: ['LCL shipping Dubai', 'FCL freight UAE', 'consolidation shipping Dubai', 'LTL freight UAE', 'FTL trucking Dubai'],
  },
  {
    slug: 'humanitarian-aid',
    title: 'Humanitarian Aid & Diplomatic Cargo',
    shortDescription: 'Specialized handling of UN aid, NGO relief consignments and diplomatic cargo with swift clearance from Dubai — the global humanitarian hub.',
    icon: 'Heart',
    category: 'Specialized',
    heroTitle: 'Humanitarian Aid & Diplomatic Cargo Clearances',
    content: `At Ports Shipping LLC, we specialise in the swift, secure and compliant movement of humanitarian relief consignments and diplomatic cargo. Whether your shipment is heading to a crisis zone, a UN mission, an embassy or an international aid organisation, our team is ready to provide end-to-end logistics support from origin to destination.

Based in Dubai, we benefit from the UAE's status as an established logistics & humanitarian hub, enabling rapid processing and dispatch of relief cargo. Dubai Customs has streamlined aid-clearance procedures to accelerate global deliveries.

Our end-to-end process: Initial consultation on shipment nature, urgency and regulatory context → Packing and documentation assistance → Transport and consolidation coordination → Customs clearance and diplomatic waiver processing → Post-delivery reporting and accountability.`,
    features: [
      'Humanitarian aid: food, medical supplies, shelter & emergency kits',
      'Diplomatic cargo and embassy consignment handling',
      'Full customs clearance support in UAE and globally',
      'Multi-modal transport to remote or challenging destinations',
      'Real-time coordination and tracking for urgent operations',
      'Diplomatic-clearance channels and waiver processing',
      'Relief-cargo certificates and diplomatic import licenses',
      'Consolidation, routing and cost-efficient transport selection',
      'UN mission zone delivery capability',
      'Swift mobilisation for crisis-response operations',
      'Post-delivery reporting for accountability and transparency',
    ],
    keywords: ['humanitarian aid logistics Dubai', 'UN cargo UAE', 'NGO logistics Dubai', 'diplomatic cargo UAE', 'aid shipment Dubai'],
  },
];

export default ALL_SERVICES;
