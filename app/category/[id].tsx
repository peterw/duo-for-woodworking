import CategoryScreen from '@/components/CategoryScreen';
import { useUserProgressStore } from '@/stores';
import { getCategoryDisplayInfo } from '@/utils/categoryMapping';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

export default function DynamicCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, fetchAllData } = useUserProgressStore();
  
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);
  
  // Get category data from Firestore
  const getCategoryData = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const displayInfo = getCategoryDisplayInfo(categoryId);
    
    return {
      id: categoryId,
      title: category?.name || displayInfo.title,
      description: category?.description || displayInfo.description,
      icon: category?.icon || displayInfo.icon,
      color: category?.color || displayInfo.color,
    };
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
