import { Achievement } from '@/components/Achievement';
import { LessonCard } from '@/components/LessonCard';
import { TypographyDemo } from '@/components/TypographyDemo';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { BorderRadius, Colors, ComponentStyles, Spacing } from '@/constants/DesignSystem';
import { FontFamilies, Typography } from '@/hooks/AppFonts';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Design System Demo" 
        subtitle="Duolingo-style components showcase"
        showSafeArea={false}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Typography Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Typography System</Text>
          <TypographyDemo />
        </View>

        {/* Button Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button Components</Text>
          <View style={styles.buttonGrid}>
            <Button
              title="Primary Button"
              onPress={() => console.log('Primary pressed')}
              variant="primary"
              size="large"
            />
            <Button
              title="Secondary"
              onPress={() => console.log('Secondary pressed')}
              variant="secondary"
              size="medium"
            />
            <Button
              title="Outline"
              onPress={() => console.log('Outline pressed')}
              variant="outline"
              size="medium"
            />
            <Button
              title="Ghost"
              onPress={() => console.log('Ghost pressed')}
              variant="ghost"
              size="small"
            />
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Components</Text>
          <View style={styles.inputGrid}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              variant="outlined"
              size="medium"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              variant="filled"
              size="medium"
              secureTextEntry
            />
          </View>
        </View>

        {/* Lesson Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lesson Cards</Text>
          <View style={styles.lessonGrid}>
            <LessonCard
              title="Basic Tool Safety"
              description="Learn essential safety practices for using hand tools and power tools in the workshop."
              difficulty="Beginner"
              progress={75}
              duration="15 min"
              onPress={() => console.log('Basic Tool Safety pressed')}
            />
            
            <LessonCard
              title="Measuring & Marking"
              description="Master the fundamentals of accurate measurement and marking techniques."
              difficulty="Beginner"
              progress={100}
              duration="20 min"
              onPress={() => console.log('Measuring & Marking pressed')}
              isCompleted={true}
            />
            
            <LessonCard
              title="Sawing Techniques"
              description="Learn proper sawing techniques for different types of cuts and materials."
              difficulty="Intermediate"
              progress={0}
              duration="25 min"
              onPress={() => console.log('Sawing Techniques pressed')}
              isLocked={true}
            />
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <Achievement
              title="First Steps"
              description="Complete your first lesson"
              icon="leaf.fill"
              isUnlocked={true}
            />
            
            <Achievement
              title="Tool Master"
              description="Learn 5 different tools"
              icon="wrench.and.screwdriver.fill"
              isUnlocked={true}
            />
            
            <Achievement
              title="Safety First"
              description="Complete all safety lessons"
              icon="shield.fill"
              isUnlocked={false}
              progress={25}
            />
            
            <Achievement
              title="Project Creator"
              description="Complete your first project"
              icon="hammer.fill"
              isUnlocked={false}
              progress={0}
            />
            
            <Achievement
              title="Streak Master"
              description="Maintain a 7-day streak"
              icon="flame.fill"
              isUnlocked={false}
              progress={60}
            />
            
            <Achievement
              title="Wood Expert"
              description="Reach level 10"
              icon="star.fill"
              isUnlocked={false}
              progress={0}
            />
          </View>
        </View>

        {/* Progress Bars Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Indicators</Text>
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Daily Goal</Text>
              <View style={ComponentStyles.progressBar.container}>
                <View
                  style={[
                    ComponentStyles.progressBar.fill,
                    { width: '75%' }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>75%</Text>
            </View>
            
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Weekly Streak</Text>
              <View style={ComponentStyles.progressBar.container}>
                <View
                  style={[
                    ComponentStyles.progressBar.fill,
                    { width: '60%', backgroundColor: Colors.warning }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>60%</Text>
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges & Tags</Text>
          <View style={styles.badgesGrid}>
            <View style={ComponentStyles.badge.primary}>
              <Text style={styles.badgeText}>Beginner</Text>
            </View>
            <View style={ComponentStyles.badge.secondary}>
              <Text style={styles.badgeText}>Safety</Text>
            </View>
            <View style={ComponentStyles.badge.success}>
              <Text style={styles.badgeText}>Completed</Text>
            </View>
            <View style={ComponentStyles.badge.warning}>
              <Text style={styles.badgeText}>In Progress</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: FontFamilies.featherBold,
    fontSize: 28,
    lineHeight: 36,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  buttonGrid: {
    gap: Spacing.md,
  },
  inputGrid: {
    gap: Spacing.md,
  },
  lessonGrid: {
    gap: Spacing.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  progressGrid: {
    gap: Spacing.lg,
  },
  progressItem: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...ComponentStyles.card,
  },
  progressLabel: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
