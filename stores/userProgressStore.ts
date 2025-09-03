import { getLessonContent as firestoreGetLessonContent, firestoreService, getCategories, getProjects, getSkills, updateUserLessonProgress } from '@/services/firestoreService';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { zuStandStorage } from './mmkvStorage';


interface Skill {
  id: string;
  title: string;
  description: string;
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  icon: string;
  prerequisites: string[];
  microSteps: string[];
  xpReward: number;
  category: 'safety' | 'tools' | 'techniques' | 'joinery' | 'finishing' | 'design';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  materials: string[];
  tools: string[];
  skills: string[];
  lessonSlices: LessonSlice[];
  image: string;
  category: string;
  materialCost?: 'Low' | 'Medium' | 'High';
  timeRange?: {
    min: number;
    max: number;
  };
  xpReward?: number;
  color?: string;
  icon?: string;
  cutList?: CutListItem[];
}

interface LessonSlice {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'cutting' | 'assembly' | 'finishing' | 'safety' | 'planning';
  steps: string[];
  successCriteria: string[];
  photoCheckRequired: boolean;
  isCompleted?: boolean;
  completedPhotos?: string[];
  cutList?: CutListItem[];
  materials?: MaterialItem[];
  tools?: ToolItem[];
}

// New interfaces for enhanced project management
interface CutListItem {
  id: string;
  name: string;
  quantity: number;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  material: string;
  grainDirection?: 'with' | 'against' | 'cross';
  notes?: string;
  isCut?: boolean;
  stockLength?: number;
  waste?: number;
}

interface MaterialItem {
  id: string;
  name: string;
  type: 'wood' | 'hardware' | 'finish' | 'adhesive';
  quantity: number;
  unit: string;
  specifications?: string;
  alternatives?: string[];
  supplier?: string;
  cost?: number;
}

interface ToolItem {
  id: string;
  name: string;
  type: 'hand' | 'power' | 'measuring' | 'safety';
  required: boolean;
  alternatives?: string[];
  safetyNotes?: string;
  maintenanceTips?: string;
}

interface ProjectPlan {
  id: string;
  projectId: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  materials: MaterialItem[];
  tools: ToolItem[];
  cutList: CutListItem[];
  lessonSlices: LessonSlice[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSlice {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'cutting' | 'assembly' | 'finishing' | 'safety' | 'planning';
  duration: string;
  steps: string[];
  successCriteria: string[];
  photoCheckRequired: boolean;
  cutList: CutListItem[];
  materials: MaterialItem[];
  tools: ToolItem[];
  isCompleted: boolean;
  completedPhotos: string[];
  notes: string;
  order: number;
}

interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  totalProjects: number;
  skillsCompleted: number;
  dailyGoals: {
    practice: boolean;
    skill: boolean;
    project: boolean;
  };
  completedSkills: string[];
  completedProjects: string[];
  lastLoginDate: string;
}

interface OfflineBundle {
  id: string;
  projectId: string;
  title: string;
  description: string;
  size: number; // in MB
  downloadProgress: number;
  isDownloaded: boolean;
  lastUpdated: Date;
  content: {
    projectPlan: ProjectPlan;
    lessonSlices: ProjectSlice[];
    cutLists: CutListItem[];
    materials: MaterialItem[];
    tools: ToolItem[];
    images: string[];
  };
}

interface UserProgressStore extends UserProgress {
  // Actions
  checkDailyLogin: () => void;
  completeDailyGoal: (goalId: keyof UserProgress['dailyGoals']) => void;
  unlockSkill: (skillId: string) => void;
  completeSkill: (skillId: string) => void;
  completeProject: (projectId: string) => void;
  addXP: (amount: number) => void;
  resetProgress: () => void;
  
  // New project management actions
  createProjectPlan: (project: Project, customizations?: any) => ProjectPlan;
  sliceProjectIntoLessons: (projectPlan: ProjectPlan) => ProjectSlice[];
  optimizeCutList: (cutList: CutListItem[], stockLengths: number[]) => CutListItem[];
  completeLessonSlice: (sliceId: string, photos?: string[], notes?: string) => void;
  updateProjectProgress: (projectId: string, progress: any) => void;
  
