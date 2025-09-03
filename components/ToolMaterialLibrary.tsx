import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getMaterials, getTools } from '@/services/firestoreService';
import { toolMaterialService } from '@/services/toolMaterialService';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Tool {
  id: string;
  name: string;
  type: 'hand' | 'power' | 'measuring' | 'safety';
  category: string;
  description: string;
  alternatives: string[];
  safetyNotes: string;
  maintenanceTips: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  price: string;
  priceValue: number; // Numeric value for sorting
  essential: boolean;
  popularity: number; // Popularity score for sorting
  suppliers?: string[]; // Available suppliers
}

interface Material {
  id: string;
  name: string;
  type: 'wood' | 'hardware' | 'finish' | 'adhesive';
  category: string;
  description: string;
  properties: string[];
  alternatives: string[];
  careTips: string;
  compatibility: string[];
  price: string;
  priceValue: number; // Numeric value for sorting
  availability: 'common' | 'specialty' | 'rare';
  suppliers: string[]; // Available suppliers
  substitutes: string[]; // Recommended substitutes
}

interface ToolMaterialLibraryProps {
  onSelectTool?: (tool: Tool) => void;
  onSelectMaterial?: (material: Material) => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Sample tool database with enhanced data
const toolsDatabase: Tool[] = [
  {
    id: '1',
    name: 'Chisels',
    type: 'hand',
    category: 'Cutting',
    description: 'Sharp cutting tools for removing wood and creating joints',
    alternatives: ['Router', 'Jigsaw', 'Hand saw'],
    safetyNotes: 'Always cut away from your body, keep chisels sharp, use proper hand positioning',
    maintenanceTips: 'Hone regularly with sharpening stones, store in protective sleeves, oil metal parts',
    skillLevel: 'beginner',
    price: '$20-100',
    priceValue: 60,
    essential: true,
    popularity: 95,
    suppliers: ['Home Depot', 'Lowes', 'Woodcraft', 'Amazon'],
  },
  {
    id: '2',
    name: 'Circular Saw',
    type: 'power',
    category: 'Cutting',
    description: 'Power tool for making straight cuts in wood',
    alternatives: ['Hand saw', 'Jigsaw', 'Table saw'],
    safetyNotes: 'Wear safety glasses, secure workpiece, keep blade guard in place',
    maintenanceTips: 'Clean regularly, replace dull blades, check cord for damage',
    skillLevel: 'intermediate',
    price: '$50-200',
    priceValue: 125,
    essential: false,
    popularity: 88,
    suppliers: ['Home Depot', 'Lowes', 'Harbor Freight', 'Amazon'],
  },
  {
    id: '3',
    name: 'Tape Measure',
    type: 'measuring',
    category: 'Layout',
    description: 'Essential tool for accurate measurements',
    alternatives: ['Ruler', 'Yardstick', 'Digital caliper'],
    safetyNotes: 'Keep tape locked when not in use, avoid dropping',
    maintenanceTips: 'Clean tape regularly, replace if damaged, store properly',
    skillLevel: 'beginner',
    price: '$5-25',
    priceValue: 15,
    essential: true,
    popularity: 98,
    suppliers: ['Home Depot', 'Lowes', 'Walmart', 'Amazon'],
  },
  {
    id: '4',
    name: 'Safety Glasses',
    type: 'safety',
    category: 'Protection',
    description: 'Eye protection for all woodworking activities',
    alternatives: ['Face shield', 'Goggles'],
    safetyNotes: 'Wear at all times, replace if scratched or damaged',
    maintenanceTips: 'Clean lenses regularly, store in protective case',
    skillLevel: 'beginner',
    price: '$5-20',
    priceValue: 12.5,
    essential: true,
    popularity: 92,
    suppliers: ['Home Depot', 'Lowes', 'Safety supply stores', 'Amazon'],
  },
];

// Sample material database with enhanced data
const materialsDatabase: Material[] = [
  {
    id: '1',
    name: 'Oak',
    type: 'wood',
    category: 'Hardwood',
    description: 'Strong, durable hardwood with beautiful grain patterns',
    properties: ['Hard', 'Durable', 'Beautiful grain', 'Takes finish well'],
    alternatives: ['Maple', 'Cherry', 'Walnut', 'Ash'],
    careTips: 'Store in dry place, acclimate before use, seal end grain',
    compatibility: ['All finishes', 'All joinery methods', 'Indoor use'],
    price: '$4-8/bf',
    priceValue: 6,
    availability: 'common',
    suppliers: ['Local lumber yards', 'Home Depot', 'Woodcraft', 'Online lumber suppliers'],
    substitutes: ['Maple', 'Cherry', 'Walnut', 'Ash', 'Hickory'],
  },
  {
    id: '2',
    name: 'Pine',
    type: 'wood',
    category: 'Softwood',
    description: 'Affordable, easy-to-work softwood for beginners',
    properties: ['Soft', 'Easy to work', 'Affordable', 'Light color'],
    alternatives: ['Cedar', 'Fir', 'Spruce'],
    careTips: 'Handle carefully to avoid dents, sand thoroughly, use pre-stain conditioner',
    compatibility: ['Paint', 'Stain', 'Simple joinery'],
    price: '$1-3/bf',
    priceValue: 2,
    availability: 'common',
    suppliers: ['Home Depot', 'Lowes', 'Local lumber yards', 'Online lumber suppliers'],
    substitutes: ['Cedar', 'Fir', 'Spruce', 'Poplar', 'Basswood'],
  },
  {
    id: '3',
    name: 'Wood Glue',
    type: 'adhesive',
    category: 'Bonding',
    description: 'Strong adhesive for wood-to-wood bonds',
    properties: ['Strong bond', 'Easy to use', 'Water-based', 'Non-toxic'],
    alternatives: ['Epoxy', 'Hide glue', 'CA glue'],
    careTips: 'Store in cool place, check expiration date, clean surfaces before use',
    compatibility: ['All wood types', 'Most finishes'],
    price: '$5-15',
    priceValue: 10,
    availability: 'common',
    suppliers: ['Home Depot', 'Lowes', 'Woodcraft', 'Amazon', 'Local hardware stores'],
    substitutes: ['Epoxy', 'Hide glue', 'CA glue', 'PVA glue', 'Contact cement'],
  },
  {
    id: '4',
    name: 'Polyurethane',
    type: 'finish',
    category: 'Protective',
    description: 'Durable protective finish for wood surfaces',
    properties: ['Durable', 'Water-resistant', 'UV-resistant', 'Easy to clean'],
    alternatives: ['Shellac', 'Lacquer', 'Oil finish', 'Wax'],
    careTips: 'Apply in thin coats, sand between coats, allow full cure time',
    compatibility: ['All wood types', 'Indoor use'],
    price: '$10-25',
    priceValue: 17.5,
    availability: 'common',
    suppliers: ['Home Depot', 'Lowes', 'Woodcraft', 'Amazon', 'Local paint stores'],
    substitutes: ['Shellac', 'Lacquer', 'Oil finish', 'Wax', 'Varnish', 'Danish oil'],
  },
];

export default function ToolMaterialLibrary({ onSelectTool, onSelectMaterial }: ToolMaterialLibraryProps) {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'tools' | 'materials'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Tool | Material | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [ownedItems, setOwnedItems] = useState<Set<string>>(new Set());
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

    // Load data from Firestore and saved preferences
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tools and materials from Firestore
        const [firestoreTools, firestoreMaterials] = await Promise.all([
          getTools(),
          getMaterials()
        ]);
        
        setTools(firestoreTools || []);
        setMaterials(firestoreMaterials || []);
        
        // Load saved preferences from storage
        const ownedTools = await toolMaterialService.getOwnedTools();
        const wishlistedTools = await toolMaterialService.getWishlistedTools();
        const ownedMaterials = await toolMaterialService.getOwnedMaterials();
        const wishlistedMaterials = await toolMaterialService.getWishlistedMaterials();
        
        setOwnedItems(new Set([...ownedTools, ...ownedMaterials]));
        setWishlistItems(new Set([...wishlistedTools, ...wishlistedMaterials]));
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to static data if Firestore fails
        setTools(toolsDatabase);
        setMaterials(materialsDatabase);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleOwned = async (itemId: string) => {
    try {
      const isOwned = await toolMaterialService.toggleToolOwned(itemId);
      const newOwned = new Set(ownedItems);
      
      if (isOwned) {
        newOwned.add(itemId);
      } else {
        newOwned.delete(itemId);
      }
      
      setOwnedItems(newOwned);
    } catch (error) {
      console.error('Error toggling owned status:', error);
      Alert.alert('Error', 'Failed to update owned status');
    }
  };

  const toggleWishlist = async (itemId: string) => {
    try {
      const isWishlisted = await toolMaterialService.toggleToolWishlist(itemId);
      const newWishlist = new Set(wishlistItems);
      
      if (isWishlisted) {
        newWishlist.add(itemId);
      } else {
        newWishlist.delete(itemId);
      }
      
      setWishlistItems(newWishlist);
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
      Alert.alert('Error', 'Failed to update wishlist status');
    }
  };

  const handleItemPress = (item: Tool | Material) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const sortItems = <T extends Tool | Material>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.priceValue - b.priceValue;
          break;
        case 'popularity':
          if ('popularity' in a && 'popularity' in b) {
            comparison = (a as Tool).popularity - (b as Tool).popularity;
          }
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filterAndSortItems = <T extends Tool | Material>(items: T[]): T[] => {
    let filtered = items.filter(item => 
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply owned/wishlist filters
    if (showOwnedOnly) {
      filtered = filtered.filter(item => ownedItems.has(item.id));
    }
    if (showWishlistOnly) {
      filtered = filtered.filter(item => wishlistItems.has(item.id));
    }

    return sortItems(filtered);
  };

  const filteredTools = filterAndSortItems(tools);
  const filteredMaterials = filterAndSortItems(materials);

  const getToolCategories = () => {
    const categories = ['all', ...new Set(tools.map(tool => tool.category))];
    return categories;
  };

  const getMaterialCategories = () => {
    const categories = ['all', ...new Set(materials.map(material => material.category))];
    return categories;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hand': return 'hand.raised.fill';
      case 'power': return 'bolt.fill';
      case 'measuring': return 'ruler.fill';
      case 'safety': return 'shield.fill';
      case 'wood': return 'leaf.fill';
      case 'hardware': return 'wrench.fill';
      case 'finish': return 'paintbrush.fill';
      case 'adhesive': return 'drop.fill';
      default: return 'questionmark.circle.fill';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hand': return '#4ECDC4';
      case 'power': return '#FF6B6B';
      case 'measuring': return '#45B7D1';
      case 'safety': return '#96CEB4';
      case 'wood': return '#8B4513';
      case 'hardware': return '#FF9800';
      case 'finish': return '#9C27B0';
      case 'adhesive': return '#607D8B';
      default: return Colors[colorScheme ?? 'light'].primary;
    }
  };

  const renderToolItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: getTypeColor(item.type) }]}>
          <IconSymbol name={getTypeIcon(item.type) as any} size={20} color="white" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemCategory, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.itemMeta}>
          {item.essential && (
            <View style={[styles.essentialBadge, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
              <Text style={styles.essentialText}>Essential</Text>
            </View>
          )}
          <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].primary }]}>
            {item.price}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.itemDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
        {item.description}
      </Text>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[
            styles.actionChip,
            ownedItems.has(item.id) && { backgroundColor: Colors[colorScheme ?? 'light'].success }
          ]}
          onPress={() => toggleOwned(item.id)}
        >
          <IconSymbol 
            name={ownedItems.has(item.id) ? "checkmark.circle.fill" : "plus.circle"} 
            size={16} 
            color={ownedItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.actionChipText,
            { color: ownedItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            {ownedItems.has(item.id) ? 'Owned' : 'Own'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionChip,
            wishlistItems.has(item.id) && { backgroundColor: Colors[colorScheme ?? 'light'].primary }
          ]}
          onPress={() => toggleWishlist(item.id)}
        >
          <IconSymbol 
            name={wishlistItems.has(item.id) ? "heart.fill" : "heart"} 
            size={16} 
            color={wishlistItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.actionChipText,
            { color: wishlistItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            {wishlistItems.has(item.id) ? 'Wishlist' : 'Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemHeader}>
        <View style={[styles.itemIcon, { backgroundColor: getTypeColor(item.type) }]}>
          <IconSymbol name={getTypeIcon(item.type) as any} size={20} color="white" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: Colors[colorScheme ?? 'light'].text }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemCategory, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            {item.category}
          </Text>
        </View>
        <View style={styles.itemMeta}>
          <View style={[styles.availabilityBadge, { 
            backgroundColor: item.availability === 'common' ? Colors[colorScheme ?? 'light'].success : 
                         item.availability === 'specialty' ? Colors[colorScheme ?? 'light'].trophy : 
                         Colors[colorScheme ?? 'light'].error 
          }]}>
            <Text style={styles.availabilityText}>{item.availability}</Text>
          </View>
          <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].primary }]}>
            {item.price}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.itemDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
        {item.description}
      </Text>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[
            styles.actionChip,
            ownedItems.has(item.id) && { backgroundColor: Colors[colorScheme ?? 'light'].success }
          ]}
          onPress={() => toggleOwned(item.id)}
        >
          <IconSymbol 
            name={ownedItems.has(item.id) ? "checkmark.circle.fill" : "plus.circle"} 
            size={16} 
            color={ownedItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.actionChipText,
            { color: ownedItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            {ownedItems.has(item.id) ? 'Owned' : 'Own'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionChip,
            wishlistItems.has(item.id) && { backgroundColor: Colors[colorScheme ?? 'light'].primary }
          ]}
          onPress={() => toggleWishlist(item.id)}
        >
          <IconSymbol 
            name={wishlistItems.has(item.id) ? "heart.fill" : "heart"} 
            size={16} 
            color={wishlistItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.actionChipText,
            { color: wishlistItems.has(item.id) ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            {wishlistItems.has(item.id) ? 'Wishlist' : 'Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDetailView = () => {
    if (!selectedItem) return null;

    const isTool = 'type' in selectedItem && ['hand', 'power', 'measuring', 'safety'].includes(selectedItem.type);
    const item = selectedItem as Tool | Material;

    return (
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <BlurView 
          intensity={20}
          style={styles.modalBackdrop}
        >
          <Pressable 
            style={styles.modalBackdropOverlay} 
            onPress={() => setShowDetailModal(false)}
          >
            <View style={[styles.detailModal, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
              {/* Close button at top right */}
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowDetailModal(false)}
              >
                <IconSymbol name="xmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
              </TouchableOpacity>
              
              <ScrollView style={styles.detailModalContent} showsVerticalScrollIndicator={false}>
                <View style={styles.detailContainer}>
                  <View style={styles.detailHeader}>
                    <View style={[styles.detailIcon, { backgroundColor: getTypeColor(item.type) }]}>
                      <IconSymbol name={getTypeIcon(item.type) as any} size={32} color="white" />
                    </View>
                    <View style={styles.detailInfo}>
                      <Text style={[styles.detailName, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.detailCategory, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                        {item.category}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.detailDescription, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {item.description}
                  </Text>

                  {isTool && (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Safety Notes
                        </Text>
                        <Text style={[styles.sectionText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                          {(item as Tool).safetyNotes}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Maintenance Tips
                        </Text>
                        <Text style={[styles.sectionText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                          {(item as Tool).maintenanceTips}
                        </Text>
                      </View>
                    </>
                  )}

                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                      Alternatives
                    </Text>
                    <View style={styles.alternativesList}>
                      {item.alternatives.map((alt, index) => (
                        <View key={index} style={[styles.alternativeItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
                          <Text style={[styles.alternativeText, { color: Colors[colorScheme ?? 'light'].text }]}>
                            {alt}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {!isTool && (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Properties
                        </Text>
                        <View style={styles.propertiesList}>
                          {(item as Material).properties.map((prop, index) => (
                            <View key={index} style={[styles.propertyItem, { backgroundColor: Colors[colorScheme ?? 'light'].primary + '20' }]}>
                              <Text style={[styles.propertyText, { color: Colors[colorScheme ?? 'light'].primary }]}>
                                {prop}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Care Tips
                        </Text>
                        <Text style={[styles.sectionText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                          {(item as Material).careTips}
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Suppliers
                        </Text>
                        <View style={styles.suppliersList}>
                          {(item as Material).suppliers.map((supplier, index) => (
                            <View key={index} style={[styles.supplierItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
                              <Text style={[styles.supplierText, { color: Colors[colorScheme ?? 'light'].text }]}>
                                {supplier}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                          Recommended Substitutes
                        </Text>
                        <View style={styles.substitutesList}>
                          {(item as Material).substitutes.map((substitute, index) => (
                            <View key={index} style={[styles.substituteItem, { backgroundColor: Colors[colorScheme ?? 'light'].primary + '20' }]}>
                              <Text style={[styles.substituteText, { color: Colors[colorScheme ?? 'light'].primary }]}>
                                {substitute}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </>
                  )}

                  <View style={styles.detailActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
                      onPress={() => {
                        if (isTool) {
                          onSelectTool?.(item as Tool);
                        } else {
                          onSelectMaterial?.(item as Material);
                        }
                        setShowDetailModal(false);
                      }}
                    >
                      <IconSymbol name="plus" size={20} color="white" />
                      <Text style={styles.actionButtonText}>
                        {isTool ? 'Add to Toolbox' : 'Add to Materials'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </BlurView>
      </Modal>
    );
  };

  const renderFiltersSection = () => (
    <View style={styles.filtersSection}>
      {/* Compact Filter Bar */}
      <View style={styles.compactFilterBar}>
        <View style={styles.activeFilters}>
          {selectedCategory !== 'all' && (
            <View style={[styles.activeFilterChip, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
              <Text style={styles.activeFilterChipText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('all')}>
                <IconSymbol name="xmark.circle.fill" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
          {showOwnedOnly && (
            <View style={[styles.activeFilterChip, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
              <Text style={styles.activeFilterChipText}>Owned</Text>
              <TouchableOpacity onPress={() => setShowOwnedOnly(false)}>
                <IconSymbol name="xmark.circle.fill" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
          {showWishlistOnly && (
            <View style={[styles.activeFilterChip, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
              <Text style={styles.activeFilterChipText}>Wishlist</Text>
              <TouchableOpacity onPress={() => setShowWishlistOnly(false)}>
                <IconSymbol name="xmark.circle.fill" size={16} color="white" />
              </TouchableOpacity>
            </View>
          )}
          <Text style={[styles.sortIndicator, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Sorted by {sortBy} ({sortOrder === 'asc' ? 'A→Z' : 'Z→A'})
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.filtersButton, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
          onPress={() => setShowFiltersModal(true)}
        >
          <IconSymbol name="slider.horizontal.3" size={20} color={Colors[colorScheme ?? 'light'].text} />
          <Text style={[styles.filtersButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filters
          </Text>
        </TouchableOpacity>
      </View>


    </View>
  );

  const renderFiltersModal = () => (
    <Modal
      visible={showFiltersModal}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={[styles.modalContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowFiltersModal(false)}
            style={styles.closeButton}
          >
            <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Filters & Sorting
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Sorting Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Sort By
            </Text>
            <View style={styles.sortingOptions}>
              {['name', 'price', 'popularity'].map(sortOption => (
                <TouchableOpacity
                  key={sortOption}
                  style={[
                    styles.sortingChip,
                    sortBy === sortOption 
                      ? { 
                          backgroundColor: Colors[colorScheme ?? 'light'].primary,
                          borderColor: Colors[colorScheme ?? 'light'].primary,
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 4,
                        }
                      : { 
                          backgroundColor: Colors[colorScheme ?? 'light'].background,
                          borderColor: Colors[colorScheme ?? 'light'].border,
                        }
                  ]}
                  onPress={() => setSortBy(sortOption as 'name' | 'price' | 'popularity')}
                >
                  <Text style={[
                    styles.sortingChipText,
                    { 
                      color: sortBy === sortOption 
                        ? 'white' 
                        : Colors[colorScheme ?? 'light'].text 
                    }
                  ]}>
                    {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={[styles.sortOrderButton, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
              onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <IconSymbol 
                name={sortOrder === 'asc' ? 'arrow.up' : 'arrow.down'} 
                size={20} 
                color={Colors[colorScheme ?? 'light'].text} 
              />
              <Text style={[styles.sortOrderText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Filters
            </Text>
            
            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterToggle,
                  showOwnedOnly 
                    ? { 
                        backgroundColor: Colors[colorScheme ?? 'light'].success,
                        borderColor: Colors[colorScheme ?? 'light'].success,
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                      }
                    : { 
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        borderColor: Colors[colorScheme ?? 'light'].border,
                      }
                ]}
                onPress={() => {
                  setShowOwnedOnly(!showOwnedOnly);
                  if (showOwnedOnly) setShowWishlistOnly(false);
                }}
              >
                <IconSymbol 
                  name="checkmark.circle.fill" 
                  size={20} 
                  color={showOwnedOnly ? 'white' : Colors[colorScheme ?? 'light'].text} 
                />
                <Text style={[
                  styles.filterToggleText,
                  { color: showOwnedOnly ? 'white' : Colors[colorScheme ?? 'light'].text }
                ]}>
                  Show Owned Only
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterToggle,
                  showWishlistOnly 
                    ? { 
                        backgroundColor: Colors[colorScheme ?? 'light'].primary,
                        borderColor: Colors[colorScheme ?? 'light'].primary,
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                      }
                    : { 
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        borderColor: Colors[colorScheme ?? 'light'].border,
                      }
                ]}
                onPress={() => {
                  setShowWishlistOnly(!showWishlistOnly);
                  if (showWishlistOnly) setShowOwnedOnly(false);
                }}
              >
                <IconSymbol 
                  name="heart.fill" 
                  size={20} 
                  color={showWishlistOnly ? 'white' : Colors[colorScheme ?? 'light'].text} 
                />
                <Text style={[
                  styles.filterToggleText,
                  { color: showWishlistOnly ? 'white' : Colors[colorScheme ?? 'light'].text }
                ]}>
                  Show Wishlist Only
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories Section */}
          <View style={styles.modalSection}>
            <Text style={[styles.modalSectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Categories
            </Text>
            <View style={styles.categoriesGrid}>
              {(activeTab === 'tools' ? getToolCategories() : getMaterialCategories()).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChipLarge,
                    selectedCategory === category 
                      ? { 
                          backgroundColor: Colors[colorScheme ?? 'light'].primary,
                          borderColor: Colors[colorScheme ?? 'light'].primary,
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 4,
                        }
                      : { 
                          backgroundColor: Colors[colorScheme ?? 'light'].background,
                          borderColor: Colors[colorScheme ?? 'light'].border,
                        }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipTextLarge,
                    { color: selectedCategory === category ? 'white' : Colors[colorScheme ?? 'light'].text }
                  ]}>
                    {category === 'all' ? 'All' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => setShowFiltersModal(false)}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading tools and materials...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Tool & Material Library
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Comprehensive database with alternatives, care tips, and supplier information
        </Text>
      </View>

      {/* Enhanced Tab Switching with Segmented Controls */}
      <View style={[styles.segmentedContainer, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
        <TouchableOpacity
          style={[
            styles.segmentedTab,
            activeTab === 'tools' && { 
              backgroundColor: Colors[colorScheme ?? 'light'].primary,
              shadowColor: Colors[colorScheme ?? 'light'].primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }
          ]}
          onPress={() => setActiveTab('tools')}
        >
          <IconSymbol 
            name="wrench.and.screwdriver.fill" 
            size={20} 
            color={activeTab === 'tools' ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.segmentedTabText,
            { color: activeTab === 'tools' ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            Tools
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.segmentedTab,
            activeTab === 'materials' && { 
              backgroundColor: Colors[colorScheme ?? 'light'].primary,
              shadowColor: Colors[colorScheme ?? 'light'].primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }
          ]}
          onPress={() => setActiveTab('materials')}
        >
          <IconSymbol 
            name="leaf.fill" 
            size={20} 
            color={activeTab === 'materials' ? 'white' : Colors[colorScheme ?? 'light'].text} 
          />
          <Text style={[
            styles.segmentedTabText,
            { color: activeTab === 'materials' ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            Materials
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].border 
          }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search ${activeTab}...`}
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        />
      </View>

      {/* Compact Filters Section */}
      {renderFiltersSection()}

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'tools' ? (
          <View style={styles.listContainer}>
            {filteredTools.map((item) => (
              <View key={item.id}>
                {renderToolItem({ item })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredMaterials.map((item) => (
              <View key={item.id}>
                {renderMaterialItem({ item })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      {selectedItem && showDetailModal && renderDetailView()}

      {/* Filters Modal */}
      {renderFiltersModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    // lineHeight: 22,
  },
  // Enhanced segmented controls
  segmentedContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentedTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 3,
  },
  segmentedTabText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  // Search container
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },

  // Item cards
  itemCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666',
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  essentialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  essentialText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  availabilityText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    marginBottom: 12,
  },
  // Item actions
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  actionChipText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 4,
  },
  // Detail view
  detailContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  detailCategory: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#666',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  detailDescription: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
  },
  alternativesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alternativeItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  alternativeText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  propertiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  propertyText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  // New sections for materials
  suppliersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplierItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  supplierText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  substitutesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  substituteItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  substituteText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  detailActions: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
  // New styles for filters section
  filtersSection: {
    // marginBottom: 10,
  },
  compactFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  activeFilterChipText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    color: 'white',
    marginRight: 4,
  },
  sortIndicator: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 10,
  },
  filtersButtonText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  quickCategories: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  expandButtonText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  // New styles for modal
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
  },
  modalContent: {
    flex: 1,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
  },
  sortingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortingChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sortingChipText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    textTransform: 'capitalize',
  },
  sortOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor:"gray",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    
  },
  sortOrderText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  filterOption: {
    marginBottom: 12,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterToggleText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChipLarge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryChipTextLarge: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
  },
  modalFooter: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  listContainer: {
    paddingTop: 5,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdropOverlay: {
    width: Dimensions.get('window').width,
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailModal: {
  
    width: '100%',
    alignSelf: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 0.95 }],
  },
  detailModalContent: {
    // flex: 1,
  },
});
