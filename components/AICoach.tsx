import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CoachTip {
  id: string;
  title: string;
  content: string;
  category: 'safety' | 'technique' | 'tool' | 'material' | 'motivation';
  icon: string;
}

const coachTips: CoachTip[] = [
  {
    id: 'safety-first',
    title: 'Safety First',
    content: 'Always wear safety glasses and hearing protection. Keep your workspace clean and well-lit. Learn proper tool handling before starting any project.',
    category: 'safety',
    icon: 'shield.fill',
  },
  {
    id: 'measure-twice',
    title: 'Measure Twice, Cut Once',
    content: 'This old adage is crucial in woodworking. Double-check your measurements and mark your cuts clearly. It saves time and materials in the long run.',
    category: 'technique',
    icon: 'ruler.fill',
  },
  {
    id: 'sharp-tools',
    title: 'Keep Tools Sharp',
    content: 'Sharp tools are safer and more effective. Learn to sharpen your chisels, planes, and saws regularly. Dull tools require more force and can cause accidents.',
    category: 'tool',
    icon: 'scissors',
  },
  {
    id: 'wood-selection',
    title: 'Choose the Right Wood',
    content: 'Start with softwoods like pine for practice. Hardwoods like oak and maple are beautiful but more challenging to work with. Consider your project needs.',
    category: 'material',
    icon: 'leaf.fill',
  },
  {
    id: 'patience-practice',
    title: 'Patience and Practice',
    content: 'Woodworking is a skill that develops over time. Start with simple projects and gradually increase complexity. Every mistake is a learning opportunity.',
    category: 'motivation',
    icon: 'heart.fill',
  },
  {
    id: 'workshop-organization',
    title: 'Organize Your Workshop',
    content: 'A clean, organized workspace improves safety and efficiency. Designate places for tools and materials. Good lighting and ventilation are essential.',
    category: 'safety',
    icon: 'house.fill',
  }
];

export default function AICoach() {
  const colorScheme = useColorScheme();
  const [selectedTip, setSelectedTip] = useState<CoachTip | null>(null);
  const [showAllTips, setShowAllTips] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return '#FF6B6B';
      case 'technique': return '#4ECDC4';
      case 'tool': return '#45B7D1';
      case 'material': return '#96CEB4';
      case 'motivation': return '#FFEAA7';
      default: return Colors[colorScheme ?? 'light'].primary;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'safety': return 'shield.fill';
      case 'technique': return 'hand.raised.fill';
      case 'tool': return 'wrench.and.screwdriver.fill';
      case 'material': return 'leaf.fill';
      case 'motivation': return 'heart.fill';
      default: return 'lightbulb.fill';
    }
  };

  const handleAskCoach = () => {
    router.push('/(tabs)/coach');
  };

  const handleQuickQuestion = (question: string) => {
    router.push({
      pathname: '/(tabs)/coach',
      params: { question }
    });
  };

  const renderTipCard = (tip: CoachTip) => (
    <TouchableOpacity
      key={tip.id}
      style={[
        styles.tipCard,
        { borderColor: getCategoryColor(tip.category) }
      ]}
      onPress={() => setSelectedTip(tip)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.tipIcon,
        { backgroundColor: getCategoryColor(tip.category) }
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
          { backgroundColor: getCategoryColor(tip.category) }
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
                    { backgroundColor: getCategoryColor(selectedTip.category) }
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
                      { backgroundColor: getCategoryColor(selectedTip.category) }
                    ]}>
                      <Text style={styles.tipDetailCategoryText}>
                        {selectedTip.category.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[
                  styles.tipDetailContent,
                  { color: Colors[colorScheme ?? 'light'].textSecondary }
                ]}>
                  {selectedTip.content}
                </Text>
                
                {/* Action Buttons */}
                <View style={styles.tipActionButtons}>
                  <TouchableOpacity style={styles.saveTipButton}>
                    <IconSymbol name="heart" size={20} color="white" />
                    <Text style={styles.saveTipButtonText}>Save Tip</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.shareButton}>
                    <IconSymbol name="square.and.arrow.up" size={20} color="black" />
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );

  const displayedTips = showAllTips ? coachTips : coachTips.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.tipsSection}>
        <View style={styles.tipsHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Today's Tips
          </Text>
          <TouchableOpacity onPress={() => setShowAllTips(!showAllTips)}>
            <Text style={[styles.showMoreButton, { color: Colors[colorScheme ?? 'light'].primary }]}>
              {showAllTips ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {displayedTips.map((tip) => renderTipCard(tip))}
      </View>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="brain.head.profile" size={24} color={Colors[colorScheme ?? 'light'].primary} />
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            AI Coach
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Your personal woodworking mentor
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme ?? 'light'].primary }]}
          onPress={handleAskCoach}
          activeOpacity={0.8}
        >
          <IconSymbol name="questionmark.circle.fill" size={20} color="white" />
          <Text style={[styles.quickActionText, { color: "white" }]}>Ask Coach</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: Colors[colorScheme ?? 'light'].border }]}
          onPress={() => handleQuickQuestion("What tools do I need to start woodworking?")}
          activeOpacity={0.8}
        >
          <IconSymbol name="wrench.and.screwdriver.fill" size={20} color={Colors[colorScheme ?? 'light'].primary} />
          <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].primary }]}>Tool Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Questions Section */}
      <View style={styles.quickQuestionsSection}>
        <Text style={[styles.quickQuestionsTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Quick Questions
        </Text>
        <View style={styles.quickQuestionsGrid}>
          <TouchableOpacity 
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("How do I sharpen chisels properly?")}
            activeOpacity={0.7}
          >
            <Text style={styles.quickQuestionText}>Sharpen Chisels</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("What's the safest way to use a table saw?")}
            activeOpacity={0.7}
          >
            <Text style={styles.quickQuestionText}>Table Saw Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("How do I make strong dovetail joints?")}
            activeOpacity={0.7}
          >
            <Text style={styles.quickQuestionText}>Dovetail Joints</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("What's the best way to finish oak?")}
            activeOpacity={0.7}
          >
            <Text style={styles.quickQuestionText}>Oak Finishing</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Render the tip detail modal */}
      {renderTipDetail()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: FontFamilies.featherBold,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 36,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
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
  modalBackdrop: {
    width:Dimensions.get('window').width,
    height:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdropOverlay: {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
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
    minHeight:300,
    maxHeight: '80%',
    alignSelf: 'center',
    padding: 30,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 0.95 }],
  },
  tipDetail: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  tipDetailContent: {
    flex: 1,
  },
  tipDetailTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 8,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  tipDetailText: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    lineHeight: 24,
    marginBottom: 20,
  },
  tipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  tipsSection: {
    marginBottom: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: FontFamilies.featherBold,
  },
  showMoreButton: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    marginLeft: 8,
  },
  quickQuestionsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  quickQuestionsTitle: {
    fontSize: 18,
    fontFamily: FontFamilies.featherBold,
    marginBottom: 16,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  quickQuestionChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: '48%', // Two columns
    alignItems: 'center',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickQuestionText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#333',
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
  tipActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  saveTipButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B4513',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  saveTipButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shareButtonText: {
    color: 'black',
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
});