  // Offline content management
  downloadProjectBundle: (projectId: string) => Promise<void>;
  removeOfflineBundle: (bundleId: string) => void;
  getOfflineBundles: () => OfflineBundle[];
  isProjectOffline: (projectId: string) => boolean;
  
  // State for project management
  currentProjectPlan?: ProjectPlan;
  projectSlices: ProjectSlice[];
  activeProjectId?: string;

  // State for offline content
  offlineBundles: OfflineBundle[];
  isDownloading: boolean;
  
  // New Firestore data state and actions
  skills: Skill[];
  projects: Project[];
  categories: any[];
  lessonContent: any[];
  isLoading: boolean;
  fetchSkills: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchLessonContent: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  getLessonContent: (skillId: string) => Promise<any | null>;
  updateLessonProgress: (skillId: string, progress: any) => Promise<void>;
}

// Enhanced woodworking skills based on TedsWoodworking approach
const woodworkingSkills: Skill[] = [
  {
    id: 'safety-basics',
    title: 'Safety Fundamentals',
    description: 'Essential safety practices for woodworking',
    level: 1,
    isUnlocked: true,
    isCompleted: false,
    icon: 'shield.fill',
    prerequisites: [],
    microSteps: [
      'PPE requirements and usage',
      'Workspace safety setup',
      'Tool safety basics',
      'Emergency procedures',
      'Dust management'
    ],
    xpReward: 100,
    category: 'safety'
  },
  {
    id: 'measuring-marking',
    title: 'Measuring & Marking',
    description: 'Precision measuring and layout techniques',
    level: 1,
    isUnlocked: true,
    isCompleted: false,
    icon: 'ruler.fill',
    prerequisites: ['safety-basics'],
    microSteps: [
      'Tape measure reading',
      'Square usage and checking',
      'Marking tools and techniques',
      'Layout planning',
      'Cutting line accuracy'
    ],
    xpReward: 150,
    category: 'techniques'
  },
  {
    id: 'hand-sawing',
    title: 'Hand Sawing',
    description: 'Master basic hand saw techniques',
    level: 1,
    isUnlocked: false,
    isCompleted: false,
    icon: 'scissors',
    prerequisites: ['safety-basics', 'measuring-marking'],
    microSteps: [
      'Saw selection and setup',
      'Proper grip and stance',
      'Cutting straight lines',
      'Cross-cutting techniques',
      'Rip-cutting techniques'
    ],
    xpReward: 200,
    category: 'techniques'
  },
  {
    id: 'chiseling',
    title: 'Chiseling Basics',
    description: 'Learn chisel safety and techniques',
    level: 2,
    isUnlocked: false,
    isCompleted: false,
    icon: 'hand.raised.fill',
    prerequisites: ['safety-basics', 'measuring-marking'],
    microSteps: [
      'Chisel types and selection',
      'Sharpening and maintenance',
      'Safe chiseling techniques',
      'Mortise cutting',
      'Clean-up techniques'
    ],
    xpReward: 250,
    category: 'techniques'
  },
  {
    id: 'basic-joinery',
    title: 'Basic Joinery',
    description: 'Simple wood joining methods',
    level: 2,
    isUnlocked: false,
    isCompleted: false,
    icon: 'link',
    prerequisites: ['hand-sawing', 'chiseling'],
    microSteps: [
      'Butt joint basics',
      'Lap joint techniques',
      'Simple dado joints',
      'Glue application',
      'Clamping strategies'
    ],
    xpReward: 300,
    category: 'joinery'
  },
  {
    id: 'sanding-finishing',
    title: 'Sanding & Finishing',
    description: 'Surface preparation and finishing',
    level: 2,
    isUnlocked: false,
    isCompleted: false,
    icon: 'hand.raised.fill',
    prerequisites: ['basic-joinery'],
    microSteps: [
      'Sandpaper selection',
      'Sanding techniques',
      'Surface preparation',
      'Oil finishes',
      'Protective coatings'
    ],
    xpReward: 250,
    category: 'finishing'
  },
  {
    id: 'power-tools-intro',
    title: 'Power Tools Introduction',
    description: 'Safe power tool operation',
    level: 3,
    isUnlocked: false,
    isCompleted: false,
    icon: 'bolt.fill',
    prerequisites: ['safety-basics', 'measuring-marking'],
    microSteps: [
      'Drill operation',
      'Circular saw basics',
      'Router safety',
      'Jigsaw techniques',
      'Power tool maintenance'
    ],
    xpReward: 400,
    category: 'tools'
  },
  {
    id: 'advanced-joinery',
    title: 'Advanced Joinery',
    description: 'Complex wood joining techniques',
    level: 3,
    isUnlocked: false,
    isCompleted: false,
    icon: 'link.badge.plus',
    prerequisites: ['basic-joinery', 'power-tools-intro'],
    microSteps: [
      'Dovetail joints',
      'Mortise and tenon',
      'Finger joints',
      'Complex assemblies',
      'Joint reinforcement'
    ],
    xpReward: 500,
    category: 'joinery'
  }
];

// Sample projects with lesson slices
const woodworkingProjects: Project[] = [
  {
    id: 'cutting-board',
    title: 'Simple Cutting Board',
    description: 'A beautiful and functional cutting board perfect for beginners',
    difficulty: 'Beginner',
    estimatedTime: '2-3 hours',
    materials: ['Hardwood (maple, walnut)', 'Food-safe oil', 'Sandpaper'],
    tools: ['Hand saw', 'Chisel', 'Sandpaper', 'Clamps'],
    skills: ['safety-basics', 'measuring-marking', 'hand-sawing', 'sanding-finishing'],
    category: 'kitchen',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    lessonSlices: [
      {
        id: 'cb-planning',
        title: 'Planning & Design',
        description: 'Plan your cutting board dimensions and design',
        duration: '15 min',
        type: 'planning',
        steps: [
          'Choose wood species',
          'Determine dimensions',
          'Sketch design',
          'Calculate materials needed'
        ],
        successCriteria: ['Design sketched', 'Materials calculated', 'Dimensions finalized'],
        photoCheckRequired: false
      },
      {
        id: 'cb-cutting',
        title: 'Cutting & Shaping',
        description: 'Cut wood to size and shape the board',
        duration: '45 min',
        type: 'cutting',
        steps: [
          'Mark cutting lines',
          'Cut to rough size',
          'Shape edges',
          'Check dimensions'
        ],
        successCriteria: ['Board cut to size', 'Edges shaped', 'Dimensions accurate'],
        photoCheckRequired: true
      },
      {
        id: 'cb-sanding',
        title: 'Sanding & Finishing',
        description: 'Sand surfaces and apply food-safe finish',
        duration: '30 min',
        type: 'finishing',
        steps: [
          'Start with coarse sandpaper',
          'Progress to fine grit',
          'Apply food-safe oil',
          'Let dry completely'
        ],
        successCriteria: ['Surfaces smooth', 'Oil applied evenly', 'No rough spots'],
        photoCheckRequired: true
      }
    ]
  },
  {
    id: 'birdhouse',
    title: 'Classic Birdhouse',
    description: 'Attract birds to your garden with this charming birdhouse',
    difficulty: 'Beginner',
    estimatedTime: '3-4 hours',
    materials: ['Cedar or pine', 'Wood glue', 'Nails', 'Paint'],
    tools: ['Hand saw', 'Hammer', 'Drill', 'Sandpaper'],
    skills: ['safety-basics', 'measuring-marking', 'hand-sawing', 'basic-joinery'],
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    lessonSlices: [
      {
        id: 'bh-design',
        title: 'Design & Planning',
        description: 'Plan your birdhouse design and cut list',
        duration: '20 min',
        type: 'planning',
        steps: [
          'Choose birdhouse style',
          'Create cut list',
          'Mark wood pieces',
          'Plan assembly order'
        ],
        successCriteria: ['Design chosen', 'Cut list complete', 'Assembly planned'],
        photoCheckRequired: false
      },
      {
        id: 'bh-cutting',
        title: 'Cutting Pieces',
        description: 'Cut all wood pieces to size',
        duration: '60 min',
        type: 'cutting',
        steps: [
          'Cut front and back panels',
          'Cut side panels',
          'Cut roof pieces',
          'Cut entrance hole'
        ],
        successCriteria: ['All pieces cut', 'Dimensions accurate', 'Holes drilled'],
        photoCheckRequired: true
      },
      {
        id: 'bh-assembly',
        title: 'Assembly',
        description: 'Assemble the birdhouse using glue and nails',
        duration: '45 min',
        type: 'assembly',
        steps: [
          'Glue side panels',
          'Attach front and back',
          'Install roof',
          'Add mounting bracket'
        ],
        successCriteria: ['Structure assembled', 'Joints secure', 'Roof attached'],
        photoCheckRequired: true
      }
    ]
  }
];

export const useUserProgressStore = create<UserProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStreak: 0,
      longestStreak: 0,
      totalXP: 0,
      level: 1,
      totalProjects: 0,
      skillsCompleted: 0,
      dailyGoals: {
        practice: false,
        skill: false,
        project: false,
      },
      completedSkills: [],
      completedProjects: [],
      lastLoginDate: '',
      
