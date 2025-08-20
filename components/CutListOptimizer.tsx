import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CutListItem {
  id: string;
  name: string;
  quantity: number;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  material: string;
  grainDirection?: 'with' | 'against' | 'cross';
  notes?: string;
  isCut?: boolean;
  stockLength?: number;
  waste?: number;
}

interface StockLength {
  id: string;
  length: number;
  quantity: number;
  cost: number;
}

interface OptimizedCut {
  stockLength: number;
  cuts: CutListItem[];
  waste: number;
  efficiency: number;
}

interface CutListOptimizerProps {
  cutList: CutListItem[];
  onOptimize: (optimizedCuts: OptimizedCut[]) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function CutListOptimizer({ cutList, onOptimize }: CutListOptimizerProps) {
  const colorScheme = useColorScheme();
  const [stockLengths, setStockLengths] = useState<StockLength[]>([
    { id: '1', length: 96, quantity: 10, cost: 12.99 }, // 8ft
    { id: '2', length: 72, quantity: 8, cost: 9.99 },  // 6ft
    { id: '3', length: 48, quantity: 12, cost: 6.99 }, // 4ft
  ]);
  const [kerf, setKerf] = useState<string>('0.125'); // 1/8 inch default
  const [optimizedCuts, setOptimizedCuts] = useState<OptimizedCut[]>([]);
  const [showResults, setShowResults] = useState(false);

  const addStockLength = () => {
    const newStock: StockLength = {
      id: Date.now().toString(),
      length: 96,
      quantity: 1,
      cost: 10.00,
    };
    setStockLengths([...stockLengths, newStock]);
  };

  const updateStockLength = (id: string, field: keyof StockLength, value: string | number) => {
    setStockLengths(prev => prev.map(stock => 
      stock.id === id ? { ...stock, [field]: value } : stock
    ));
  };

  const removeStockLength = (id: string) => {
    setStockLengths(prev => prev.filter(stock => stock.id !== id));
  };

  const optimizeCutList = () => {
    const kerfValue = parseFloat(kerf) || 0.125;
    const results: OptimizedCut[] = [];
    
    // Sort cuts by length (longest first for better optimization)
    const sortedCuts = [...cutList].sort((a, b) => b.dimensions.length - a.dimensions.length);
    
    // Create a copy of stock lengths for tracking
    const availableStock = stockLengths.map(stock => ({ ...stock }));
    
    for (const cut of sortedCuts) {
      let bestStock: StockLength | null = null;
      let bestWaste = Infinity;
      
      // Find the best stock length for this cut
      for (const stock of availableStock) {
        if (stock.quantity > 0) {
          const waste = stock.length - cut.dimensions.length;
          if (waste >= 0 && waste < bestWaste) {
            bestStock = stock;
            bestWaste = waste;
          }
        }
      }
      
      if (bestStock) {
        // Find existing optimized cut group or create new one
        let existingGroup = results.find(group => group.stockLength === bestStock!.length);
        
        if (!existingGroup) {
          existingGroup = {
            stockLength: bestStock.length,
            cuts: [],
            waste: 0,
            efficiency: 0,
          };
          results.push(existingGroup);
        }
        
        existingGroup.cuts.push(cut);
        existingGroup.waste += bestWaste;
        bestStock.quantity--;
        
        // Update cut with stock info
        cut.stockLength = bestStock.length;
        cut.waste = bestWaste;
      }
    }
    
    // Calculate efficiency for each group
    results.forEach(group => {
      const totalCutLength = group.cuts.reduce((sum, cut) => sum + cut.dimensions.length, 0);
      group.efficiency = (totalCutLength / group.stockLength) * 100;
    });
    
    setOptimizedCuts(results);
    setShowResults(true);
    onOptimize(results);
  };

  const exportCutList = () => {
    let exportText = 'CUT LIST OPTIMIZATION REPORT\n';
    exportText += '============================\n\n';
    
    exportText += `Kerf: ${kerf}"\n\n`;
    
    exportText += 'STOCK REQUIREMENTS:\n';
    stockLengths.forEach(stock => {
      exportText += `${stock.length}" stock: ${stock.quantity} pieces @ $${stock.cost.toFixed(2)} each\n`;
    });
    
    exportText += '\nOPTIMIZED CUTS:\n';
    optimizedCuts.forEach((group, index) => {
      exportText += `\nGroup ${index + 1} - ${group.stockLength}" stock (${group.efficiency.toFixed(1)}% efficiency)\n`;
      group.cuts.forEach(cut => {
        exportText += `  ${cut.name}: ${cut.dimensions.length}" x ${cut.dimensions.width}" x ${cut.dimensions.thickness}"\n`;
      });
      exportText += `  Total waste: ${group.waste.toFixed(2)}"\n`;
    });
    
    // In a real app, you'd use a proper sharing mechanism
    Alert.alert('Export Complete', 'Cut list has been prepared for export. In a full app, this would open sharing options.');
  };

  const renderStockLengthEditor = (stock: StockLength) => (
    <View key={stock.id} style={[styles.stockCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.stockHeader}>
        <Text style={[styles.stockTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Stock Length {stock.length}"
        </Text>
        <TouchableOpacity
          onPress={() => removeStockLength(stock.id)}
          style={styles.removeButton}
        >
          <IconSymbol name="minus.circle.fill" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.stockInputs}>
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Length (inches)</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border 
            }]}
            value={stock.length.toString()}
            onChangeText={(text) => updateStockLength(stock.id, 'length', parseInt(text) || 0)}
            keyboardType="numeric"
            placeholder="96"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Quantity</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border 
            }]}
            value={stock.quantity.toString()}
            onChangeText={(text) => updateStockLength(stock.id, 'quantity', parseInt(text) || 0)}
            keyboardType="numeric"
            placeholder="10"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Cost ($)</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border 
            }]}
            value={stock.cost.toString()}
            onChangeText={(text) => updateStockLength(stock.id, 'cost', parseFloat(text) || 0)}
            keyboardType="numeric"
            placeholder="12.99"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
        </View>
      </View>
    </View>
  );

  const renderOptimizationResults = () => {
    if (!showResults || optimizedCuts.length === 0) return null;
    
    const totalWaste = optimizedCuts.reduce((sum, group) => sum + group.waste, 0);
    const totalCost = stockLengths.reduce((sum, stock) => sum + (stock.cost * stock.quantity), 0);
    const averageEfficiency = optimizedCuts.reduce((sum, group) => sum + group.efficiency, 0) / optimizedCuts.length;
    
    return (
      <View style={[styles.resultsContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <Text style={[styles.resultsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Optimization Results
        </Text>
        
        <View style={styles.resultsSummary}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>Total Waste</Text>
            <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              {totalWaste.toFixed(2)}"
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>Total Cost</Text>
            <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              ${totalCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>Efficiency</Text>
            <Text style={[styles.summaryValue, { color: Colors[colorScheme ?? 'light'].text }]}>
              {averageEfficiency.toFixed(1)}%
            </Text>
          </View>
        </View>
        
        {optimizedCuts.map((group, index) => (
          <View key={index} style={styles.optimizedGroup}>
            <View style={styles.groupHeader}>
              <Text style={[styles.groupTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                {group.stockLength}" Stock
              </Text>
              <View style={[styles.efficiencyBadge, { 
                backgroundColor: group.efficiency > 80 ? '#4CAF50' : group.efficiency > 60 ? '#FF9800' : '#F44336' 
              }]}>
                <Text style={styles.efficiencyText}>{group.efficiency.toFixed(1)}%</Text>
              </View>
            </View>
            
            {group.cuts.map((cut, cutIndex) => (
              <View key={cutIndex} style={styles.cutItem}>
                <Text style={[styles.cutName, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {cut.name}
                </Text>
                <Text style={[styles.cutDimensions, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  {cut.dimensions.length}" × {cut.dimensions.width}" × {cut.dimensions.thickness}"
                </Text>
                <Text style={[styles.cutWaste, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  Waste: {cut.waste?.toFixed(2)}"
                </Text>
              </View>
            ))}
            
            <View style={styles.groupFooter}>
              <Text style={[styles.groupWaste, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Total waste: {group.waste.toFixed(2)}"
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.exportSection}>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={exportCutList}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color="white" />
            <Text style={styles.exportButtonText}>Export Cut List</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Cut List Optimizer
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Optimize your cuts to minimize waste and cost
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Kerf Settings
        </Text>
        <View style={styles.kerfContainer}>
          <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
            Saw Kerf Width (inches)
          </Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border 
            }]}
            value={kerf}
            onChangeText={setKerf}
            keyboardType="numeric"
            placeholder="0.125"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <Text style={[styles.kerfNote, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Typical table saw kerf: 0.125" (1/8")
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Available Stock Lengths
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={addStockLength}
          >
            <IconSymbol name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        {stockLengths.map(renderStockLengthEditor)}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Cut List Summary
        </Text>
        <View style={[styles.cutListSummary, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
          <Text style={[styles.summaryText, { color: Colors[colorScheme ?? 'light'].text }]}>
            {cutList.length} cuts to optimize
          </Text>
          <Text style={[styles.summaryText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Total cut length: {cutList.reduce((sum, cut) => sum + cut.dimensions.length, 0)}"
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.optimizeButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={optimizeCutList}
      >
        <IconSymbol name="wand.and.stars" size={20} color="white" />
        <Text style={styles.optimizeButtonText}>Optimize Cut List</Text>
      </TouchableOpacity>

      {renderOptimizationResults()}
    </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  kerfContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  kerfNote: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  stockCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  stockInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cutListSummary: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  optimizeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  optimizedGroup: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  efficiencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  efficiencyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cutName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 2,
  },
  cutDimensions: {
    fontSize: 14,
    flex: 2,
  },
  cutWaste: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  groupFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  groupWaste: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  exportSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
