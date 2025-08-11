import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectData, TeamMember, Chapter, Section, FixedCost, Subsection } from '../types/project';
import { calculateProjectCosts } from '../utils/calculations';
// Removed preloaded content - users will import CSV

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ProjectStore extends ThemeState {
  project: ProjectData;
  
  // Philosophy actions
  updatePhilosophy: (updates: Partial<ProjectData['philosophy']>) => void;
  
  // Team actions
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  
  // Content actions
  addChapter: (chapter: Chapter) => void;
  updateSubsection: (chapterId: string, sectionId: string, subsectionId: string, updates: Partial<Subsection>) => void;
  importChapters: (chapters: Chapter[]) => void;
  
  // Fixed costs actions
  addFixedCost: (category: 'software' | 'workshop' | 'consultants' | 'other', cost: FixedCost) => void;
  removeFixedCost: (category: 'software' | 'workshop' | 'consultants' | 'other', id: string) => void;
  
  // Calculations
  calculateCosts: () => ReturnType<typeof calculateProjectCosts>;
  
  // Persistence
  resetProject: () => void;
  loadProject: (data: ProjectData) => void;
}

const initialProject: ProjectData = {
  id: crypto.randomUUID(),
  name: 'New Project',
  philosophy: {
    hoursPerDay: 5,
    daysPerWeek: 5,
    hoursPerWeek: 25,
  },
  roles: {
    preset: {
      'Editor': 120,
      'Researcher': 120,
      'Specialist Reviewer': 120,
    },
    custom: {},
  },
  teamMembers: [], // Start with no team members
  chapters: [], // Start with no content - users will import CSV
  fixedCosts: {
    software: [],
    workshop: [],
    consultants: [],
    other: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      project: {
        ...initialProject,
        // Always ensure correct rates
        roles: {
          preset: {
            'Editor': 120,
            'Researcher': 120,
            'Specialist Reviewer': 120,
          },
          custom: {},
        },
      },
      
      // Theme management - default to dark
      theme: (localStorage.getItem('theme') as Theme) || 'dark',
      setTheme: (theme: Theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const effectiveTheme = theme === 'system' ? systemTheme : theme;
        
        if (effectiveTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      
      updatePhilosophy: (updates: Partial<ProjectData['philosophy']>) =>
        set((state) => ({
          project: {
            ...state.project,
            philosophy: {
              ...state.project.philosophy,
              ...updates,
              hoursPerWeek: (updates.hoursPerDay || state.project.philosophy.hoursPerDay) * 
                           (updates.daysPerWeek || state.project.philosophy.daysPerWeek),
            },
            updatedAt: new Date(),
          },
        })),
      
      addTeamMember: (member: TeamMember) =>
        set((state) => ({
          project: {
            ...state.project,
            teamMembers: [...state.project.teamMembers, member],
            updatedAt: new Date(),
          },
        })),
      
      updateTeamMember: (id: string, updates: Partial<TeamMember>) =>
        set((state) => ({
          project: {
            ...state.project,
            teamMembers: state.project.teamMembers.map(m =>
              m.id === id ? { ...m, ...updates } : m
            ),
            updatedAt: new Date(),
          },
        })),
      
      removeTeamMember: (id: string) =>
        set((state) => ({
          project: {
            ...state.project,
            teamMembers: state.project.teamMembers.filter((m: TeamMember) => m.id !== id),
            updatedAt: new Date(),
          },
        })),
      
      addChapter: (chapter: Chapter) =>
        set((state) => ({
          project: {
            ...state.project,
            chapters: [...state.project.chapters, chapter],
            updatedAt: new Date(),
          },
        })),
      
      updateSubsection: (chapterId: string, sectionId: string, subsectionId: string, updates: Partial<Subsection>) =>
        set((state) => ({
          project: {
            ...state.project,
            chapters: state.project.chapters.map((chapter: Chapter) =>
              chapter.id === chapterId
                ? {
                    ...chapter,
                    sections: chapter.sections.map((section: Section) =>
                      section.id === sectionId
                        ? {
                            ...section,
                            subsections: section.subsections.map((subsection: Subsection) =>
                              subsection.id === subsectionId
                                ? { ...subsection, ...updates }
                                : subsection
                            ),
                          }
                        : section
                    ),
                  }
                : chapter
            ),
            updatedAt: new Date(),
          },
        })),
      
      importChapters: (chapters: Chapter[]) =>
        set((state) => ({
          project: {
            ...state.project,
            chapters,
            updatedAt: new Date(),
          },
        })),
      
      addFixedCost: (category: 'software' | 'workshop' | 'consultants' | 'other', cost: FixedCost) =>
        set((state) => ({
          project: {
            ...state.project,
            fixedCosts: {
              ...state.project.fixedCosts,
              [category]: [...state.project.fixedCosts[category], cost],
            },
            updatedAt: new Date(),
          },
        })),
      
      removeFixedCost: (category: 'software' | 'workshop' | 'consultants' | 'other', id: string) =>
        set((state) => ({
          project: {
            ...state.project,
            fixedCosts: {
              ...state.project.fixedCosts,
              [category]: state.project.fixedCosts[category].filter(c => c.id !== id),
            },
            updatedAt: new Date(),
          },
        })),
      
      calculateCosts: () => {
        const state = get();
        return calculateProjectCosts(state.project);
      },
      
      resetProject: () =>
        set({
          project: {
            ...initialProject,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      
      loadProject: (data) =>
        set({
          project: {
            ...data,
            updatedAt: new Date(),
          },
        }),
    }),
    {
      name: 'project-estimator-storage',
      version: 7, // Force migration to update rates
      onRehydrateStorage: () => (state) => {
        // Always ensure correct rates after loading from storage
        if (state?.project?.roles?.preset) {
          state.project.roles.preset = {
            'Editor': 120,
            'Researcher': 120,
            'Specialist Reviewer': 120,
          };
        }
      },
      migrate: (persistedState: any, _version: number) => {
        // Always update to latest rates
        if (persistedState?.project) {
          // Migration to version 5: Update role names
          if (persistedState?.project?.roles?.preset) {
            persistedState.project.roles.preset = {
              'Editor': 120,
              'Researcher': 120,
              'Specialist Reviewer': 120,
            };
          }
          // Update team members to use new roles
          if (persistedState?.project?.teamMembers) {
            persistedState.project.teamMembers = persistedState.project.teamMembers.map((member: any) => {
              const updatedAllocations = member.allocations.map((alloc: any) => {
                if (alloc.role === 'Lead Editor' || alloc.role === 'Editor/Researcher') {
                  return { ...alloc, role: 'Editor', rate: 120 };
                }
                if (alloc.role === 'Research Assistant' || alloc.role === 'Topic Specialist') {
                  return { ...alloc, role: 'Researcher', rate: 120 };
                }
                if (alloc.role === 'Reviewer') {
                  return { ...alloc, role: 'Specialist Reviewer', rate: 120 };
                }
                return alloc;
              });
              return { ...member, allocations: updatedAllocations };
            });
          }
          // Add consultants category if missing
          if (persistedState?.project?.fixedCosts && !persistedState.project.fixedCosts.consultants) {
            persistedState.project.fixedCosts.consultants = [];
          }
        }
        return persistedState;
      },
    }
  )
);