import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getSavedCoachTips, unsaveCoachTip } from '@/services/firestoreService';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CoachTip {
  id: string;
  title: string;
  content: string;
  category: 'safety' | 'technique' | 'tool' | 'material' | 'motivation';
  icon: string;
  color: string;
  savedAt: string;
}

export default function SavedTipsScreen() {
  const colorScheme = useColorScheme();
  const [savedTips, setSavedTips] = useState<CoachTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTip, setSelectedTip] = useState<CoachTip | null>(null);
  const [isUnsaving, setIsUnsaving] = useState(false);

  const getCategoryColor = (tip: CoachTip) => {
    return tip.color || (() => {
      switch (tip.category) {
        case 'safety': return '#FF6B6B';
        case 'technique': return '#4ECDC4';
        case 'tool': return '#45B7D1';
        case 'material': return '#96CEB4';
        case 'motivation': return '#FFEAA7';
        default: return '#8B4513';
      }
    })();
  };

  const fetchSavedTips = async () => {
    try {
      const tips = await getSavedCoachTips();
      setSavedTips(tips);
    } catch (error) {
      console.error('Error fetching saved tips:', error);
      setSavedTips([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSavedTips();
    setRefreshing(false);
  };

  const handleUnsaveTip = async (tip: CoachTip) => {
    try {
      setIsUnsaving(true);
      await unsaveCoachTip(tip.id);
      
      // Remove from local state
      setSavedTips(prev => prev.filter(t => t.id !== tip.id));
      setSelectedTip(null);
      
      Alert.alert('Success', 'Tip removed from saved tips');
    } catch (error) {
      console.error('Error unsaving tip:', error);
      Alert.alert('Error', 'Failed to remove tip. Please try again.');
    } finally {
      setIsUnsaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchSavedTips();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const renderTipCard = (tip: CoachTip) => (
    <TouchableOpacity
      key={tip.id}
      style={[
        styles.tipCard,
        { borderColor: getCategoryColor(tip) }
      ]}
      onPress={() => setSelectedTip(tip)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.tipIcon,
        { backgroundColor: getCategoryColor(tip) }
      ]}>
        <IconSymbol name={tip.icon as any} size={20} color="white" />
      </View>
      <View style={styles.tipContent}>
        <Text style={[
          styles.tipTitle,
          { color: Colors[colorScheme ?? 'light'].text }
        ]}>
          {tip.title}
        </Text>
        <Text style={[
          styles.tipPreview,
          { color: Colors[colorScheme ?? 'light'].textSecondary }
        ]} numberOfLines={2}>
          {tip.content}
        </Text>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: getCategoryColor(tip) }
        ]}>
          <Text style={styles.categoryText}>
            {tip.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTipDetail = () => (
    <Modal
      visible={selectedTip !== null}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setSelectedTip(null)}
    >
      <BlurView intensity={20} style={styles.modalBackdrop}>
        <View style={styles.modalBackdropOverlay}>
          <View style={[
            styles.tipDetailModal,
            { backgroundColor: Colors[colorScheme ?? 'light'].background }
          ]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTip(null)}
            >
              <IconSymbol name="xmark.circle.fill" size={24} color="#999" />
            </TouchableOpacity>
            
            {selectedTip && (
              <View style={styles.tipDetailContent}>
                <View style={styles.tipDetailHeader}>
                  <View style={[
                    styles.tipDetailIcon,
                    { backgroundColor: getCategoryColor(selectedTip) }
                  ]}>
                    <IconSymbol name={selectedTip.icon as any} size={32} color="white" />
                  </View>
                  
                  <View style={styles.tipDetailTitleSection}>
                    <Text 
                      style={[
                        styles.tipDetailTitle,
                        { color: Colors[colorScheme ?? 'light'].text }
                      ]}
                      numberOfLines={3}
                      adjustsFontSizeToFit={true}
                    >
                      {selectedTip.title}
                    </Text>
                    
                    <View style={[
                      styles.tipDetailCategory,
                      { backgroundColor: getCategoryColor(selectedTip) }
                    ]}>
                      <Text style={styles.tipDetailCategoryText}>
                        {selectedTip.category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[
                  styles.tipDetailContentText,
                  { color: Colors[colorScheme ?? 'light'].textSecondary }
                ]}>
                  {selectedTip.content}
                </Text>
                
                <Text style={[
                  styles.savedDate,
                  { color: Colors[colorScheme ?? 'light'].textSecondary }
                ]}>
                  Saved on {new Date(selectedTip.savedAt).toLocaleDateString()}
                </Text>
                
                {/* Action Buttons */}
                <View style={styles.tipActionButtons}>
                  <TouchableOpacity 
                    style={styles.unsaveButton}
                    onPress={() => handleUnsaveTip(selectedTip)}
                    disabled={isUnsaving}
                  >
                    {isUnsaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <IconSymbol name="heart.slash" size={20} color="white" />
                    )}
                    <Text style={styles.unsaveButtonText}>
                      {isUnsaving ? 'Removing...' : 'Remove from Saved'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Saved Tips
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].primary} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            Loading saved tips...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Saved Tips
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
      >
        {savedTips.length > 0 ? (
          <>
            <View style={styles.tipsHeader}>
              <Text style={[styles.tipsCount, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
                {savedTips.length} saved tip{savedTips.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {savedTips.map((tip) => renderTipCard(tip))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💡</Text>
            <Text style={[styles.emptyStateTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              No Saved Tips Yet
            </Text>
            <Text style={[styles.emptyStateText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
              Start saving your favorite woodworking tips from the AI Coach section!
            </Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/')}
            >
              <Text style={styles.exploreButtonText}>Explore Tips</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {renderTipDetail()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tipsHeader: {
    marginBottom: 20,
  },
  tipsCount: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 4,
  },
  tipPreview: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontFamily: FontFamilies.dinRounded,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
  },
  modalBackdrop: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdropOverlay: {
    width: width,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  tipDetailModal: {
    width: '100%',
    minHeight: 360,
    maxHeight: '80%',
    alignSelf: 'center',
    padding: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  tipDetailContent: {
    flex: 1,
  },
  tipDetailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tipDetailTitleSection: {
    flex: 1,
  },
  tipDetailIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipDetailTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  tipDetailCategory: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  tipDetailCategoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: FontFamilies.dinRounded,
    textTransform: 'uppercase',
  },
  tipDetailContentText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 24,
    marginBottom: 16,
  },
  savedDate: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  tipActionButtons: {
    marginTop: 20,
  },
  unsaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  unsaveButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
});
