import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ToolMaterialLibrary from './ToolMaterialLibrary';

export default function ToolMaterialLibraryDemo() {
  const colorScheme = useColorScheme();
  const [showLibrary, setShowLibrary] = useState(false);

  const handleToolSelect = (tool: any) => {
    console.log('Selected tool:', tool);
    // Handle tool selection
  };

  const handleMaterialSelect = (material: any) => {
    console.log('Selected material:', material);
    // Handle material selection
  };

  return (
    <View style={styles.container}>
      {!showLibrary ? (
        <View style={styles.demoContainer}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Tool & Material Library Demo
          </Text>
          
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Enhanced features showcase
          </Text>

          <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
            <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                🎯 Enhanced Tab Switching
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Prominent segmented controls with visual feedback and smooth transitions
              </Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                🔄 Advanced Sorting
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Sort by name, price, or popularity with ascending/descending order
              </Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                ❤️ Wishlist & Ownership
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Track what you own and add items to your wishlist with persistent storage
              </Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                🏪 Supplier Information
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                View available suppliers and recommended substitutes for materials
              </Text>
            </View>

            <View style={[styles.featureItem, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
              <Text style={[styles.featureTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                🔍 Enhanced Filtering
              </Text>
              <Text style={[styles.featureDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                Filter by category, ownership status, and wishlist items
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.demoButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => setShowLibrary(true)}
          >
            <Text style={styles.demoButtonText}>Launch Enhanced Library</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ToolMaterialLibrary
          onSelectTool={handleToolSelect}
          onSelectMaterial={handleMaterialSelect}
        />
      )}

      {showLibrary && (
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}
          onPress={() => setShowLibrary(false)}
        >
          <Text style={[styles.backButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>
            ← Back to Demo
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  demoContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featuresList: {
    marginBottom: 40,
  },
  featureItem: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  demoButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
