import { Header } from '@/components/ui/Header';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getAIResponse, WoodworkingResponse } from '@/services/aiCoachService';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Send, User } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatMessage extends IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: User;
}

const { width: screenWidth } = Dimensions.get('window');

// Suggested prompts for woodworking
const WOODWORKING_PROMPTS = [
  "How do I make strong dovetail joints?",
  "What's the best way to finish oak?",
  "How do I sharpen chisels properly?",
  "What tools do I need to start woodworking?",
  "How do I prevent wood from warping?",
  "What's the safest way to use a table saw?"
];

export default function CoachScreen() {
  const { appTheme: colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [userId] = useState('demo-user-123'); // In real app, get from auth store
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Animated typing dots
  const TypingDots = ({ color = '#8B4513' }: { color?: string }) => {
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
          backgroundColor: colors?.primary || '#8B4513',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 12,
          maxWidth: screenWidth * 0.75,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        right: {
          backgroundColor: '#E8F5E8',
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 12,
          marginRight: 8,
          maxWidth: screenWidth * 0.75,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
      }}
      textStyle={{
        left: {
          color: '#fff',
          fontSize: 16,
          lineHeight: 24,
          fontWeight: '400',
        },
        right: {
          color: '#2E7D32',
          fontSize: 16,
          lineHeight: 24,
          fontWeight: '500',
        },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.08)',
        paddingHorizontal: 16,
        paddingVertical: 4,
        paddingBottom: Math.max(insets.bottom + 5, 20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 50,
        elevation: 5,
      }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: '#f8f9fa',
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
        borderRadius: 28,
        paddingHorizontal: 20,
        paddingVertical: 12,
        height: 56,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '400',
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
        colors={['#8B4513', '#A0522D']}
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
          <TypingDots color="#8B4513" />
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
        { backgroundColor: isAI ? '#8B4513' : '#E8F5E8' }
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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 34, paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Header 
          backgroundColor={'red'}
          title="AI Coach" 
          subtitle="Your personal woodworking mentor"
          showSafeArea={false}
        />
      </View>

        {/* Suggested Prompts */}
        {showPrompts && (
          <>
            <Text style={styles.promptsTitle}>Quick Start Questions</Text>
            <View style={styles.promptsContainer}>
              {WOODWORKING_PROMPTS.slice(0, 3).map((prompt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.promptChip} 
                  onPress={() => handlePromptPress(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptChipText} numberOfLines={2}>
                    {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
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
            maxComposerHeight={120}
            minComposerHeight={56}
            maxInputLength={500}
            textInputProps={{
              multiline: true,
              returnKeyType: 'send',
              blurOnSubmit: false,
            }}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  promptsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  promptChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promptChipText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  typingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#666',
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
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontWeight: '600',
  },
});
