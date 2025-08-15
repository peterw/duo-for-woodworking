import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';

interface AppIconsProps {
  type: string;
  name: string;
  size: number;
  color: string;
}

const AppIcons: React.FC<AppIconsProps> = ({ type, name, size, color }) => {
  // Map MaterialCommunityIcons names to SF Symbols names
  const iconMap: { [key: string]: string } = {
    'home-variant': 'house.fill',
    'mosque': 'building.2.fill',
    'book-open-variant': 'book.fill',
    'book-open-page-variant': 'book.closed.fill',
    'account-circle': 'person.fill',
    'hammer': 'hammer.fill',
  };

  const sfSymbolName = iconMap[name] || 'circle.fill';

  return <IconSymbol size={size} name={sfSymbolName} color={color} />;
};

export default AppIcons;
