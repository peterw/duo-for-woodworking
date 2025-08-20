import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    title: 'Safety First!',
    content: 'Always wear safety glasses and hearing protection when using power tools. Keep your workspace clean and well-lit.',
    category: 'safety',
    icon: 'shield.fill',
  },
  {
    id: 'measure-twice',
    title: 'Measure Twice, Cut Once',
    content: 'This old adage is true! Double-check your measurements before making any cuts. It saves time and materials.',
    category: 'technique',
    icon: 'ruler.fill',
  },
  {
    id: 'sharp-tools',
    title: 'Sharp Tools Work Better',
    content: 'Dull tools are dangerous and inefficient. Keep your chisels and saws sharp for clean, safe cuts.',
    category: 'tool',
    icon: 'scissors',
  },
  {
    id: 'grain-direction',
    title: 'Mind the Grain',
    content: 'Always cut with the grain when possible. Cutting against the grain can cause tear-out and rough edges.',
    category: 'technique',
    icon: 'arrow.up.right',
  },
  {
    id: 'patience',
    title: 'Patience is Key',
    content: 'Woodworking is a skill that develops over time. Don\'t rush - focus on doing each step correctly.',
    category: 'motivation',
    icon: 'clock.fill',
  },
  {
    id: 'wood-selection',
    title: 'Choose the Right Wood',
    content: 'Different woods have different properties. Pine is great for beginners, while hardwoods like oak are more durable.',
    category: 'material',
    icon: 'leaf.fill',
  },
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
      default: return Colors[colorScheme ?? 'light'].tint;
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

  const renderTipCard = (tip: CoachTip) => (
    <TouchableOpacity
      key={tip.id}
      style={[
        styles.tipCard,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderColor: getCategoryColor(tip.category),
        },
      ]}
      onPress={() => setSelectedTip(tip)}
    >
      <View style={[styles.tipIcon, { backgroundColor: getCategoryColor(tip.category) }]}>
        <IconSymbol name={tip.icon as any} size={20} color="white" />
      </View>
      <View style={styles.tipContent}>
        <Text style={[styles.tipTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          {tip.title}
        </Text>
        <Text style={[styles.tipPreview, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          {tip.content.substring(0, 60)}...
        </Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tip.category) }]}>
          <Text style={styles.categoryText}>{tip.category}</Text>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={20} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
    </TouchableOpacity>
  );

  const renderTipDetail = () => {
    if (!selectedTip) return null;

    return (
      <View style={[styles.tipDetail, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.tipDetailHeader}>
          <View style={[styles.tipDetailIcon, { backgroundColor: getCategoryColor(selectedTip.category) }]}>
            <IconSymbol name={selectedTip.icon as any} size={32} color="white" />
          </View>
          <View style={styles.tipDetailContent}>
            <Text style={[styles.tipDetailTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              {selectedTip.title}
            </Text>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(selectedTip.category) }]}>
              <Text style={styles.categoryText}>{selectedTip.category}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setSelectedTip(null)}>
            <IconSymbol name="xmark.circle.fill" size={24} color={Colors[colorScheme ?? 'light'].tabIconDefault} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.tipDetailContent, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          {selectedTip.content}
        </Text>
        
        <View style={styles.tipActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
            <IconSymbol name="heart" size={16} color="white" />
            <Text style={styles.actionButtonText}>Save Tip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: Colors[colorScheme ?? 'light'].border }]}>
            <IconSymbol name="square.and.arrow.up" size={16} color={Colors[colorScheme ?? 'light'].text} />
            <Text style={[styles.actionButtonText, { color: Colors[colorScheme ?? 'light'].text }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayedTips = showAllTips ? coachTips : coachTips.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.tipsSection}>
        <View style={styles.tipsHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Today's Tips
          </Text>
          <TouchableOpacity onPress={() => setShowAllTips(!showAllTips)}>
            <Text style={[styles.showMoreButton, { color: Colors[colorScheme ?? 'light'].tint }]}>
              {showAllTips ? 'Show Less' : 'Show More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {displayedTips.map((tip) => {
          // If this tip is selected, show the detail modal instead of the card
          if (selectedTip && selectedTip.id === tip.id) {
            return (
              <View key={tip.id} style={[styles.tipCard, { borderWidth: 0 }]}>
                {renderTipDetail()}
              </View>
            );
          }
          // Otherwise show the normal tip card
          return renderTipCard(tip);
        })}
      </View>

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconSymbol name="brain.head.profile" size={24} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            AI Coach
          </Text>
        </View>
        <Text style={[styles.headerSubtitle, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
          Your personal woodworking mentor
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <IconSymbol name="questionmark.circle.fill" size={20} color="white" />
          <Text style={[styles.quickActionText, { color: "white" }]}>Ask Coach</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: Colors[colorScheme ?? 'light'].border }]}>
          <IconSymbol name="book.fill" size={20} color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.quickActionText, { color: Colors[colorScheme ?? 'light'].tint }]}>View All Tips</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
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
    fontWeight: '600',
    marginBottom: 4,
  },
  tipPreview: {
    fontSize: 14,
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
    fontWeight: '600',
    textTransform: 'capitalize',
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
    alignItems: 'center',
    marginBottom: 20,
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
    fontWeight: '700',
    marginBottom: 8,
  },
  tipDetailText: {
    fontSize: 16,
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
    fontWeight: '600',
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
    fontSize: 20,
    fontWeight: '700',
  },
  showMoreButton: {
    fontSize: 14,
    fontWeight: '600',
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
    fontWeight: '600',
    marginLeft: 8,
  },
});
