// Domain Generation Databases for High-Ticket E-commerce

export const DOMAIN_DATABASES = {
    // Professional Domain Components
    prefixes: [
        'Pro', 'Elite', 'Prime', 'Ultimate', 'Premium', 'Expert', 'Master', 
        'Superior', 'Advanced', 'Executive', 'Platinum', 'Diamond', 'Gold',
        'Apex', 'Summit', 'Peak', 'Top', 'Leading', 'Premier', 'Select',
        'Signature', 'Prestige', 'Luxury', 'Deluxe', 'First', 'Alpha'
    ],

    suffixes: [
        'Pro', 'Direct', 'Zone', 'Hub', 'Base', 'HQ', 'Central', 'Source',
        'Supply', 'Depot', 'Works', 'Solutions', 'Systems', 'Group',
        'Company', 'Corp', 'Ventures', 'Partners', 'Associates', 'Collective',
        'Studio', 'Labs', 'Workshop', 'Factory', 'House', 'Store'
    ],

    // Popular niches with canonical categories and synonyms
    // Used to: (1) Prefer preloaded competitors first; (2) Enforce exactly 5 when in DB; (3) Provide suggestions on errors
    popularNiches: {
        'backyard': { synonyms: ['patio', 'garden', 'yard', 'lawn', 'landscape', 'deck'] },
        'pizza oven': { synonyms: ['outdoor oven', 'wood fired oven', 'backyard cooking'] },
        'marine': { synonyms: ['boat', 'nautical', 'sailing', 'yacht', 'ocean', 'sea'] },
        'fitness': { synonyms: ['gym', 'training', 'workout', 'strength', 'home gym'] },
        'drone': { synonyms: ['uav', 'quadcopter', 'aerial', 'fpv', 'drones'] },
        'kitchen': { synonyms: ['culinary', 'cookware', 'appliances'] },
        'golf': { synonyms: ['golfing', 'golf gear', 'golf clubs'] },
        'wellness': { synonyms: ['health', 'spa', 'recovery', 'sauna'] },
        'garage': { synonyms: ['workshop', 'automotive', 'storage'] },
        'smart home': { synonyms: ['home automation', 'iot', 'connected home'] },
        'fireplace': { synonyms: ['hearth', 'fire', 'electric fireplace', 'gas fireplace'] },
        'hvac': { synonyms: ['heating', 'cooling', 'air conditioning'] },
        'safes': { synonyms: ['safe', 'vault', 'gun safe'] },
        'solar': { synonyms: ['solar kits', 'solar power', 'photovoltaic'] },
        'generators': { synonyms: ['generator', 'backup power'] },
        'horse riding': { synonyms: ['equestrian', 'equine', 'horses'] },
        'sauna': { synonyms: ['infrared sauna', 'steam sauna'] },
        'home theater': { synonyms: ['theater seating', 'projector', 'audio'] },
        'man cave': { synonyms: ['mancave', 'den', 'retreat', 'hideout', 'sanctuary'] },
        'mancave': { synonyms: ['man cave', 'den', 'retreat', 'hideout', 'sanctuary'] }
    },

    // High-ticket physical product niche keywords (strict list used for UI display)
    strictNicheKeywords: {
        // BACKYARD NICHE
        'backyard': ['backyard', 'yard', 'patio', 'deck', 'outdoor', 'garden space', 'courtyard'],
        'bbq': ['bbq', 'barbecue', 'grill', 'grilling', 'smoker', 'charcoal', 'gas grill', 'outdoor cooking'],
        'fire': ['fire', 'fireplace', 'firepit', 'flame', 'bonfire', 'outdoor heater'],
        'pool': ['pool', 'spa', 'hot tub', 'swim', 'swimming pool', 'jacuzzi', 'backyard oasis'],
        'garden': ['garden', 'landscape', 'lawn', 'plant', 'vegetable patch', 'flower bed', 'shrubs', 'soil'],

        // SMART HOME NICHE
        'smart': ['smart', 'automated', 'connected', 'intelligent', 'AI-driven', 'IoT-enabled'],
        'home': ['home', 'house', 'residence', 'domestic', 'homestead', 'apartment'],
        'security': ['security', 'camera', 'alarm', 'monitoring', 'smart lock', 'doorbell camera', 'CCTV'],
        'lighting': ['lighting', 'lights', 'led', 'illumination', 'smart bulbs', 'dimmers', 'mood lighting'],
        'climate': ['climate', 'thermostat', 'heating', 'cooling', 'HVAC', 'air conditioning', 'smart thermostat'],

        // YARD EQUIPMENT NICHE  
        'yard': ['yard', 'lawn', 'garden', 'landscape', 'outdoor space', 'backlot'],
        'mower': ['mower', 'mowing', 'cutting', 'trimmer', 'lawnmower', 'weed whacker', 'edger'],
        'equipment': ['equipment', 'tools', 'machinery', 'gear', 'hardware'],
        'maintenance': ['maintenance', 'care', 'upkeep', 'repair', 'seasonal care'],

        // WELLNESS NICHE
        'wellness': ['wellness', 'health', 'wellbeing', 'recovery', 'self-care', 'holistic'],
        'massage': ['massage', 'therapy', 'relaxation', 'spa', 'deep tissue', 'aromatherapy'],
        'sauna': ['sauna', 'steam', 'infrared', 'heat', 'sweat therapy', 'detox'],
        'meditation': ['meditation', 'mindfulness', 'zen', 'calm', 'breathing', 'focus', 'guided meditation'],

        // FITNESS NICHE
        'fitness': ['fitness', 'gym', 'workout', 'exercise', 'training', 'HIIT', 'bodyweight'],
        'strength': ['strength', 'weight', 'power', 'muscle', 'resistance', 'lifting', 'barbell'],
        'cardio': ['cardio', 'running', 'cycling', 'endurance', 'rowing', 'aerobics', 'jump rope'],
        'fitness equipment': ['equipment', 'machine', 'gear', 'apparatus', 'dumbbells', 'treadmill'],

        // GARAGE NICHE
        'garage': ['garage', 'workshop', 'storage', 'workspace', 'shed', 'man cave'],
        'tool': ['tool', 'tools', 'equipment', 'machinery', 'power tools', 'hand tools'],
        'automotive': ['automotive', 'car', 'vehicle', 'auto', 'mechanic', 'engine', 'tuning'],
        'organization': ['organization', 'storage', 'cabinet', 'rack', 'shelving', 'toolbox'],

        // OUTDOOR/ADVENTURE NICHE
        'outdoor': ['outdoor', 'adventure', 'camping', 'hiking', 'trekking', 'nature', 'expedition'],
        'gear': ['gear', 'equipment', 'tools', 'apparatus', 'backpack', 'tent', 'sleeping bag'],
        'survival': ['survival', 'tactical', 'emergency', 'prep', 'bushcraft', 'first aid'],
        'recreation': ['recreation', 'activity', 'sport', 'leisure', 'kayaking', 'climbing', 'exploration'],

        // MARINE NICHE
        'marine': ['marine', 'boat', 'yacht', 'vessel', 'sailing', 'nautical'],
        'water': ['water', 'ocean', 'sea', 'lake', 'river', 'waves', 'coastal'],
        'fishing': ['fishing', 'angling', 'catch', 'tackle', 'fly fishing', 'rod', 'bait'],
        'navigation': ['navigation', 'gps', 'compass', 'chart', 'sonar', 'radar'],

        // HORSE RIDING NICHE
        'horse': ['horse', 'equine', 'equestrian', 'riding', 'pony'],
        'riding': ['riding', 'saddle', 'bridle', 'tack', 'jodhpurs', 'reins'],
        'stable': ['stable', 'barn', 'arena', 'paddock', 'stall', 'hayloft'],
        'training': ['training', 'dressage', 'jumping', 'competition', 'horsemanship', 'eventing'],

        // GOLF NICHE
        'golf': ['golf', 'golfing', 'golf course', 'putting', 'driving range', 'golf simulator'],
        'club': ['club', 'clubs', 'driver', 'putter', 'iron', 'wedge', 'wood'],
        'course': ['course', 'green', 'fairway', 'bunker', 'tee', 'hole'],
        'golf equipment': ['equipment', 'gear', 'bag', 'cart', 'shoes', 'gloves'],

        // HOME THEATER NICHE
        'theater': ['theater', 'theatre', 'cinema', 'home cinema', 'movie room', 'media room'],
        'seating': ['seating', 'chairs', 'recliners', 'sofa', 'sectional', 'theater seats'],
        'audio': ['audio', 'sound', 'speakers', 'subwoofer', 'receiver', 'amplifier'],
        'video': ['video', 'projector', 'screen', 'display', '4K', 'HD', 'streaming'],

        // SAFES NICHE
        'safe': ['safe', 'safes', 'vault', 'security', 'protection', 'storage'],
        'gun': ['gun', 'firearm', 'weapon', 'rifle', 'pistol', 'ammunition'],
        'jewelry': ['jewelry', 'jewellery', 'diamonds', 'gold', 'silver', 'precious metals'],
        'document': ['document', 'documents', 'paper', 'files', 'records', 'certificates'],

        // SOLAR NICHE
        'solar': ['solar', 'photovoltaic', 'PV', 'renewable', 'green energy', 'sustainability'],
        'panel': ['panel', 'panels', 'module', 'modules', 'array', 'installation'],
        'battery': ['battery', 'storage', 'backup', 'power', 'energy', 'inverter'],
        'system': ['system', 'kit', 'package', 'installation', 'setup', 'configuration'],

        // GENERATORS NICHE
        'generator': ['generator', 'genset', 'backup', 'emergency', 'power', 'electricity'],
        'portable': ['portable', 'mobile', 'standby', 'stationary', 'industrial', 'commercial'],
        'fuel': ['fuel', 'gas', 'diesel', 'propane', 'natural gas', 'dual fuel'],
        'power': ['power', 'wattage', 'voltage', 'amperage', 'capacity', 'output'],

        // HVAC NICHE
        'hvac': ['hvac', 'heating', 'cooling', 'ventilation', 'air conditioning', 'climate control'],
        'furnace': ['furnace', 'boiler', 'heat pump', 'radiator', 'ductwork', 'thermostat'],
        'air': ['air', 'conditioning', 'conditioner', 'unit', 'system', 'refrigerant'],
        'ventilation': ['ventilation', 'airflow', 'duct', 'fan', 'blower', 'exhaust'],

        // KITCHEN NICHE
        'kitchen': ['kitchen', 'culinary', 'cooking', 'appliance', 'equipment', 'tools'],
        'appliance': ['appliance', 'refrigerator', 'stove', 'oven', 'dishwasher', 'microwave'],
        'coffee': ['coffee', 'espresso', 'brewing', 'grinder', 'machine', 'equipment'],
        'cookware': ['cookware', 'pots', 'pans', 'utensils', 'knives', 'cutting boards'],

        // WELLNESS NICHE (DUPLICATE REMOVED)
        'wellness recovery': ['wellness', 'health', 'wellbeing', 'recovery', 'self-care', 'holistic'],
        'massage therapy': ['massage', 'therapy', 'relaxation', 'spa', 'deep tissue', 'aromatherapy'],
        'sauna wellness': ['sauna', 'steam', 'infrared', 'heat', 'sweat therapy', 'detox'],
        'meditation wellness': ['meditation', 'mindfulness', 'zen', 'calm', 'breathing', 'focus', 'guided meditation'],

        // FIREPLACE NICHE
        'fireplace': ['fireplace', 'hearth', 'fire', 'flame', 'burning', 'warmth'],
        'electric': ['electric', 'electricity', 'powered', 'plug-in', 'wall-mounted', 'freestanding'],
        'gas': ['gas', 'propane', 'natural gas', 'vented', 'ventless', 'log set'],
        'wood': ['wood', 'wood-burning', 'firewood', 'logs', 'chimney', 'flue'],

        // PIZZA OVEN NICHE
        'pizza': ['pizza', 'oven', 'wood-fired', 'outdoor', 'backyard', 'cooking'],
        'wood fire': ['wood', 'fire', 'burning', 'flame', 'heat', 'temperature'],
        'outdoor cooking': ['outdoor', 'backyard', 'patio', 'deck', 'garden', 'exterior'],
        'cooking': ['cooking', 'baking', 'roasting', 'grilling', 'preparation', 'culinary']
    },

    // Domain generation patterns by niche
    generationPatterns: {
        'backyard': {
            primaryKeywords: ['backyard', 'outdoor', 'patio', 'deck', 'garden'],
            secondaryKeywords: ['pro', 'elite', 'premium', 'direct', 'solutions'],
            avoidKeywords: ['cheap', 'budget', 'discount', 'sale']
        },
        'marine': {
            primaryKeywords: ['marine', 'boat', 'nautical', 'water', 'ocean'],
            secondaryKeywords: ['pro', 'direct', 'supply', 'depot', 'solutions'],
            avoidKeywords: ['cheap', 'budget', 'discount', 'sale']
        },
        'fitness': {
            primaryKeywords: ['fitness', 'gym', 'strength', 'training', 'workout'],
            secondaryKeywords: ['pro', 'elite', 'premium', 'direct', 'solutions'],
            avoidKeywords: ['cheap', 'budget', 'discount', 'sale']
        },
        'smart home': {
            primaryKeywords: ['smart', 'home', 'automation', 'iot', 'connected'],
            secondaryKeywords: ['pro', 'elite', 'premium', 'direct', 'solutions'],
            avoidKeywords: ['cheap', 'budget', 'discount', 'sale']
        },
        'wellness': {
            primaryKeywords: ['wellness', 'health', 'spa', 'recovery', 'wellbeing'],
            secondaryKeywords: ['pro', 'elite', 'premium', 'direct', 'solutions'],
            avoidKeywords: ['cheap', 'budget', 'discount', 'sale']
        }
    },

    // Domain quality scoring criteria
    qualityCriteria: {
        length: { optimal: 12, min: 7, max: 20 },
        wordCount: { optimal: 2, min: 1, max: 3 },
        readability: { high: ['pro', 'elite', 'premium'], medium: ['direct', 'solutions'], low: ['cheap', 'budget'] },
        brandability: { high: ['unique', 'memorable'], medium: ['descriptive'], low: ['generic', 'common'] }
    }
};

export default DOMAIN_DATABASES;