      // New project management state
      currentProjectPlan: undefined,
      projectSlices: [],
      activeProjectId: undefined,

      // Offline content state
      offlineBundles: [],
      isDownloading: false,
      
      // New Firestore data state
      skills: [],
      projects: [],
      categories: [],
      lessonContent: [],
      isLoading: false,

      // Actions
      checkDailyLogin: async () => {
        const today = new Date().toDateString();
        const { lastLoginDate, currentStreak, longestStreak } = get();
        
        if (lastLoginDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const isConsecutive = lastLoginDate === yesterday.toDateString();
          
          let newCurrentStreak: number;
          let newLongestStreak: number;
          
          if (isConsecutive) {
            newCurrentStreak = currentStreak + 1;
            newLongestStreak = Math.max(newCurrentStreak, longestStreak);
          } else {
            newCurrentStreak = 1;
            newLongestStreak = longestStreak;
          }

          // Update local state
          set({
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            lastLoginDate: today,
            dailyGoals: {
              practice: false,
              skill: false,
              project: false,
            }
          });

          // Sync with Firestore if user is authenticated
          try {
            const { user } = useAuthStore.getState();
            if (user?.uid) {
              await firestoreService.updateUserProgress(user.uid, {
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak,
                dailyGoals: {
                  practice: false,
                  skill: false,
                  project: false,
                },
              });
            }
          } catch (error) {
            console.error('Error syncing progress with Firestore:', error);
          }
        }
      },

