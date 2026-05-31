import { MenuItem, Review, GalleryItem } from './types';

// Let's reference our generated high-resolution assets
import appetizerImg from './assets/images/gourmet_appetizer_1780243675665.png';
import mainImg from './assets/images/wagyu_main_course_1780243694472.png';
import dessertImg from './assets/images/luxury_dessert_1780243715278.png';
import heroImg from './assets/images/luxury_interior_hero_1780243655027.png';

export { heroImg };

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'app-1',
    name: 'Gourmet Gold Leaf Heirloom Tartlet',
    description: 'Heritage heirloom tomatoes, house-whipped goat cheese, and micro-herbs, crowned with edible 24k gold leaf and basil-infused aerosol on dark slate.',
    price: 34,
    category: 'appetizer',
    image: appetizerImg,
    dietary: ['Vegetarian', 'Signature'],
    signature: true
  },
  {
    id: 'app-2',
    name: 'Wild Atlantic Diver Scallops',
    description: 'Pan-seared scallops served over velvet sunchoke purée, pickled chanterelles, and a light saffron-lemongrass emulsion with coral tuile.',
    price: 38,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1532636875304-0c8fe119ff91?q=80&w=600&auto=format&fit=crop',
    dietary: ['Gluten-Free', 'Seafood'],
  },
  {
    id: 'app-3',
    name: 'Grand Reserve Ossetra Caviar',
    description: 'Traditional accompaniments, including house-made chive blinis, sieved organic egg yolks, and heavy creme fraiche with mother-of-pearl utensil.',
    price: 185,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop',
    dietary: ['Luxury'],
    signature: true
  },
  {
    id: 'main-1',
    name: 'A5 Miyazakigyu Wagyu',
    description: 'A5 grade pan-seared Wagyu beef cooked medium rare, resting on a pool of glossy black truffle-infused jus, garnished with fresh shaved winter black truffle.',
    price: 165,
    category: 'main',
    image: mainImg,
    dietary: ['Gluten-Free', 'Signature'],
    signature: true
  },
  {
    id: 'main-2',
    name: 'Glazed line-caught King Sea Bass',
    description: 'Infused with white miso and ginger-shayu lacquer, roasted bok choy, and ginger-infused master broth poured tableside.',
    price: 68,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop',
    dietary: ['Seafood'],
  },
  {
    id: 'main-3',
    name: 'Chantilly-Glazed Duck à l’Orange',
    description: 'Dry-aged duck breast with spiced honey and Seville orange finish, braised endive, heirloom carrots, and wild lavender.',
    price: 54,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?q=80&w=600&auto=format&fit=crop',
    dietary: [],
  },
  {
    id: 'main-4',
    name: 'Wild Forest Morel Linguine',
    description: 'House-made alignment of hand-rolled ribbon pasta, wild chanterelles, fresh shaved autumn truffles, and white wine pecorino cream.',
    price: 48,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1621996346565-e3bb646199b6?q=80&w=600&auto=format&fit=crop',
    dietary: ['Vegetarian'],
  },
  {
    id: 'dessert-1',
    name: 'La Sphère de Chocolat Noir',
    description: 'An exquisite glossy dark chocolate dome with edible gold gilding, salted dynamic caramel drizzle, and micro raspberry coulis.',
    price: 28,
    category: 'dessert',
    image: dessertImg,
    dietary: ['Vegetarian', 'Signature'],
    signature: true
  },
  {
    id: 'dessert-2',
    name: 'Golden Honeycomb & Saffron Crème',
    description: 'Silky local wild honey custard, glazed Persian saffron syrup, edible rose petals, and crispy honeycomb candy shards.',
    price: 24,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop',
    dietary: ['Vegetarian', 'Gluten-Free'],
  },
  {
    id: 'beverage-1',
    name: 'Crowned Royal Velvet Old Fashioned',
    description: 'Rare 18-year small-batch bourbon, demerara sugar syrup, gold-flaked orange peel, and cherry bark wood smoke infuser.',
    price: 32,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600&auto=format&fit=crop',
    dietary: ['Alcoholic'],
    signature: true
  },
  {
    id: 'beverage-2',
    name: 'Dom Pérignon vintage Reserve',
    description: 'Prestige champagne of impeccable freshness. Generous toasted almond and ripe citrus profile. Served by glass.',
    price: 95,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1596541221764-dd5607db75ca?q=80&w=600&auto=format&fit=crop',
    dietary: ['Alcoholic'],
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Grand Dining Salon',
    category: 'interior',
    image: heroImg,
    description: 'A look at the dining salon featuring deep charcoal velvets, gold finishes, and intimate lighting layout.'
  },
  {
    id: 'gal-2',
    title: 'Precision Craft of Plating',
    category: 'dish',
    image: appetizerImg,
    description: 'Our culinary artists meticulously refining complex colors and flavors.'
  },
  {
    id: 'gal-3',
    title: 'A5 Miyazakigyu Masterpiece',
    category: 'dish',
    image: mainImg,
    description: 'Searing perfection under direct micro-focused spotlighting.'
  },
  {
    id: 'gal-4',
    title: 'The Champagne & Wine Cellar',
    category: 'wine',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
    description: 'Home to over 1,200 bottles of heritage vintage reserves handpicked by our Master Sommelier.'
  },
  {
    id: 'gal-5',
    title: 'The Chef’s Counter Experience',
    category: 'experience',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
    description: 'Front-row sensory exposure to the intense atmosphere of custom culinary engineering.'
  },
  {
    id: 'gal-6',
    title: 'La Sphère Final Touch',
    category: 'dish',
    image: dessertImg,
    description: 'Infusing hot gourmet dynamic caramel atop a gold-flake sphere.'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Eleanor Vance',
    role: 'Gastronomy Critic, Le Guide',
    rating: 5,
    text: 'A absolute masterpiece of modern sensory engineering. The A5 Miyazakigyu is unmatched, but the sheer atmospheric excellence of Aurelia is what sets a new global gold standard.',
    date: 'April 2026'
  },
  {
    id: 'rev-2',
    name: 'Maximilian Sterling',
    role: 'VIP Concierge Club',
    rating: 5,
    text: 'An unforgettable evening. Booking the Wine Cellar Lounge is highly recommended. The Sommelier pairings are breathtakingly curated. A must for serious food connoisseurs.',
    date: 'May 2026'
  },
  {
    id: 'rev-3',
    name: 'Dr. Evelyn Rousseau',
    role: 'Patron Poet and Scholar',
    rating: 5,
    text: 'The glassmorphic design and dark interior theme feel intimate and celestial. It is more than deep luxury dining, it is spatial theater. The Gold Leaf Heirloom Tartlet was culinary poetry.',
    date: 'May 2026'
  }
];
