// Category mapping utility to convert Firestore category IDs to user-friendly display information

export interface CategoryDisplayInfo {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const getCategoryDisplayInfo = (categoryId: string): CategoryDisplayInfo => {
  const categoryMap: { [key: string]: CategoryDisplayInfo } = {
    'furniture': {
      title: 'Furniture',
      description: 'Tables, chairs, cabinets, and more',
      icon: 'chair.lounge',
      color: '#FF6347'
    },
    'safety': {
      title: 'Safety',
      description: 'Essential safety practices and equipment',
      icon: 'shield.fill',
      color: '#FF6B35'
    },
    'decorative': {
      title: 'Decorative',
      description: 'Wall art, signs, and decorative items',
      icon: 'paintbrush',
      color: '#D2691E'
    },
    'tools': {
      title: 'Tools',
      description: 'Essential woodworking tools and equipment',
      icon: 'hammer.fill',
      color: '#58CC02'
    },
    'joinery': {
      title: 'Joinery',
      description: 'Wood joining methods and techniques',
      icon: 'link',
      color: '#1CB0F6'
    },
    'outdoor': {
      title: 'Outdoor',
      description: 'Decks, pergolas, and garden items',
      icon: 'leaf',
      color: '#228B22'
    },
    'storage': {
      title: 'Storage',
      description: 'Boxes, shelves, and organizers',
      icon: 'cube.box',
      color: '#4169E1'
    },
    'toys': {
      title: 'Toys & Games',
      description: 'Wooden toys and game pieces',
      icon: 'gamecontroller',
      color: '#FF6347'
    },
    'kitchen': {
      title: 'Kitchen & Dining',
      description: 'Cutting boards, utensils, and more',
      icon: 'fork.knife',
      color: '#CD853F'
    },
    'design': {
      title: 'Design',
      description: 'Project planning and design principles',
      icon: 'pencil.and.outline',
      color: '#9C27B0'
    },
    'finishing': {
      title: 'Finishing',
      description: 'Surface preparation and finishing techniques',
      icon: 'paintbrush.fill',
      color: '#795548'
    },
    'techniques': {
      title: 'Techniques',
      description: 'Advanced woodworking techniques',
      icon: 'wrench.and.screwdriver.fill',
      color: '#607D8B'
    }
  };
  
  return categoryMap[categoryId] || {
    title: 'Category',
    description: 'Woodworking projects',
    icon: 'hammer.fill',
    color: '#8B4513'
  };
};
