import { FontFamilies, Typography } from '@/hooks/AppFonts';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const TypographyDemo = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Headings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Headings</Text>
        <Text style={Typography.h1}>H1 - Main Title</Text>
        <Text style={Typography.h2}>H2 - Section Header</Text>
        <Text style={Typography.h3}>H3 - Subsection</Text>
        <Text style={Typography.h4}>H4 - Card Title</Text>
      </View>

      {/* Body Text */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Text</Text>
        <Text style={Typography.bodyLarge}>
          Body Large - This is important content that needs to stand out. Perfect for key messages and descriptions.
        </Text>
        <Text style={Typography.bodyMedium}>
          Body Medium - This is the standard body text used throughout the app. It's highly readable and comfortable to read.
        </Text>
        <Text style={Typography.bodySmall}>
          Body Small - Secondary information and supporting text that doesn't need as much emphasis.
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons & Interactive</Text>
        <View style={styles.buttonContainer}>
          <Text style={[Typography.buttonLarge, styles.button]}>Primary Button</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={[Typography.buttonMedium, styles.buttonSecondary]}>Secondary Button</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={[Typography.buttonSmall, styles.buttonSmall]}>Small Button</Text>
        </View>
      </View>

      {/* Captions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Captions & Labels</Text>
        <Text style={Typography.caption}>Caption - Metadata, labels, and small text</Text>
        <Text style={Typography.caption}>Last updated: 2 hours ago</Text>
        <Text style={Typography.caption}>Difficulty: Beginner</Text>
      </View>

      {/* Custom Font Usage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Font Combinations</Text>
        <Text style={[styles.customHeading, { fontFamily: FontFamilies.featherBold }]}>
          Custom Feather Bold
        </Text>
        <Text style={[styles.customBody, { fontFamily: FontFamilies.dinRounded }]}>
          Custom DIN Rounded Regular for body text
        </Text>
        <Text style={[styles.customEmphasis, { fontFamily: FontFamilies.dinRounded, fontWeight: 'bold' }]}>
          Custom DIN Rounded Bold for emphasis
        </Text>
      </View>

      {/* Font Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Comparison</Text>
        <Text style={styles.comparisonRow}>
          <Text style={[styles.comparisonLabel, { fontFamily: FontFamilies.featherBold }]}>
            Feather Bold:
          </Text>
          <Text style={styles.comparisonText}> Friendly and distinctive</Text>
        </Text>
        <Text style={styles.comparisonRow}>
          <Text style={[styles.comparisonLabel, { fontFamily: FontFamilies.dinRounded }]}>
            DIN Rounded:
          </Text>
          <Text style={styles.comparisonText}> Clean and readable</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: 16,
    color: '#2c3e50',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#58cc02',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: 'center',
    overflow: 'hidden',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    color: '#58cc02',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#58cc02',
  },
  buttonSmall: {
    backgroundColor: '#e9ecef',
    color: '#495057',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    textAlign: 'center',
  },
  customHeading: {
    fontSize: 24,
    color: '#2c3e50',
    marginBottom: 8,
  },
  customBody: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 8,
  },
  customEmphasis: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 16,
    color: '#2c3e50',
    minWidth: 120,
  },
  comparisonText: {
    fontSize: 16,
    color: '#495057',
    fontFamily: FontFamilies.dinRounded,
  },
});
