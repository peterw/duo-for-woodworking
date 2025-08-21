import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
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
  stockUsed: number;
  remainingStock: number;
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [newStockIds, setNewStockIds] = useState<Set<string>>(new Set());
  const animatedValues = useRef<{[key: string]: Animated.Value}>({});

  const validateInputs = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate kerf
    const kerfValue = parseFloat(kerf);
    if (isNaN(kerfValue) || kerfValue < 0) {
      errors.kerf = 'Kerf must be a positive number';
    }
    
    // Validate stock lengths
    stockLengths.forEach((stock, index) => {
      if (stock.length <= 0) {
        errors[`stock_${index}_length`] = 'Length must be greater than 0';
      }
      if (stock.quantity <= 0) {
        errors[`stock_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (stock.cost < 0) {
        errors[`stock_${index}_cost`] = 'Cost cannot be negative';
      }
    });
    
    // Validate cut list
    if (cutList.length === 0) {
      errors.cutList = 'No cuts to optimize';
    }
    
    cutList.forEach((cut, index) => {
      if (cut.dimensions.length <= 0) {
        errors[`cut_${index}_length`] = 'Cut length must be greater than 0';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addStockLength = () => {
    const newStock: StockLength = {
      id: Date.now().toString(),
      length: 96,
      quantity: 1,
      cost: 10.00,
    };
    
    // Add to new stock IDs for animation
    setNewStockIds(prev => new Set([...prev, newStock.id]));
    
    // Initialize animated value for the new stock
    animatedValues.current[newStock.id] = new Animated.Value(0);
    
    setStockLengths([newStock, ...stockLengths]);
    
    // Clear validation errors when adding new stock
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('stock_')) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };

  const updateStockLength = (id: string, field: keyof StockLength, value: string | number) => {
    setStockLengths(prev => prev.map(stock => 
      stock.id === id ? { ...stock, [field]: value } : stock
    ));
    
    // Clear validation error for this field
    const stockIndex = stockLengths.findIndex(s => s.id === id);
    if (stockIndex !== -1) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`stock_${stockIndex}_${field}`];
        return newErrors;
      });
    }
  };

  const removeStockLength = (id: string) => {
    if (stockLengths.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one stock length available.');
      return;
    }
    
    // Animate out before removing
    if (animatedValues.current[id]) {
      Animated.timing(animatedValues.current[id], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStockLengths(prev => prev.filter(stock => stock.id !== id));
        // Clean up animated value
        delete animatedValues.current[id];
      });
    } else {
      setStockLengths(prev => prev.filter(stock => stock.id !== id));
    }
  };

  const getValidationError = (field: string): string | null => {
    return validationErrors[field] || null;
  };

  // Animate new stock lengths when they're added
  useEffect(() => {
    newStockIds.forEach(stockId => {
      if (animatedValues.current[stockId]) {
        // Spring animation: scale from 0 to 1 with gentle bounce effect
        Animated.spring(animatedValues.current[stockId], {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 12,
        }).start(() => {
          // Remove from new stock IDs after animation completes
          setNewStockIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(stockId);
            return newSet;
          });
        });
      }
    });
  }, [stockLengths, newStockIds]);

  const optimizeCutList = () => {
    if (!validateInputs()) {
      Alert.alert('Validation Error', 'Please fix the errors before optimizing.');
      return;
    }

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
            stockUsed: 0,
            remainingStock: bestStock.quantity,
          };
          results.push(existingGroup);
        }
        
        existingGroup.cuts.push(cut);
        existingGroup.waste += bestWaste;
        existingGroup.stockUsed++;
        existingGroup.remainingStock = bestStock.quantity - existingGroup.stockUsed;
        bestStock.quantity--;
        
        // Update cut with stock info
        cut.stockLength = bestStock.length;
        cut.waste = bestWaste;
      }
    }
    
    // Calculate efficiency for each group
    results.forEach(group => {
      const totalCutLength = group.cuts.reduce((sum, cut) => sum + cut.dimensions.length, 0);
      group.efficiency = (totalCutLength / (group.stockLength * group.stockUsed)) * 100;
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
      exportText += `Stock used: ${group.stockUsed} pieces\n`;
      group.cuts.forEach(cut => {
        exportText += `  ${cut.name}: ${cut.dimensions.length}" x ${cut.dimensions.width}" x ${cut.dimensions.thickness}"\n`;
      });
      exportText += `  Total waste: ${group.waste.toFixed(2)}"\n`;
    });
    
    // In a real app, you'd use a proper sharing mechanism
    Alert.alert('Export Complete', 'Cut list has been prepared for export. In a full app, this would open sharing options.');
  };

  const renderStockLengthEditor = (stock: StockLength, index: number) => {
    const lengthError = getValidationError(`stock_${index}_length`);
    const quantityError = getValidationError(`stock_${index}_quantity`);
    const costError = getValidationError(`stock_${index}_cost`);
    
    // Get or create animated value for this stock
    if (!animatedValues.current[stock.id]) {
      animatedValues.current[stock.id] = new Animated.Value(1);
    }
    
    const animatedStyle = {
      transform: [
        {
          scale: animatedValues.current[stock.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
        {
          translateY: animatedValues.current[stock.id].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
      opacity: animatedValues.current[stock.id].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };
    
    return (
      <Animated.View 
        key={stock.id} 
        style={[
          styles.stockCard, 
          { backgroundColor: Colors[colorScheme ?? 'light'].background },
          animatedStyle
        ]}
      >
        <View style={styles.stockHeader}>
          <Text style={[styles.stockTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Stock Length {stock.length}"
          </Text>
          <TouchableOpacity
            onPress={() => removeStockLength(stock.id)}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <IconSymbol name="minus.circle.fill" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.stockInputs}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Length (inch)</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: lengthError ? '#FF6B6B' : Colors[colorScheme ?? 'light'].border 
                }
              ]}
              value={stock.length.toString()}
              onChangeText={(text) => updateStockLength(stock.id, 'length', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="96"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            {lengthError && (
              <Text style={styles.errorText}>{lengthError}</Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Quantity</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: quantityError ? '#FF6B6B' : Colors[colorScheme ?? 'light'].border 
                }
              ]}
              value={stock.quantity.toString()}
              onChangeText={(text) => updateStockLength(stock.id, 'quantity', parseInt(text) || 0)}
              keyboardType="numeric"
              placeholder="10"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            {quantityError && (
              <Text style={styles.errorText}>{quantityError}</Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Cost ($)</Text>
            <TextInput
              style={[
                styles.textInput, 
                { 
                  backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: costError ? '#FF6B6B' : Colors[colorScheme ?? 'light'].border 
                }
              ]}
              value={stock.cost.toString()}
              onChangeText={(text) => updateStockLength(stock.id, 'cost', parseFloat(text) || 0)}
              keyboardType="numeric"
              placeholder="12.99"
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            {costError && (
              <Text style={styles.errorText}>{costError}</Text>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderVisualCutBreakdown = (group: OptimizedCut) => {
    return (
      <View style={styles.visualBreakdown}>
        <Text style={[styles.breakdownTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Visual Cut Layout
        </Text>
        
        {Array.from({ length: group.stockUsed }, (_, stockIndex) => (
          <View key={stockIndex} style={styles.stockPiece}>
            <View style={styles.stockPieceHeader}>
              <Text style={[styles.stockPieceTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Stock Piece {stockIndex + 1} ({group.stockLength}")
              </Text>
            </View>
            
            <View style={styles.cutLayout}>
              {group.cuts
                .filter((_, cutIndex) => cutIndex >= stockIndex * Math.ceil(group.cuts.length / group.stockUsed))
                .slice(0, Math.ceil(group.cuts.length / group.stockUsed))
                .map((cut, cutIndex) => (
                  <View key={cutIndex} style={styles.cutVisual}>
                    <View 
                      style={[
                        styles.cutBar, 
                        { 
                          width: `${(cut.dimensions.length / group.stockLength) * 100}%`,
                          backgroundColor: Colors[colorScheme ?? 'light'].primary 
                        }
                      ]} 
                    />
                    <Text style={[styles.cutLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
                      {cut.name} ({cut.dimensions.length}")
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

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
              <View style={styles.groupMeta}>
                <View style={[styles.efficiencyBadge, { 
                  backgroundColor: group.efficiency > 80 ? '#4CAF50' : group.efficiency > 60 ? '#FF9800' : '#F44336' 
                }]}>
                  <Text style={styles.efficiencyText}>{group.efficiency.toFixed(1)}%</Text>
                </View>
                <Text style={[styles.stockUsedText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                  {group.stockUsed} of {group.stockUsed + group.remainingStock} pieces used
                </Text>
              </View>
            </View>
            
            {renderVisualCutBreakdown(group)}
            
            <View style={styles.cutsList}>
              <Text style={[styles.cutsListTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                Cuts on this stock:
              </Text>
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
            </View>
            
            <View style={styles.groupFooter}>
              <Text style={[styles.groupWaste, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Total waste: {group.waste.toFixed(2)}"
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.exportSection}>
          <TouchableOpacity
            style={[styles.exportButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
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
            style={[
              styles.textInput, 
              { 
                backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: getValidationError('kerf') ? '#FF6B6B' : Colors[colorScheme ?? 'light'].border 
              }
            ]}
            value={kerf}
            onChangeText={(text) => {
              setKerf(text);
              if (getValidationError('kerf')) {
                setValidationErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.kerf;
                  return newErrors;
                });
              }
            }}
            keyboardType="numeric"
            placeholder="0.125"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          {getValidationError('kerf') && (
            <Text style={styles.errorText}>{getValidationError('kerf')}</Text>
          )}
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
            style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={addStockLength}
          >
            <IconSymbol name="plus" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Stock</Text>
          </TouchableOpacity>
        </View>
        
        {stockLengths.map((stock, index) => renderStockLengthEditor(stock, index))}
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
          {getValidationError('cutList') && (
            <Text style={[styles.errorText, { textAlign: 'center' }]}>{getValidationError('cutList')}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.optimizeButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
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
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.featherBold,
    width: '65%',
    flexWrap:"wrap"
  },
  kerfContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
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
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
  },
  kerfNote: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontStyle: 'italic',
  },
  stockCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
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
    fontFamily: FontFamilies.featherBold,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 6,
  },
  cutListSummary: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.featherBold,
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
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
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
    fontFamily: FontFamilies.featherBold,
  },
  groupMeta: {
    alignItems: 'flex-end',
  },
  efficiencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  efficiencyText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  stockUsedText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  visualBreakdown: {
    marginBottom: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
  },
  stockPiece: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  stockPieceHeader: {
    marginBottom: 8,
  },
  stockPieceTitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  cutLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cutVisual: {
    alignItems: 'center',
    marginRight: 8,
  },
  cutBar: {
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  cutLabel: {
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
    maxWidth: 60,
  },
  cutsList: {
    marginBottom: 16,
  },
  cutsListTitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginBottom: 8,
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
    fontFamily: FontFamilies.dinRounded,
    flex: 2,
  },
  cutDimensions: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    flex: 2,
  },
  cutWaste: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.dinRounded,
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
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
});
