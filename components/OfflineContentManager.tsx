import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OfflineContentManagerProps {
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Enhanced project data with proper categorization
const enhancedProjects = [
  // Furniture Projects
  {
    id: 'coffee-table',
    title: 'Modern Coffee Table',
    description: 'A sleek coffee table with clean lines and hidden storage',
    difficulty: 'Intermediate',
    estimatedTime: '8-12 hours',
    materials: ['Oak hardwood', 'Plywood', 'Wood glue', 'Finish'],
    tools: ['Table saw', 'Router', 'Clamps', 'Sander'],
    skills: ['advanced-joinery', 'power-tools-intro', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 8, max: 12 },
    lessonSlices: []
  },
  {
    id: 'bookshelf',
    title: 'Floating Bookshelf',
    description: 'A minimalist bookshelf that appears to float on the wall',
    difficulty: 'Beginner',
    estimatedTime: '4-6 hours',
    materials: ['Pine boards', 'Wall brackets', 'Screws', 'Paint'],
    tools: ['Circular saw', 'Drill', 'Level', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 4, max: 6 },
    lessonSlices: []
  },
  {
    id: 'dining-chair',
    title: 'Rustic Dining Chair',
    description: 'A comfortable dining chair with traditional joinery',
    difficulty: 'Advanced',
    estimatedTime: '12-16 hours',
    materials: ['Hardwood', 'Wood glue', 'Wedges', 'Finish'],
    tools: ['Chisels', 'Mallet', 'Clamps', 'Hand planes'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 12, max: 16 },
    lessonSlices: []
  },

  // Decorative Projects
  {
    id: 'wooden-sign',
    title: 'Personalized Wooden Sign',
    description: 'Create a custom sign with your favorite quote or family name',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    materials: ['Pine board', 'Stain', 'Paint', 'Hanging hardware'],
    tools: ['Jigsaw', 'Sander', 'Paintbrushes', 'Drill'],
    skills: ['measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'decorative',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 3 },
    lessonSlices: []
  },
  {
    id: 'wall-art',
    title: 'Geometric Wall Art',
    description: 'Modern geometric patterns made from different wood species',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    materials: ['Various hardwoods', 'Wood glue', 'Backing board', 'Finish'],
    tools: ['Table saw', 'Miter saw', 'Clamps', 'Sander'],
    skills: ['power-tools-intro', 'basic-joinery', 'sanding-finishing'],
    category: 'decorative',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 6, max: 8 },
    lessonSlices: []
  },

  // Outdoor Projects
  {
    id: 'garden-bench',
    title: 'Garden Bench',
    description: 'A sturdy bench perfect for your garden or patio',
    difficulty: 'Intermediate',
    estimatedTime: '10-14 hours',
    materials: ['Cedar or pressure-treated lumber', 'Screws', 'Finish'],
    tools: ['Circular saw', 'Drill', 'Clamps', 'Sander'],
    skills: ['power-tools-intro', 'basic-joinery', 'sanding-finishing'],
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 10, max: 14 },
    lessonSlices: []
  },
  {
    id: 'planter-box',
    title: 'Raised Planter Box',
    description: 'A raised garden bed for growing vegetables and flowers',
    difficulty: 'Beginner',
    estimatedTime: '3-5 hours',
    materials: ['Cedar boards', 'Screws', 'Landscape fabric', 'Soil'],
    tools: ['Circular saw', 'Drill', 'Measuring tape', 'Level'],
    skills: ['measuring-marking', 'basic-joinery'],
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 5 },
    lessonSlices: []
  },

  // Storage Projects
  {
    id: 'jewelry-box',
    title: 'Jewelry Box with Dividers',
    description: 'A beautiful box with custom dividers for organizing jewelry',
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    materials: ['Hardwood', 'Felt lining', 'Hinges', 'Finish'],
    tools: ['Table saw', 'Router', 'Chisels', 'Sander'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'storage',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Medium',
    timeRange: { min: 6, max: 8 },
    lessonSlices: []
  },
  {
    id: 'shoe-rack',
    title: 'Shoe Storage Rack',
    description: 'Organize your shoes with this simple rack',
    difficulty: 'Beginner',
    estimatedTime: '2-4 hours',
    materials: ['Pine boards', 'Screws', 'Paint or stain'],
    tools: ['Circular saw', 'Drill', 'Sander', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'storage',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 4 },
    lessonSlices: []
  },

  // Toys & Games Projects
  {
    id: 'wooden-puzzle',
    title: 'Wooden Puzzle',
    description: 'A custom puzzle with interlocking pieces',
    difficulty: 'Beginner',
    estimatedTime: '3-4 hours',
    materials: ['Plywood', 'Paint', 'Clear finish'],
    tools: ['Scroll saw', 'Sander', 'Paintbrushes'],
    skills: ['measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 4 },
    lessonSlices: []
  },
  {
    id: 'chess-set',
    title: 'Wooden Chess Set',
    description: 'Handcrafted chess pieces and board',
    difficulty: 'Advanced',
    estimatedTime: '20-30 hours',
    materials: ['Various hardwoods', 'Wood glue', 'Finish'],
    tools: ['Lathe', 'Chisels', 'Sander', 'Drill'],
    skills: ['advanced-joinery', 'chiseling', 'sanding-finishing'],
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'High',
    timeRange: { min: 20, max: 30 },
    lessonSlices: []
  },

  // Kitchen Projects
  {
    id: 'cutting-board',
    title: 'Simple Cutting Board',
    description: 'A beautiful and functional cutting board perfect for beginners',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    materials: ['Hardwood (maple, walnut)', 'Food-safe oil', 'Sandpaper'],
    tools: ['Hand saw', 'Chisel', 'Sandpaper', 'Clamps'],
    skills: ['safety-basics', 'measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 2, max: 3 },
    lessonSlices: []
  },
  {
    id: 'spice-rack',
    title: 'Wall-Mounted Spice Rack',
    description: 'Organize your spices with this wall-mounted rack',
    difficulty: 'Beginner',
    estimatedTime: '3-4 hours',
    materials: ['Pine boards', 'Screws', 'Paint or stain'],
    tools: ['Circular saw', 'Drill', 'Sander', 'Paintbrush'],
    skills: ['measuring-marking', 'basic-joinery', 'sanding-finishing'],
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    materialCost: 'Low',
    timeRange: { min: 3, max: 4 },
    lessonSlices: []
  },
];

export default function OfflineContentManager({ onClose }: OfflineContentManagerProps) {
  const colorScheme = useColorScheme();
  const { 
    offlineBundles, 
    isDownloading, 
    downloadProjectBundle, 
    removeOfflineBundle,
    isProjectOffline 
  } = useUserProgressStore();
  const [downloadingProject, setDownloadingProject] = useState<string | null>(null);

  const handleDownloadProject = async (projectId: string) => {
    if (isProjectOffline(projectId)) {
      Alert.alert(
        'Already Downloaded',
        'This project is already available offline.',
        [{ text: 'OK' }]
      );
      return;
    }

    setDownloadingProject(projectId);
    try {
      await downloadProjectBundle(projectId);
      Alert.alert(
        'Download Complete',
        'Project is now available offline!',
        [{ text: 'Great!' }]
      );
    } catch (error) {
      Alert.alert(
        'Download Failed',
        'There was an error downloading the project. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setDownloadingProject(null);
    }
  };

  const handleRemoveBundle = (bundleId: string, projectTitle: string) => {
    Alert.alert(
      'Remove Offline Content',
      `Are you sure you want to remove "${projectTitle}" from offline storage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeOfflineBundle(bundleId)
        },
      ]
    );
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(1)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const renderProjectItem = (project: any) => {
    const isOffline = isProjectOffline(project.id);
    const isDownloading = downloadingProject === project.id;
    
    return (
      <View key={project.id} style={[styles.projectCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.projectHeader}>
          <View style={[styles.projectIcon, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}>
            <IconSymbol name="hammer.fill" size={20} color="white" />
          </View>
          <View style={styles.projectInfo}>
            <Text style={[styles.projectTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {project.title}
            </Text>
            <Text style={[styles.projectDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {project.description}
            </Text>
            <Text style={[styles.projectMeta, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {project.difficulty} • {project.estimatedTime} • {project.lessonSlices.length} lessons
            </Text>
          </View>
        </View>
        
        <View style={styles.projectActions}>
          {isOffline ? (
            <View style={styles.offlineStatus}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={Colors[colorScheme ?? 'light'].success} />
              <Text style={[styles.offlineText, { color: Colors[colorScheme ?? 'light'].success }]}>
                Available Offline
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.downloadButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].primary },
                isDownloading && { opacity: 0.6 }
              ]}
              onPress={() => handleDownloadProject(project.id)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <IconSymbol name="arrow.down.circle" size={20} color="white" />
              ) : (
                <IconSymbol name="arrow.down.circle" size={20} color="white" />
              )}
              <Text style={styles.downloadButtonText}>
                {isDownloading ? 'Downloading...' : 'Download Offline'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderOfflineBundle = (bundle: any) => (
    <View key={bundle.id} style={[styles.bundleCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.bundleHeader}>
        <View style={[styles.bundleIcon, { backgroundColor: Colors[colorScheme ?? 'light'].success }]}>
          <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
        </View>
        <View style={styles.bundleInfo}>
          <Text style={[styles.bundleTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            {bundle.title}
          </Text>
          <Text style={[styles.bundleMeta, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            {formatFileSize(bundle.size)} • Downloaded {bundle.lastUpdated.toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveBundle(bundle.id, bundle.title)}
        >
          <IconSymbol name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.bundleContent}>
        <Text style={[styles.bundleDescription, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          {bundle.description}
        </Text>
        
        <View style={styles.bundleStats}>
          <View style={styles.statItem}>
            <IconSymbol name="book.fill" size={16} color={Colors[colorScheme ?? 'light'].primary} />
            <Text style={[styles.statText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {bundle.content.lessonSlices.length} lessons
            </Text>
          </View>
          <View style={styles.statItem}>
            <IconSymbol name="scissors" size={16} color={Colors[colorScheme ?? 'light'].primary} />
            <Text style={[styles.statText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Cut lists included
            </Text>
          </View>
          <View style={styles.statItem}>
            <IconSymbol name="wrench.and.screwdriver.fill" size={16} color={Colors[colorScheme ?? 'light'].primary} />
            <Text style={[styles.statText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Tools & materials
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="icloud.and.arrow.down" size={24} color={Colors[colorScheme ?? 'light'].primary} />
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Offline Content
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <IconSymbol name="xmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Available for Download
          </Text>
          <Text style={[styles.sectionSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Download projects to work offline in your workshop
          </Text>
          
          {enhancedProjects.map(renderProjectItem)}
        </View>

        {offlineBundles.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Downloaded Content
            </Text>
            <Text style={[styles.sectionSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              {offlineBundles.length} project{offlineBundles.length !== 1 ? 's' : ''} available offline
            </Text>
            
            {offlineBundles.map(renderOfflineBundle)}
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary }]}>
            <IconSymbol name="info.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].primary} />
            <Text style={[styles.infoTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Offline Benefits
            </Text>
            <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              • Work without internet connection{'\n'}
              • Access all project details in your workshop{'\n'}
              • Save data usage{'\n'}
              • Faster loading times
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 22,
    marginBottom: 20,
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  projectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    marginBottom: 8,
  },
  projectMeta: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  projectActions: {
    alignItems: 'flex-end',
  },
  offlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  bundleCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bundleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bundleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  bundleMeta: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
  },
  removeButton: {
    padding: 8,
  },
  bundleContent: {
    marginTop: 8,
  },
  bundleDescription: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    marginBottom: 16,
  },
  bundleStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 6,
  },
  infoSection: {
    marginBottom: 40,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    textAlign: 'center',
  },
});
