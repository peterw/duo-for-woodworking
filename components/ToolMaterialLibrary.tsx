import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
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
  essential: boolean;
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
  availability: 'common' | 'specialty' | 'rare';
}

interface ToolMaterialLibraryProps {
  onSelectTool?: (tool: Tool) => void;
  onSelectMaterial?: (material: Material) => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Sample tool database
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
    essential: true,
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
    essential: false,
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
    essential: true,
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
    essential: true,
  },
];

// Sample material database
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
    availability: 'common',
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
    availability: 'common',
  },
  {
    id: '3',
    name: 'Wood Glue',
    type: 'adhesive',
    category: 'Bonding',
    description: 'Strong adhesive for wood-to-wood bonds',
    alternatives: ['Epoxy', 'Hide glue', 'CA glue'],
    careTips: 'Store in cool place, check expiration date, clean surfaces before use',
    compatibility: ['All wood types', 'Most finishes'],
    price: '$5-15',
    availability: 'common',
  },
  {
    id: '4',
    name: 'Polyurethane',
    type: 'finish',
    category: 'Protective',
    description: 'Durable protective finish for wood surfaces',
    alternatives: ['Shellac', 'Lacquer', 'Oil finish', 'Wax'],
    careTips: 'Apply in thin coats, sand between coats, allow full cure time',
    compatibility: ['All wood types', 'Indoor use'],
    price: '$10-25',
    availability: 'common',
  },
];

export default function ToolMaterialLibrary({ onSelectTool, onSelectMaterial }: ToolMaterialLibraryProps) {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = useState<'tools' | 'materials'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Tool | Material | null>(null);

  const tools = toolsDatabase.filter(tool => 
    (selectedCategory === 'all' || tool.category === selectedCategory) &&
    (searchQuery === '' || tool.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const materials = materialsDatabase.filter(material => 
    (selectedCategory === 'all' || material.category === selectedCategory) &&
    (searchQuery === '' || material.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getToolCategories = () => {
    const categories = ['all', ...new Set(toolsDatabase.map(tool => tool.category))];
    return categories;
  };

  const getMaterialCategories = () => {
    const categories = ['all', ...new Set(materialsDatabase.map(material => material.category))];
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
      default: return Colors[colorScheme ?? 'light'].tint;
    }
  };

  const renderToolItem = ({ item }: { item: Tool }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => setSelectedItem(item)}
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
          <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {item.price}
          </Text>
        </View>
      </View>
      <Text style={[styles.itemDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const renderMaterialItem = ({ item }: { item: Material }) => (
    <TouchableOpacity
      style={[styles.itemCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      onPress={() => setSelectedItem(item)}
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
                         item.availability === 'specialty' ? Colors[colorScheme ?? 'light'].warning : 
                         Colors[colorScheme ?? 'light'].error 
          }]}>
            <Text style={styles.availabilityText}>{item.availability}</Text>
          </View>
          <Text style={[styles.itemPrice, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {item.price}
          </Text>
        </View>
      </View>
      <Text style={[styles.itemDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const renderDetailView = () => {
    if (!selectedItem) return null;

    const isTool = 'type' in selectedItem && ['hand', 'power', 'measuring', 'safety'].includes(selectedItem.type);
    const item = selectedItem as Tool | Material;

    return (
      <View style={[styles.detailContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
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
          <TouchableOpacity
            onPress={() => setSelectedItem(null)}
            style={styles.closeButton}
          >
            <IconSymbol name="xmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          </TouchableOpacity>
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
                  <View key={index} style={[styles.propertyItem, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
                    <Text style={[styles.propertyText, { color: Colors[colorScheme ?? 'light'].tint }]}>
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
          </>
        )}

        <View style={styles.detailActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={() => {
              if (isTool) {
                onSelectTool?.(item as Tool);
              } else {
                onSelectMaterial?.(item as Material);
              }
              setSelectedItem(null);
            }}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <Text style={styles.actionButtonText}>
              {isTool ? 'Add to Toolbox' : 'Add to Materials'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Tool & Material Library
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Comprehensive database with alternatives and care tips
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'tools' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setActiveTab('tools')}
        >
          <IconSymbol name="wrench.and.screwdriver.fill" size={20} color={activeTab === 'tools' ? 'white' : Colors[colorScheme ?? 'light'].text} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'tools' ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            Tools
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'materials' && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
          ]}
          onPress={() => setActiveTab('materials')}
        >
          <IconSymbol name="leaf.fill" size={20} color={activeTab === 'materials' ? 'white' : Colors[colorScheme ?? 'light'].text} />
          <Text style={[
            styles.tabText,
            { color: activeTab === 'materials' ? 'white' : Colors[colorScheme ?? 'light'].text }
          ]}>
            Materials
          </Text>
        </TouchableOpacity>
      </View>

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

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(activeTab === 'tools' ? getToolCategories() : getMaterialCategories()).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && { backgroundColor: Colors[colorScheme ?? 'light'].tint }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategory === category ? 'white' : Colors[colorScheme ?? 'light'].text }
              ]}>
                {category === 'all' ? 'All' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderDetailView()}

      <FlatList
        data={activeTab === 'tools' ? tools : materials}
        renderItem={activeTab === 'tools' ? renderToolItem : renderMaterialItem}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
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
  categoriesContainer: {
    marginBottom: 20,
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
    fontWeight: '500',
  },
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
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
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
    fontWeight: '600',
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
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
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
    fontWeight: '700',
    marginBottom: 4,
  },
  detailCategory: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    padding: 4,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
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
    fontWeight: '500',
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
    fontWeight: '500',
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
    fontWeight: '600',
    marginLeft: 8,
  },
  list: {
    flex: 1,
  },
});