      completeDailyGoal: async (goalId) => {
        const { dailyGoals, totalXP } = get();
        const xpReward = 25;
        const newTotalXP = totalXP + xpReward;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        
        set({
          dailyGoals: {
            ...dailyGoals,
            [goalId]: true,
          },
          totalXP: newTotalXP,
          level: newLevel > get().level ? newLevel : get().level,
        });
        
        // Sync with Firestore if user is authenticated
        try {
          const { user } = useAuthStore.getState();
          if (user?.uid) {
            await firestoreService.updateUserProgress(user.uid, {
              dailyGoals: {
                ...dailyGoals,
                [goalId]: true,
              },
              totalXP: newTotalXP,
              level: newLevel > get().level ? newLevel : get().level,
            });
          }
        } catch (error) {
          console.error('Error syncing progress with Firestore:', error);
        }
      },

      unlockSkill: (skillId) => {
        const { completedSkills } = get();
        if (!completedSkills.includes(skillId)) {
          set({
            completedSkills: [...completedSkills, skillId],
          });
        }
      },

      completeSkill: async (skillId) => {
        console.log('🎯 completeSkill called with:', skillId);
        
        // Special handling for START section
        if (skillId === 'start') {
          console.log('🌟 Handling START section completion');
          const { completedSkills } = get();
          
          // Check if already completed to avoid duplicates
          if (!completedSkills.includes('start')) {
            console.log('✅ Adding start to completedSkills');
            set({
              completedSkills: [...completedSkills, 'start'],
            });

            // Sync with Firestore if user is authenticated
            try {
              const { user } = useAuthStore.getState();
              if (user?.uid) {
                await firestoreService.updateUserProgress(user.uid, {
                  completedSkills: [...completedSkills, 'start'],
                });
                console.log('✅ Synced START completion to Firestore');
              }
            } catch (error) {
              console.error('Error syncing START completion with Firestore:', error);
            }
          } else {
            console.log('⚠️ START already completed, skipping');
          }
          return;
        }
        
        // Regular skill completion logic
        const skill = woodworkingSkills.find(s => s.id === skillId);
        if (skill) {
          console.log('🎯 Completing regular skill:', skill.title);
          const { totalXP, skillsCompleted, completedSkills } = get();
          const newTotalXP = totalXP + skill.xpReward;
          const newLevel = Math.floor(newTotalXP / 500) + 1;
          
          set({
            totalXP: newTotalXP,
            skillsCompleted: skillsCompleted + 1,
            level: newLevel,
            completedSkills: [...completedSkills, skillId],
          });

          // Sync with Firestore if user is authenticated
          try {
            const { user } = useAuthStore.getState();
            if (user?.uid) {
              await firestoreService.updateUserProgress(user.uid, {
                totalXP: newTotalXP,
                skillsCompleted: skillsCompleted + 1,
                level: newLevel,
                completedSkills: [...completedSkills, skillId],
              });
            }
          } catch (error) {
            console.error('Error syncing progress with Firestore:', error);
          }
        } else {
          console.log('❌ Skill not found in woodworkingSkills:', skillId);
        }
      },

