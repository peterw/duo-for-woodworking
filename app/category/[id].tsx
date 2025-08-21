import CategoryScreen from '@/components/CategoryScreen';
import { useLocalSearchParams } from 'expo-router';

export default function DynamicCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Define category data based on the ID
  const getCategoryData = (categoryId: string) => {
    switch (categoryId) {
      case 'furniture':
        return {
          title: 'Furniture',
          description: 'Tables, chairs, cabinets, and more',
          color: '#8B4513',
          icon: 'chair.lounge'
        };
      case 'decorative':
        return {
          title: 'Decorative',
          description: 'Wall art, signs, and decorative items',
          color: '#D2691E',
          icon: 'paintbrush'
        };
      case 'outdoor':
        return {
          title: 'Outdoor',
          description: 'Decks, pergolas, and garden items',
          color: '#228B22',
          icon: 'leaf'
        };
      case 'storage':
        return {
          title: 'Storage',
          description: 'Boxes, shelves, and organizers',
          color: '#4169E1',
          icon: 'cube.box'
        };
      case 'toys':
        return {
          title: 'Toys & Games',
          description: 'Wooden toys and game pieces',
          color: '#FF6347',
          icon: 'gamecontroller'
        };
      case 'kitchen':
        return {
          title: 'Kitchen & Dining',
          description: 'Cutting boards, utensils, and more',
          color: '#CD853F',
          icon: 'fork.knife'
        };
      default:
        return {
          title: 'Category',
          description: 'Woodworking projects',
          color: '#8B4513',
          icon: 'hammer.fill'
        };
    }
  };

  const categoryData = getCategoryData(id || 'furniture');

  return (
    <CategoryScreen
      categoryId={id || 'furniture'}
      categoryTitle={categoryData.title}
      categoryDescription={categoryData.description}
      categoryColor={categoryData.color}
      categoryIcon={categoryData.icon}
    />
  );
}
