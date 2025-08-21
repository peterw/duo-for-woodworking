import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useUserProgressStore } from '@/stores';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProjectSlicerProps {
  projectId: string;
  onComplete: () => void;
}

interface SliceData {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'cutting' | 'assembly' | 'finishing' | 'safety' | 'planning';
  steps: string[];
  successCriteria: string[];
  photoCheckRequired: boolean;
  cutList: CutListItem[];
  materials: MaterialItem[];
  tools: ToolItem[];
}

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
}

interface MaterialItem {
  id: string;
  name: string;
  type: 'wood' | 'hardware' | 'finish' | 'adhesive';
  quantity: number;
  unit: string;
  specifications?: string;
}

interface ToolItem {
  id: string;
  name: string;
  type: 'hand' | 'power' | 'measuring' | 'safety';
  required: boolean;
  alternatives?: string[];
}

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

export default function ProjectSlicer({ projectId, onComplete }: ProjectSlicerProps) {
  const colorScheme = useColorScheme();
  const { createProjectPlan, sliceProjectIntoLessons } = useUserProgressStore();
  const [slices, setSlices] = useState<SliceData[]>([]);
  const [currentSlice, setCurrentSlice] = useState<SliceData | null>(null);
  const [editingStep, setEditingStep] = useState<string>('');
  const [editingCriteria, setEditingCriteria] = useState<string>('');

  const project = enhancedProjects.find(p => p.id === projectId);

  useEffect(() => {
    if (project) {
      const projectPlan = createProjectPlan(project);
      const projectSlices = sliceProjectIntoLessons(projectPlan);
      setSlices(projectSlices);
    }
  }, [projectId]);

  const addStep = (sliceId: string) => {
    if (!editingStep.trim()) return;
    
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, steps: [...slice.steps, editingStep.trim()] }
        : slice
    ));
    setEditingStep('');
  };

  const removeStep = (sliceId: string, stepIndex: number) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, steps: slice.steps.filter((_, i) => i !== stepIndex) }
        : slice
    ));
  };

  const addSuccessCriteria = (sliceId: string) => {
    if (!editingCriteria.trim()) return;
    
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, successCriteria: [...slice.successCriteria, editingCriteria.trim()] }
        : slice
    ));
    setEditingCriteria('');
  };

  const removeSuccessCriteria = (sliceId: string, criteriaIndex: number) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId 
        ? { ...slice, successCriteria: slice.successCriteria.filter((_, i) => i !== criteriaIndex) }
        : slice
    ));
  };

  const updateSlice = (sliceId: string, updates: Partial<SliceData>) => {
    setSlices(prev => prev.map(slice => 
      slice.id === sliceId ? { ...slice, ...updates } : slice
    ));
  };

  const renderSliceEditor = (slice: SliceData) => (
    <View key={slice.id} style={[styles.sliceCard, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <View style={styles.sliceHeader}>
        <Text style={[styles.sliceTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {slice.title}
        </Text>
        <TouchableOpacity
          style={[styles.typeBadge, { backgroundColor: getTypeColor(slice.type) }]}
        >
          <Text style={styles.typeBadgeText}>{slice.type}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Title</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].border 
          }]}
          value={slice.title}
          onChangeText={(text) => updateSlice(slice.id, { title: text })}
          placeholder="Enter slice title"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Description</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].border 
          }]}
          value={slice.description}
          onChangeText={(text) => updateSlice(slice.id, { description: text })}
          placeholder="Enter slice description"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          multiline
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Duration</Text>
        <TextInput
          style={[styles.textInput, { 
            backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
            color: Colors[colorScheme ?? 'light'].text,
            borderColor: Colors[colorScheme ?? 'light'].border 
          }]}
          value={slice.duration}
          onChangeText={(text) => updateSlice(slice.id, { duration: text })}
          placeholder="e.g., 30 min"
          placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Steps</Text>
        <View style={styles.stepsContainer}>
          {slice.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <Text style={[styles.stepNumber, { color: Colors[colorScheme ?? 'light'].primary }]}>
                {index + 1}
              </Text>
              <Text style={[styles.stepText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {step}
              </Text>
              <TouchableOpacity
                onPress={() => removeStep(slice.id, index)}
                style={styles.removeButton}
              >
                <IconSymbol name="minus.circle.fill" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.addStepContainer}>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border,
              flex: 1,
              marginRight: 8
            }]}
            value={editingStep}
            onChangeText={setEditingStep}
            placeholder="Add a new step"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => addStep(slice.id)}
          >
            <IconSymbol name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme ?? 'light'].text }]}>Success Criteria</Text>
        <View style={styles.criteriaContainer}>
          {slice.successCriteria.map((criteria, index) => (
            <View key={index} style={styles.criteriaItem}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={Colors[colorScheme ?? 'light'].success} />
              <Text style={[styles.criteriaText, { color: Colors[colorScheme ?? 'light'].text }]}>
                {criteria}
              </Text>
              <TouchableOpacity
                onPress={() => removeSuccessCriteria(slice.id, index)}
                style={styles.removeButton}
              >
                <IconSymbol name="minus.circle.fill" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.addStepContainer}>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: Colors[colorScheme ?? 'light'].backgroundSecondary,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].border,
              flex: 1,
              marginRight: 8
            }]}
            value={editingCriteria}
            onChangeText={setEditingCriteria}
            placeholder="Add success criteria"
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
            onPress={() => addSuccessCriteria(slice.id)}
          >
            <IconSymbol name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => updateSlice(slice.id, { photoCheckRequired: !slice.photoCheckRequired })}
        >
          {slice.photoCheckRequired && (
            <IconSymbol name="checkmark" size={16} color="white" />
          )}
        </TouchableOpacity>
        <Text style={[styles.checkboxLabel, { color: Colors[colorScheme ?? 'light'].text }]}>
          Photo check required for completion
        </Text>
      </View>
    </View>
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cutting': return '#FF6B6B';
      case 'assembly': return '#4ECDC4';
      case 'finishing': return '#45B7D1';
      case 'safety': return '#96CEB4';
      case 'planning': return '#FFEAA7';
      default: return Colors[colorScheme ?? 'light'].primary;
    }
  };

  const handleComplete = () => {
    Alert.alert(
      'Project Slicing Complete',
      'Your project has been sliced into lesson slices. You can now start building!',
      [
        {
          text: 'Start Building',
          onPress: onComplete,
        },
      ]
    );
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
          Project not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Project Slicer
        </Text>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Break down "{project.title}" into manageable lesson slices
        </Text>
      </View>

      {slices.map(renderSliceEditor)}

      <TouchableOpacity
        style={[styles.completeButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
        onPress={handleComplete}
      >
        <Text style={styles.completeButtonText}>Complete Slicing</Text>
        <IconSymbol name="arrow.right" size={20} color="white" />
      </TouchableOpacity>
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
  sliceCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sliceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sliceTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  inputGroup: {
    marginBottom: 20,
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
  },
  stepsContainer: {
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    marginLeft: 8,
  },
  addStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  criteriaContainer: {
    marginBottom: 12,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  criteriaText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
});
