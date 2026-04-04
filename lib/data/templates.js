// Template definitions - seed data for available templates
// Your friend will provide actual images later; using placeholders for now

export const templates = [
  {
    id: 'einvite-1',
    name: 'Einvite Template 1',
    category: 'Hindu Wedding',
    description: 'A beautifully scrolling invitation template modeled directly after the elegant Figma design.',
    thumbnail: '/assets/templates/hindu-royal-thumb.jpg',
    previewImages: [],
    price: 0,
    features: ['Figma Sourced Assets', 'Smooth Scrolling', 'Parallax', 'Add Events'],
    colors: {
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      accent: '#FFD700',
      background: '#FCF9F2',
    },
    sampleSlug: 'sathish-kumar-weds-priya-loganathan-mnk00gmc',
  },
  {
    id: 'hindu-royal',
    name: 'Royal Celebration',
    category: 'Hindu Wedding',
    description: 'A majestic Hindu wedding template with traditional motifs, warm gold accents, and elegant scroll animations. Perfect for grand celebrations.',
    thumbnail: '/assets/templates/hindu-royal-thumb.jpg',
    previewImages: [
      '/assets/templates/hindu-royal-1.jpg',
      '/assets/templates/hindu-royal-2.jpg',
    ],
    price: 0,
    features: ['Scroll Animations', 'Event Timeline', 'Gallery', 'Venue Map', 'RSVP'],
    colors: {
      primary: '#B8860B',
      secondary: '#8B0000',
      accent: '#FFD700',
      background: '#FFF8F0',
    },
    sampleSlug: null,
  },
  {
    id: 'christian-elegant',
    name: 'Elegant Grace',
    category: 'Christian Wedding',
    description: 'A sophisticated Christian wedding template with soft pastels, floral elements, and graceful typography.',
    thumbnail: '/assets/templates/christian-elegant-thumb.jpg',
    previewImages: [],
    price: 0,
    features: ['Scroll Animations', 'Event Timeline', 'Gallery', 'Church Details'],
    colors: {
      primary: '#4A6741',
      secondary: '#8B7355',
      accent: '#D4AF37',
      background: '#FAF9F6',
    },
    comingSoon: true,
    sampleSlug: null,
  },
  {
    id: 'muslim-regal',
    name: 'Regal Nikah',
    category: 'Muslim Wedding',
    description: 'A regal wedding invitation with rich emerald and gold tones, intricate geometric patterns, and smooth animations.',
    thumbnail: '/assets/templates/muslim-regal-thumb.jpg',
    previewImages: [],
    price: 0,
    features: ['Scroll Animations', 'Event Timeline', 'Gallery', 'Venue Map'],
    colors: {
      primary: '#006400',
      secondary: '#1C1C1C',
      accent: '#FFD700',
      background: '#F5F5F0',
    },
    comingSoon: true,
    sampleSlug: null,
  },
  {
    id: 'sikh-grandeur',
    name: 'Golden Grandeur',
    category: 'Sikh Wedding',
    description: 'A grand Sikh wedding template celebrating Punjabi traditions with vibrant colors, bold typography, and festive animations.',
    thumbnail: '/assets/templates/sikh-grandeur-thumb.jpg',
    previewImages: [],
    price: 0,
    features: ['Scroll Animations', 'Event Timeline', 'Gallery', 'Venue Map'],
    colors: {
      primary: '#FF8C00',
      secondary: '#4169E1',
      accent: '#FFD700',
      background: '#FFFAF0',
    },
    comingSoon: true,
    sampleSlug: null,
  },
  {
    id: 'south-indian-classic',
    name: 'Temple Bells',
    category: 'South-Indian Wedding',
    description: 'A traditional South-Indian wedding template with temple motifs, silk saree-inspired colors, and divine aesthetics.',
    thumbnail: '/assets/templates/south-indian-thumb.jpg',
    previewImages: [],
    price: 0,
    features: ['Scroll Animations', 'Event Timeline', 'Gallery', 'Venue Map'],
    colors: {
      primary: '#8B0000',
      secondary: '#DAA520',
      accent: '#FF6347',
      background: '#FFF5EE',
    },
    comingSoon: true,
    sampleSlug: null,
  },
];

export const categories = [
  'All',
  'Hindu Wedding',
  'Christian Wedding',
  'Muslim Wedding',
  'Sikh Wedding',
  'South-Indian Wedding',
];

export function getTemplateById(id) {
  return templates.find(t => t.id === id);
}

export function getTemplatesByCategory(category) {
  if (category === 'All') return templates;
  return templates.filter(t => t.category === category);
}
