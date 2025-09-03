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

// Now using Firebase data from useUserProgressStore

export default function OfflineContentManager({ onClose }: OfflineContentManagerProps) {
  const colorScheme = useColorScheme();
  const { 
    offlineBundles, 
    isDownloading, 
    downloadProjectBundle, 
    removeOfflineBundle,
    isProjectOffline,
    projects
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
          
          {(projects || []).map(renderProjectItem)}
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
