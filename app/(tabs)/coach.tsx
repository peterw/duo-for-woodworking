import { Header } from '@/components/ui/Header';
import { FontFamilies } from '@/hooks/AppFonts';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAIResponse, WoodworkingResponse } from '@/services/aiCoachService';
import { useAuthStore } from '@/stores';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Send, User } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatMessage extends IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: User;
}

const { width: screenWidth } = Dimensions.get('window');

// Enhanced suggested prompts organized by category
const WOODWORKING_PROMPTS = {
  tools: [
    "How do I sharpen chisels properly?",
    "What's the best circular saw for beginners?",
    "How do I maintain my hand planes?",
    "What measuring tools do I need?"
  ],
  techniques: [
    "How do I make strong dovetail joints?",
    "What's the best way to cut perfect miters?",
    "How do I prevent tear-out when planing?",
    "What's the safest way to use a table saw?"
  ],
  materials: [
    "What's the best way to finish oak?",
    "How do I prevent wood from warping?",
    "What glue should I use for outdoor projects?",
    "How do I choose the right wood for my project?"
  ],
  safety: [
    "What safety equipment do I need?",
    "How do I set up a safe workshop?",
    "What are the most common woodworking accidents?",
    "How do I handle toxic wood dust?"
  ]
};

export default function CoachScreen() {
  const { appTheme: colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('tools');
  const { user } = useAuthStore();
  const userId = user?.uid || 'demo-user-123';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Check for pre-filled question from navigation
  useEffect(() => {
    if (params.question && typeof params.question === 'string') {
      const preFilledQuestion = params.question;
      setShowPrompts(false);
      
      // Add the pre-filled question as a user message
      const userMessage: ChatMessage = {
        _id: Date.now().toString(),
        text: preFilledQuestion,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'You',
          avatar: '👤',
        },
      };
      
      setMessages([userMessage]);
      
      // Automatically get AI response
      handlePreFilledQuestion(preFilledQuestion);
    }
  }, [params.question]);

  const handlePreFilledQuestion = async (question: string) => {
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      const aiResponse: WoodworkingResponse = await getAIResponse(question, userId);
      
      const aiMessage: ChatMessage = {
        _id: Date.now().toString(),
        text: aiResponse.response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Coach',
          avatar: '🤖',
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
    } catch (error) {
      console.error('Error getting AI response for pre-filled question:', error);
      
      const fallbackMessage: ChatMessage = {
        _id: Date.now().toString(),
        text: "I'm here to help with your woodworking questions! I can assist with techniques, tools, projects, materials, safety, and finishing. What specific aspect of woodworking would you like to learn about?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Coach',
          avatar: '🤖',
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [fallbackMessage]));
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Animated typing dots
  const TypingDots = ({ color = '#FF6B35' }: { color?: string }) => {
    const d1 = useRef(new Animated.Value(0.3)).current;
    const d2 = useRef(new Animated.Value(0.3)).current;
    const d3 = useRef(new Animated.Value(0.3)).current;
    
    useEffect(() => {
      const loop = (dot: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          ])
        ).start();
      
      loop(d1, 0); 
      loop(d2, 120); 
      loop(d3, 240);
      
      return () => { 
        d1.stopAnimation(); 
        d2.stopAnimation(); 
        d3.stopAnimation(); 
      };
    }, [d1, d2, d3]);
    
    const Dot = ({ v }: { v: Animated.Value }) => (
      <Animated.View style={{ 
        opacity: v, 
        width: 6, 
        height: 6, 
        borderRadius: 3, 
        backgroundColor: color, 
        marginHorizontal: 2 
      }} />
    );
    
    return (
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 6, 
        paddingHorizontal: 8 
      }}>
        <Dot v={d1} />
        <Dot v={d2} />
        <Dot v={d3} />
      </View>
    );
  };

  useEffect(() => {
    // Animate welcome message
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handlePromptPress = (prompt: string) => {
    setShowPrompts(false);
    onSend([
      {
        _id: Date.now().toString(),
        text: prompt,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'You',
          avatar: '👤',
        },
      },
    ]);
  };

  const onSend = useCallback(async (newMessages: ChatMessage[] = []) => {
    if (!newMessages.length || isLoading) return;
    
    setShowPrompts(false);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    
    const userMessage = newMessages[0];
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      // Get AI response using the professional service
      const aiResponse: WoodworkingResponse = await getAIResponse(
        userMessage.text,
        userId
      );
      
      const aiMessage: ChatMessage = {
        _id: Date.now().toString(),
        text: aiResponse.response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Coach',
          avatar: '🤖',
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Show user-friendly error message
      Alert.alert(
        'Connection Error',
        'I\'m having trouble connecting right now. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        _id: Date.now().toString(),
        text: "I'm here to help with your woodworking questions! I can assist with techniques, tools, projects, materials, safety, and finishing. What specific aspect of woodworking would you like to learn about?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Coach',
          avatar: '🤖',
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [fallbackMessage]));
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#FF6B35',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 16,
          maxWidth: screenWidth * 0.75,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 2,
          borderColor: '#FF6B35',
        },
        right: {
          backgroundColor: '#58CC02',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 16,
          marginRight: 8,
          maxWidth: screenWidth * 0.75,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 2,
          borderColor: '#58CC02',
        },
      }}
      textStyle={{
        left: {
          color: '#fff',
          fontSize: 16,
          lineHeight: 24,
          fontFamily: FontFamilies.dinRounded,
          fontWeight: '500',
        },
        right: {
          color: '#ffffff',
          fontSize: 16,
          lineHeight: 24,
          fontFamily: FontFamilies.dinRounded,
          fontWeight: '500',
        },
      }}
      timeTextStyle={{
        left: {
          color: '#E0E0E0',
          fontSize: 12,
          fontFamily: FontFamilies.dinRounded,
          fontWeight: '400',
        },
        right: {
          color: '#81C784',
          fontSize: 12,
          fontFamily: FontFamilies.dinRounded,
          fontWeight: '400',
        },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopWidth: 2,
        borderTopColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: Math.max(insets.bottom + 8, 24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 8,
      }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderRadius: 28,
        paddingHorizontal: 20,
        paddingVertical: 14,
        minHeight: 56,
        maxHeight: 56,
        fontSize: 16,
        lineHeight: 20,
        fontFamily: FontFamilies.dinRounded,
        color: '#333',
      }}
      placeholder="Ask me about woodworking techniques, tools, or projects..."
      placeholderTextColor="#999"
    />
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      containerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 12,
      }}
    >
      <LinearGradient
        colors={['#58CC02', '#46a102']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.sendButton}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </LinearGradient>
    </Send>
  );

  const renderFooter = () => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <TypingDots color="#FF6B35" />
          <Text style={styles.typingText}>AI Coach is thinking...</Text>
        </View>
      </View>
    );
  };

  const renderAvatar = (props: any) => {
    const isAI = props.currentMessage?.user._id === 2;
    return (
      <View style={[
        styles.avatar,
        { 
          backgroundColor: isAI ? '#FF6B35' : '#E8F5E8',
          borderWidth: 2,
          borderColor: isAI ? '#A0522D' : '#C8E6C9',
        }
      ]}>
        <Text style={[
          styles.avatarText,
          { color: isAI ? '#fff' : '#2E7D32' }
        ]}>
          {props.currentMessage?.user.avatar}
        </Text>
      </View>
    );
  };

  const renderPromptCategories = () => (
    <View style={styles.promptsSection}>
      <Text style={styles.promptsTitle}>Quick Start Questions</Text>
      
      {/* Category Tabs - Now Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryTabsContainer}
        style={styles.categoryTabsScrollView}
      >
        {Object.keys(WOODWORKING_PROMPTS).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.categoryTabActive
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category && styles.categoryTabTextActive
            ]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Prompts Grid */}
      <View style={styles.promptsGrid}>
        {WOODWORKING_PROMPTS[selectedCategory as keyof typeof WOODWORKING_PROMPTS].map((prompt, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.promptChip} 
            onPress={() => handlePromptPress(prompt)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#fff', '#f8f9fa']}
              style={styles.promptChipGradient}
            >
              <Text style={styles.promptChipText} numberOfLines={2}>
                {prompt}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 34, paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Header 
          title="AI Coach" 
          subtitle="Your personal woodworking mentor"
          showSafeArea={false}
        />
      </View>

      {/* Enhanced Suggested Prompts */}
      {showPrompts && renderPromptCategories()}
        
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
            name: 'You',
            avatar: '👤',
          }}
          renderAvatarOnTop
          showUserAvatar
          alwaysShowSend
          infiniteScroll
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderFooter={renderFooter}
          renderAvatar={renderAvatar}
          placeholder="Ask me about woodworking..."
          maxComposerHeight={56}
          minComposerHeight={56}
          maxInputLength={500}
          textInputProps={{
            multiline: false,
            returnKeyType: 'send',
            blurOnSubmit: true,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44, // Status bar height
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerContainer: {
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  promptsTitle: {
    fontSize: 20,
    fontFamily: FontFamilies.featherBold,
    color: '#58CC02',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  promptsSection: {
    marginBottom: 20,
  },
  categoryTabsScrollView: {
    marginBottom: 16,
  },
  categoryTabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryTabActive: {
    backgroundColor: '#58CC02',
    borderColor: '#58CC02',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTabText: {
    color: '#666',
    fontSize: 14,
    fontFamily: FontFamilies.featherBold,
    textTransform: 'capitalize',
  },
  categoryTabTextActive: {
    color: '#fff',
  },
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptChip: {
    width: '48%', // Two columns
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  promptChipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  promptChipText: {
    color: '#333',
    fontSize: 13,
    fontFamily: FontFamilies.dinRounded,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  typingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  typingBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    maxWidth: 240,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  typingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#666',
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '500',
  },
  sendButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
 
    minWidth: 80,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FontFamilies.dinRounded,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: FontFamilies.dinRounded,
    fontWeight: '600',
  },
});
