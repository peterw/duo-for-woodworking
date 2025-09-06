import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontFamilies } from '@/hooks/AppFonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { hapticSelection } from '@/utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
  const { top: topPadding } = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const handleBackPress = () => {
    hapticSelection();
    router.back();
  };

  const renderSection = (title: string, content: string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </View>
  );

  const renderSubSection = (title: string, content: string[]) => (
    <View style={styles.subSection}>
      <Text style={styles.subSectionTitle}>{title}</Text>
      {content.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <IconSymbol name="chevron.left" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>How we protect your data</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <LinearGradient
            colors={['#58CC02', '#46B700']}
            style={styles.introGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.introContent}>
              <Text style={styles.introTitle}>Your Privacy Matters</Text>
              <Text style={styles.introSubtitle}>
                We're committed to protecting your personal information while helping you master woodworking skills.
              </Text>
              <Text style={styles.lastUpdated}>
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {renderSection(
            "Information We Collect",
            [
              "We collect information you provide directly to us, such as when you create an account, complete your profile, or use our woodworking learning features.",
              "This includes your name, email address, profile picture, learning progress, project submissions, and any content you create within the app."
            ]
          )}

          {renderSubSection(
            "Account Information",
            [
              "• Name and email address for account creation and authentication",
              "• Profile picture (optional) for personalization",
              "• Authentication data from Apple Sign-In or email/password"
            ]
          )}

          {renderSubSection(
            "Learning Data",
            [
              "• Progress through woodworking lessons and courses",
              "• Completed projects and skill assessments",
              "• Time spent learning and practice sessions",
              "• Quiz results and achievement data",
              "• Saved tips and favorite content"
            ]
          )}

          {renderSubSection(
            "Usage Information",
            [
              "• App usage patterns and feature interactions",
              "• Device information (type, operating system, app version)",
              "• Performance data to improve app functionality",
              "• Crash reports and error logs"
            ]
          )}

          {renderSection(
            "How We Use Your Information",
            [
              "We use the information we collect to provide, maintain, and improve our woodworking education services.",
              "This includes personalizing your learning experience, tracking your progress, and providing relevant content recommendations."
            ]
          )}

          {renderSubSection(
            "Service Delivery",
            [
              "• Provide access to woodworking lessons and tutorials",
              "• Track your learning progress and achievements",
              "• Generate personalized study plans and recommendations",
              "• Enable social features like sharing projects"
            ]
          )}

          {renderSubSection(
            "Communication",
            [
              "• Send important updates about the app and your account",
              "• Provide customer support and respond to inquiries",
              "• Send learning reminders and motivational messages (with your consent)",
              "• Share educational content and tips"
            ]
          )}

          {renderSubSection(
            "Improvement and Analytics",
            [
              "• Analyze usage patterns to improve our services",
              "• Develop new features and content",
              "• Conduct research to enhance learning effectiveness",
              "• Ensure app security and prevent fraud"
            ]
          )}

          {renderSection(
            "Information Sharing",
            [
              "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:"
            ]
          )}

          {renderSubSection(
            "Service Providers",
            [
              "We work with trusted third-party services to help us operate our app, including:",
              "• Firebase (Google) for authentication, database, and analytics",
              "• Cloud storage providers for project images and data",
              "• Analytics services to understand app usage",
              "• Customer support platforms"
            ]
          )}

          {renderSubSection(
            "Legal Requirements",
            [
              "We may disclose your information if required by law or to:",
              "• Comply with legal processes or government requests",
              "• Protect our rights, property, or safety",
              "• Prevent fraud or security issues",
              "• Protect the rights and safety of our users"
            ]
          )}

          {renderSection(
            "Data Security",
            [
              "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
              "This includes encryption of data in transit and at rest, secure authentication systems, and regular security audits."
            ]
          )}

          {renderSubSection(
            "Security Measures",
            [
              "• End-to-end encryption for sensitive data",
              "• Secure authentication using industry standards",
              "• Regular security updates and patches",
              "• Access controls and monitoring systems",
              "• Secure data centers with physical security"
            ]
          )}

          {renderSection(
            "Your Rights and Choices",
            [
              "You have control over your personal information and can make choices about how we collect, use, and share it."
            ]
          )}

          {renderSubSection(
            "Access and Control",
            [
              "• View and update your profile information",
              "• Download your data (data portability)",
              "• Delete your account and associated data",
              "• Opt out of marketing communications",
              "• Control notification preferences"
            ]
          )}

          {renderSubSection(
            "Data Retention",
            [
              "We retain your information for as long as your account is active or as needed to provide services. When you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal or business purposes."
            ]
          )}

          {renderSection(
            "Children's Privacy",
            [
              "Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us to have it removed."
            ]
          )}

          {renderSection(
            "International Data Transfers",
            [
              "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable data protection laws."
            ]
          )}

          {renderSection(
            "Changes to This Policy",
            [
              "We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy in the app and updating the 'Last updated' date. Your continued use of the app after any changes constitutes acceptance of the updated policy."
            ]
          )}

          {renderSection(
            "Contact Us",
            [
              "If you have any questions about this privacy policy or our data practices, please contact us at:",
              "",
              "Email: privacy@duoforwoodworking.com",
              "Address: Duo for Woodworking Privacy Team",
              "123 Woodworking Way, Craft City, CC 12345",
              "",
              "We will respond to your inquiry within 30 days."
            ]
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This privacy policy is effective as of the date listed above and applies to all users of the Duo for Woodworking app.
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
    backgroundColor: '#F8F9FA',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#000000',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#666666',
  },
  headerRight: {
    width: 40,
  },
  
  // Intro Section
  introSection: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  introGradient: {
    padding: 24,
  },
  introContent: {
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 24,
    fontFamily: FontFamilies.featherBold,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    opacity: 0.9,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#FFFFFF',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  
  // Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  // Sections
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#2C3E50',
    marginBottom: 16,
    lineHeight: 28,
  },
  
  subSection: {
    marginBottom: 24,
    marginLeft: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginBottom: 12,
    lineHeight: 22,
  },
  
  paragraph: {
    fontSize: 15,
    fontFamily: FontFamilies.dinRounded,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 12,
  },
  
  // Footer
  footer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#58CC02',
  },
  footerText: {
    fontSize: 14,
    fontFamily: FontFamilies.dinRounded,
    color: '#6C757D',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  
  scrollView: {
    flex: 1,
  },
});
