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

export default function TermsOfServiceScreen() {
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

  const renderNumberedList = (items: string[]) => (
    <View style={styles.numberedList}>
      {items.map((item, index) => (
        <View key={index} style={styles.numberedItem}>
          <Text style={styles.number}>{index + 1}.</Text>
          <Text style={styles.numberedText}>{item}</Text>
        </View>
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <Text style={styles.headerSubtitle}>Your agreement with us</Text>
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
              <Text style={styles.introTitle}>Terms of Service</Text>
              <Text style={styles.introSubtitle}>
                Please read these terms carefully before using Duo for Woodworking. By using our app, you agree to be bound by these terms.
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
            "Acceptance of Terms",
            [
              "By downloading, installing, or using the Duo for Woodworking mobile application ('App'), you agree to be bound by these Terms of Service ('Terms'). If you do not agree to these Terms, please do not use our App.",
              "These Terms constitute a legally binding agreement between you and Duo for Woodworking ('Company', 'we', 'us', or 'our')."
            ]
          )}

          {renderSection(
            "Description of Service",
            [
              "Duo for Woodworking is an educational mobile application designed to teach woodworking skills through interactive lessons, tutorials, and project-based learning.",
              "Our service includes:",
              "• Interactive woodworking lessons and courses",
              "• Step-by-step project tutorials",
              "• Skill assessments and progress tracking",
              "• AI-powered coaching and personalized recommendations",
              "• Community features for sharing projects and tips",
              "• Offline content access for continued learning"
            ]
          )}

          {renderSection(
            "User Accounts and Registration",
            [
              "To access certain features of our App, you must create an account. You agree to:"
            ]
          )}

          {renderSubSection(
            "Account Requirements",
            [
              "• Provide accurate, current, and complete information during registration",
              "• Maintain and update your account information to keep it accurate",
              "• Maintain the security of your password and account",
              "• Accept responsibility for all activities under your account",
              "• Notify us immediately of any unauthorized use of your account"
            ]
          )}

          {renderSubSection(
            "Account Termination",
            [
              "We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion. You may terminate your account at any time by contacting us or using the account deletion feature in the App."
            ]
          )}

          {renderSection(
            "Acceptable Use Policy",
            [
              "You agree to use our App only for lawful purposes and in accordance with these Terms. You agree not to:"
            ]
          )}

          {renderNumberedList([
            "Use the App for any illegal or unauthorized purpose",
            "Violate any laws or regulations in your jurisdiction",
            "Transmit any harmful, threatening, or offensive content",
            "Attempt to gain unauthorized access to our systems or other users' accounts",
            "Interfere with or disrupt the App's functionality",
            "Use automated systems to access the App without permission",
            "Share your account credentials with others",
            "Create multiple accounts to circumvent restrictions",
            "Upload content that infringes on intellectual property rights",
            "Engage in any form of harassment or inappropriate behavior"
          ])}

          {renderSection(
            "Intellectual Property Rights",
            [
              "The App and its original content, features, and functionality are owned by Duo for Woodworking and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."
            ]
          )}

          {renderSubSection(
            "Our Content",
            [
              "• All lesson content, tutorials, and educational materials are proprietary",
              "• Our trademarks, logos, and brand elements are protected",
              "• The App's design, layout, and user interface are copyrighted",
              "• You may not copy, modify, or distribute our content without permission"
            ]
          )}

          {renderSubSection(
            "User-Generated Content",
            [
              "You retain ownership of content you create and share through the App (such as project photos, comments, or tips). However, by sharing content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content in connection with the App's services.",
              "You are responsible for ensuring you have the right to share any content you upload and that it does not violate any third-party rights."
            ]
          )}

          {renderSection(
            "Safety and Educational Content",
            [
              "Our App provides educational content about woodworking, which involves the use of tools and materials that can be dangerous if not handled properly."
            ]
          )}

          {renderSubSection(
            "Safety Disclaimer",
            [
              "• Always follow proper safety procedures when working with tools",
              "• Use appropriate safety equipment (goggles, gloves, etc.)",
              "• Work in a well-ventilated area",
              "• Start with beginner projects and gradually progress",
              "• Seek professional instruction for advanced techniques",
              "• We are not responsible for injuries resulting from woodworking activities"
            ]
          )}

          {renderSubSection(
            "Educational Purpose",
            [
              "The App is designed for educational purposes only. While we strive to provide accurate information, woodworking techniques and safety practices may vary. Always consult additional resources and consider your skill level before attempting any project."
            ]
          )}

          {renderSection(
            "Subscription and Payment Terms",
            [
              "Some features of our App may require a paid subscription. If you purchase a subscription:"
            ]
          )}

          {renderSubSection(
            "Payment and Billing",
            [
              "• Subscription fees are charged in advance",
              "• Payments are processed through your device's app store",
              "• Subscriptions automatically renew unless cancelled",
              "• You can cancel your subscription through your device settings",
              "• Refunds are subject to the policies of your app store"
            ]
          )}

          {renderSubSection(
            "Free Trial",
            [
              "We may offer free trials for premium features. Free trials automatically convert to paid subscriptions unless cancelled before the trial period ends."
            ]
          )}

          {renderSection(
            "Privacy and Data Protection",
            [
              "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our App, you consent to the collection and use of information as described in our Privacy Policy."
            ]
          )}

          {renderSection(
            "Disclaimers and Limitations of Liability",
            [
              "THE APP IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT."
            ]
          )}

          {renderSubSection(
            "Limitation of Liability",
            [
              "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE APP.",
              "OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE APP SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE APP IN THE 12 MONTHS PRECEDING THE CLAIM."
            ]
          )}

          {renderSection(
            "Indemnification",
            [
              "You agree to indemnify, defend, and hold harmless Duo for Woodworking and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising out of or relating to your use of the App or violation of these Terms."
            ]
          )}

          {renderSection(
            "Modifications to Terms",
            [
              "We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms in the App or by other means. Your continued use of the App after such modifications constitutes acceptance of the updated Terms."
            ]
          )}

          {renderSection(
            "Termination",
            [
              "We may terminate or suspend your access to the App immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.",
              "Upon termination, your right to use the App will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination."
            ]
          )}

          {renderSection(
            "Governing Law and Dispute Resolution",
            [
              "These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.",
              "Any disputes arising out of or relating to these Terms or the App shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association."
            ]
          )}

          {renderSection(
            "Severability",
            [
              "If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect."
            ]
          )}

          {renderSection(
            "Entire Agreement",
            [
              "These Terms, together with our Privacy Policy, constitute the entire agreement between you and Duo for Woodworking regarding the use of the App and supersede all prior agreements and understandings."
            ]
          )}

          {renderSection(
            "Contact Information",
            [
              "If you have any questions about these Terms of Service, please contact us at:",
              "",
              "Email: legal@duoforwoodworking.com",
              "Address: Duo for Woodworking Legal Team",
              "123 Woodworking Way, Craft City, CC 12345",
              "",
              "We will respond to your inquiry within 30 days."
            ]
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using Duo for Woodworking, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  
  // Numbered Lists
  numberedList: {
    marginLeft: 16,
    marginBottom: 16,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  number: {
    fontSize: 15,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginRight: 8,
    minWidth: 20,
  },
  numberedText: {
    fontSize: 15,
    fontFamily: FontFamilies.dinRounded,
    color: '#495057',
    lineHeight: 24,
    flex: 1,
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