      completeProject: async (projectId) => {
        const { totalProjects, totalXP } = get();
        const projectXP = 200;
        const newTotalXP = totalXP + projectXP;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        
        set({
          totalProjects: totalProjects + 1,
          totalXP: newTotalXP,
          level: newLevel,
        });

        // Sync with Firestore if user is authenticated
        try {
          const { user } = useAuthStore.getState();
          if (user?.uid) {
            await firestoreService.updateUserProgress(user.uid, {
              totalProjects: totalProjects + 1,
              totalXP: newTotalXP,
              level: newLevel,
            });
          }
        } catch (error) {
          console.error('Error syncing progress with Firestore:', error);
        }
      },

      addXP: async (amount) => {
        const { totalXP } = get();
        const newTotalXP = totalXP + amount;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        
        set({
          totalXP: newTotalXP,
          level: newLevel,
        });

        // Sync with Firestore if user is authenticated
        try {
          const { user } = useAuthStore.getState();
          if (user?.uid) {
            await firestoreService.updateUserProgress(user.uid, {
              totalXP: newTotalXP,
              level: newLevel,
            });
          }
        } catch (error) {
          console.error('Error syncing progress with Firestore:', error);
        }
      },

      resetProgress: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          totalXP: 0,
          level: 1,
          totalProjects: 0,
          skillsCompleted: 0,
          dailyGoals: {
            practice: false,
            skill: false,
            project: false,
          },
          completedSkills: [],
          completedProjects: [],
          lastLoginDate: '',
          currentProjectPlan: undefined,
          projectSlices: [],
          activeProjectId: undefined,
          offlineBundles: [],
          isDownloading: false,
        });
      },

      // New project management actions
      createProjectPlan: (project: Project, customizations?: any) => {
        const projectPlan: ProjectPlan = {
          id: `plan-${project.id}-${Date.now()}`,
          projectId: project.id,
          title: project.title,
          description: project.description,
          estimatedTime: project.estimatedTime,
          difficulty: project.difficulty,
          materials: project.materials.map((material, index) => ({
            id: `mat-${index}`,
            name: material,
            type: 'wood',
            quantity: 1,
            unit: 'piece',
          })),
          tools: project.tools.map((tool, index) => ({
            id: `tool-${index}`,
            name: tool,
            type: 'hand',
            required: true,
          })),
          cutList: [],
          lessonSlices: project.lessonSlices,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set({ currentProjectPlan: projectPlan, activeProjectId: project.id });
        return projectPlan;
      },

      sliceProjectIntoLessons: (projectPlan: ProjectPlan) => {
        const slices: ProjectSlice[] = projectPlan.lessonSlices.map((slice, index) => ({
          id: slice.id,
          projectId: projectPlan.projectId,
          title: slice.title,
          description: slice.description,
          type: slice.type,
          duration: slice.duration,
          steps: slice.steps,
          successCriteria: slice.successCriteria,
          photoCheckRequired: slice.photoCheckRequired,
          cutList: slice.cutList || [],
          materials: slice.materials || [],
          tools: slice.tools || [],
          isCompleted: false,
          completedPhotos: [],
          notes: '',
          order: index + 1,
        }));

        set({ projectSlices: slices });
        return slices;
      },

      optimizeCutList: (cutList: CutListItem[], stockLengths: number[]) => {
        // Simple optimization algorithm - can be enhanced later
        const optimized = cutList.map(item => {
          const bestStock = stockLengths.reduce((best, stock) => {
            const waste = stock - item.dimensions.length;
            if (waste >= 0 && waste < (best.waste || Infinity)) {
              return { stock, waste };
            }
            return best;
          }, { stock: 0, waste: Infinity });

          return {
            ...item,
            stockLength: bestStock.stock,
            waste: bestStock.waste,
          };
        });

        return optimized;
      },

      completeLessonSlice: (sliceId: string, photos?: string[], notes?: string) => {
        const { projectSlices } = get();
        const updatedSlices = projectSlices.map(slice => 
          slice.id === sliceId 
            ? { 
                ...slice, 
                isCompleted: true, 
                completedPhotos: photos || slice.completedPhotos,
                notes: notes || slice.notes 
              }
            : slice
        );

        set({ projectSlices: updatedSlices });
      },

      updateProjectProgress: (projectId: string, progress: any) => {
        // Update project progress in Firestore
        try {
          const { user } = useAuthStore.getState();
          if (user?.uid) {
            firestoreService.updateUserProgress(user.uid, { [projectId]: progress });
          }
        } catch (error) {
          console.error('Error updating project progress:', error);
        }
      },

      // Offline content management
      downloadProjectBundle: async (projectId) => {
        const project = woodworkingProjects.find(p => p.id === projectId);
        if (!project) {
          console.error('Project not found for offline bundle:', projectId);
          return;
        }

        set({ isDownloading: true });
        try {
          // Simulate downloading content
          const bundle: OfflineBundle = {
            id: `bundle-${projectId}-${Date.now()}`,
            projectId: projectId,
            title: project.title,
            description: project.description,
            size: 2.5, // Simulated size in MB
            downloadProgress: 0,
            isDownloaded: false,
            lastUpdated: new Date(),
            content: {
              projectPlan: {
                id: `plan-${projectId}`,
                projectId: projectId,
                title: project.title,
                description: project.description,
                estimatedTime: project.estimatedTime,
                difficulty: project.difficulty,
                materials: project.materials.map((material, index) => ({
                  id: `mat-${index}`,
                  name: material,
                  type: 'wood',
                  quantity: 1,
                  unit: 'piece',
                })),
                tools: project.tools.map((tool, index) => ({
                  id: `tool-${index}`,
                  name: tool,
                  type: 'hand',
                  required: true,
                })),
                cutList: [],
                lessonSlices: project.lessonSlices,
                notes: '',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              lessonSlices: project.lessonSlices.map((slice, index) => ({
                id: slice.id,
                projectId: projectId,
                title: slice.title,
                description: slice.description,
                type: slice.type,
                duration: slice.duration,
                steps: slice.steps,
                successCriteria: slice.successCriteria,
                photoCheckRequired: slice.photoCheckRequired,
                cutList: [],
                materials: [],
                tools: [],
                isCompleted: false,
                completedPhotos: [],
                notes: '',
                order: index + 1,
              })),
              cutLists: [],
              materials: [],
              tools: [],
              images: [],
            },
          };

          // Simulate download progress
          for (let i = 0; i <= 100; i += 10) {
            bundle.downloadProgress = i;
            set({ offlineBundles: [...get().offlineBundles, { ...bundle }] });
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          bundle.isDownloaded = true;
          bundle.downloadProgress = 100;
          
          const updatedBundles = get().offlineBundles.map(b => 
            b.id === bundle.id ? bundle : b
          );
          set({ offlineBundles: updatedBundles });
          
          // Store in local storage
          try {
            zuStandStorage.setItem('offlineBundles', JSON.stringify(updatedBundles));
          } catch (error) {
            console.error('Error saving offline bundles to storage:', error);
          }
          
          console.log('Project bundle downloaded:', bundle.id);
        } catch (error) {
          console.error('Error downloading project bundle:', error);
        } finally {
          set({ isDownloading: false });
        }
      },

      removeOfflineBundle: (bundleId) => {
        const { offlineBundles } = get();
        const updatedBundles = offlineBundles.filter(bundle => bundle.id !== bundleId);
        set({ offlineBundles: updatedBundles });
        
        // Update local storage
        try {
          zuStandStorage.setItem('offlineBundles', JSON.stringify(updatedBundles));
        } catch (error) {
          console.error('Error updating offline bundles in storage:', error);
        }
        
        console.log('Offline bundle removed:', bundleId);
      },

      getOfflineBundles: () => {
        return get().offlineBundles;
      },

      isProjectOffline: (projectId) => {
        return get().offlineBundles.some(bundle => bundle.projectId === projectId);
      },
      
      // New Firestore data actions
      fetchSkills: async () => {
        try {
          set({ isLoading: true });
          const skills = await getSkills();
          set({ skills, isLoading: false });
        } catch (error) {
          console.error('Error fetching skills:', error);
          set({ isLoading: false });
        }
      },
      
      fetchProjects: async () => {
        try {
          set({ isLoading: true });
          const projects = await getProjects();
          set({ projects, isLoading: false });
        } catch (error) {
          console.error('Error fetching projects:', error);
          set({ isLoading: false });
        }
      },
      
      fetchCategories: async () => {
        try {
          set({ isLoading: true });
          const categories = await getCategories();
          set({ categories, isLoading: false });
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({ isLoading: false });
        }
      },
      
      fetchAllData: async () => {
        try {
          set({ isLoading: true });
          const [skills, projects, categories] = await Promise.all([
            getSkills(),
            getProjects(),
            getCategories()
          ]);
          set({ skills, projects, categories, isLoading: false });
        } catch (error) {
          console.error('Error fetching all data:', error);
          set({ isLoading: false });
        }
      },
      
      fetchLessonContent: async () => {
        try {
          set({ isLoading: true });
          const lessonContent = await firestoreService.getAllLessonContent();
          set({ lessonContent, isLoading: false });
        } catch (error) {
          console.error('Error fetching lesson content:', error);
          set({ isLoading: false });
        }
      },
      
      getLessonContent: async (skillId: string) => {
        try {
          return await firestoreGetLessonContent(skillId);
        } catch (error) {
          console.error('Error fetching lesson content:', error);
          return null;
        }
      },
      
      updateLessonProgress: async (skillId: string, progress: any) => {
        try {
          const { useAuthStore } = await import('./authStore');
          const { firebaseUser } = useAuthStore.getState();
          if (firebaseUser?.uid) {
            await updateUserLessonProgress(firebaseUser.uid, skillId, progress);
          }
        } catch (error) {
          console.error('Error updating lesson progress:', error);
        }
      },
    }),
    {
      name: 'user-progress-storage',
      storage: createJSONStorage(() => zuStandStorage),
    }
  )
);

// Export the skills and projects for use in components
export { woodworkingProjects, woodworkingSkills };

