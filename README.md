# Wood Craft - Duolingo for Woodworking

A comprehensive woodworking learning app that teaches essential skills through guided lessons, project-based learning, and gamified progression - inspired by TedsWoodworking's approach to making woodworking accessible to everyone.

## 🎯 App Overview

Wood Craft transforms complex woodworking projects into bite-sized, learnable lessons. Just like Duolingo breaks down language learning into digestible chunks, this app breaks down woodworking into atomic skills that build upon each other.

## ✨ Key Features

### 🧠 **Guided Skill Tree**
- **Prerequisite-based progression** - Skills unlock only after completing required prerequisites
- **Atomic skill breakdown** - Each skill has 3-7 micro-steps with clear success criteria
- **Visual skill connections** - See how skills relate and build upon each other
- **XP rewards** - Earn experience points for completing skills and advancing levels

### 🛠️ **Project Slicer**
- **Lesson slices** - Projects broken into 10-14 manageable lesson chunks
- **Step-by-step guidance** - Each slice includes detailed steps, materials, and tools
- **Success criteria** - Clear checkpoints to ensure proper completion
- **Photo verification** - Submit photos for feedback on critical steps

### 🤖 **AI Coach Integration**
- **Personalized tips** - Context-aware woodworking advice
- **Safety reminders** - Proactive safety guidance based on current project
- **Technique suggestions** - Real-time improvement recommendations
- **Motivational support** - Encouragement and progress tracking

### 📱 **Core App Screens**

#### 1. **Home Screen**
- Daily streak tracking (GitHub-style contribution graph)
- XP and leveling system
- Daily goals and quick lessons
- AI Coach tips and guidance
- Progress overview and achievements

#### 2. **Learn Screen**
- Interactive skill tree with prerequisites
- Skill details and micro-steps
- Progress tracking and completion status
- Visual skill connections and pathways

#### 3. **Projects Screen**
- Project categories (Furniture, Decorative, Outdoor, etc.)
- Skill-based project unlocking
- Materials and tools requirements
- Lesson slice previews

#### 4. **Profile Screen**
- Comprehensive progress statistics
- Achievement system
- Settings and preferences
- Learning analytics

## 🎓 **Learning Methodology**

### **Skill Progression**
1. **Safety First** - Essential safety practices and PPE
2. **Basic Techniques** - Measuring, marking, and fundamental cuts
3. **Tool Mastery** - Hand tools and power tool safety
4. **Joinery Skills** - From simple butt joints to advanced dovetails
5. **Finishing Techniques** - Sanding, staining, and protective coatings

### **Project-Based Learning**
- **Beginner Track** - Simple projects with "no power tools" variants
- **Intermediate Projects** - Furniture and decorative items
- **Advanced Techniques** - Complex joinery and artistic pieces
- **Community Challenges** - Weekly projects with shared galleries

## 🚀 **MVP Features for TestFlight**

### **Phase 1: Core Functionality** ✅
- [x] Complete onboarding flow
- [x] Skill tree with prerequisites
- [x] Project categorization and filtering
- [x] Streak system and XP tracking
- [x] Basic AI Coach tips

### **Phase 2: Enhanced Learning** 🔄
- [x] Lesson slice breakdown
- [x] Photo verification system
- [x] Success criteria tracking
- [x] Progress analytics
- [x] Achievement system

### **Phase 3: Advanced Features** 📋
- [ ] AR overlays for marking and measuring
- [ ] Vision-based accuracy detection
- [ ] Live Activities for glue-up timers
- [ ] Pre-flight safety checks
- [ ] Community project sharing

## 🛠️ **Technical Implementation**

### **Architecture**
- **React Native + Expo** - Cross-platform mobile development
- **Zustand** - State management with persistence
- **MMKV Storage** - Fast local data storage
- **TypeScript** - Type-safe development

### **State Management**
- **User Progress Store** - Skills, projects, XP, and streaks
- **App Store** - Settings and preferences
- **Auth Store** - User authentication and profiles
- **Onboarding Store** - User setup and preferences

### **Components**
- **Custom Bottom Tab Bar** - Native iOS/Android tab navigation
- **AI Coach** - Intelligent woodworking guidance
- **Lesson Slice** - Project breakdown and step tracking
- **Skill Tree** - Visual skill progression interface

## 📱 **User Experience**

### **Gamification Elements**
- **Streak System** - Daily login rewards and motivation
- **XP Progression** - Level-based advancement system
- **Achievement Badges** - Milestone recognition
- **Progress Visualization** - Clear advancement indicators

### **Accessibility Features**
- **Haptic Feedback** - Tactile response for interactions
- **Dark Mode Support** - Comfortable viewing in any lighting
- **Responsive Design** - Optimized for all screen sizes
- **Offline Support** - Content available without internet

## 🎨 **Design Philosophy**

### **Visual Identity**
- **Wood-inspired Color Palette** - Browns, tans, and natural tones
- **Modern UI Components** - Clean, intuitive interface design
- **Consistent Iconography** - SF Symbols for iOS consistency
- **Smooth Animations** - Engaging micro-interactions

### **User Interface**
- **Card-based Layout** - Easy-to-scan information hierarchy
- **Progressive Disclosure** - Show details on demand
- **Visual Feedback** - Clear status indicators and progress
- **Intuitive Navigation** - Logical flow between screens

## 🔮 **Future Roadmap**

### **Short Term (3-6 months)**
- Enhanced AI coaching with machine learning
- Video lesson integration
- Social features and community building
- Advanced project templates

### **Medium Term (6-12 months)**
- AR measurement and marking tools
- Computer vision for quality assessment
- Integration with woodworking suppliers
- Advanced analytics and insights

### **Long Term (12+ months)**
- VR workshop simulation
- AI-powered project customization
- Marketplace for user-created content
- Professional certification pathways

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator
- Xcode (for iOS development)

### **Installation**
```bash
# Clone the repository
git clone [repository-url]
cd duo-for-woodworking

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### **Environment Setup**
- Configure Expo development environment
- Set up iOS/Android development tools
- Configure app signing and provisioning

## 📊 **Analytics & Metrics**

### **User Engagement**
- Daily active users and retention
- Skill completion rates
- Project success rates
- Streak maintenance statistics

### **Learning Effectiveness**
- Time to skill mastery
- Project completion rates
- User satisfaction scores
- Knowledge retention metrics

## 🤝 **Contributing**

This app is designed as an MVP for TestFlight testing. Future contributions will focus on:
- Enhanced AI coaching algorithms
- Additional project templates
- Community features
- Performance optimizations

## 📄 **License**

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for woodworkers everywhere**

Transform your woodworking journey from overwhelming to achievable, one skill at a time.
