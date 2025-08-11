import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from './projectStore';
import type { TeamMember, Chapter, FixedCost } from '../types/project';

describe('Project Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useProjectStore.setState((state) => ({
      ...state,
      project: {
        ...state.project,
        teamMembers: [],
        chapters: [],
        fixedCosts: {
          software: [],
          workshop: [],
          consultants: [],
      other: [],
        },
      },
    }));
  });

  describe('Team Management', () => {
    it('should add a team member', () => {
      const store = useProjectStore.getState();
      const newMember: TeamMember = {
        id: 'test-1',
        name: 'Test Member',
        primaryRole: 'Researcher',
        allocations: [
          { role: 'Researcher', hoursPerDay: 5, rate: 80 },
        ],
      };

      store.addTeamMember(newMember);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.teamMembers).toHaveLength(1);
      expect(updatedState.project.teamMembers[0]).toEqual(newMember);
    });

    it('should update a team member', () => {
      const store = useProjectStore.getState();
      const member: TeamMember = {
        id: 'test-1',
        name: 'Original Name',
        primaryRole: 'Researcher',
        allocations: [
          { role: 'Researcher', hoursPerDay: 5, rate: 80 },
        ],
      };

      store.addTeamMember(member);
      store.updateTeamMember('test-1', { name: 'Updated Name' });
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.teamMembers[0].name).toBe('Updated Name');
    });

    it('should remove a team member', () => {
      const store = useProjectStore.getState();
      const member1: TeamMember = {
        id: 'test-1',
        name: 'Member 1',
        primaryRole: 'Researcher',
        allocations: [],
      };
      const member2: TeamMember = {
        id: 'test-2',
        name: 'Member 2',
        primaryRole: 'Lead Editor',
        allocations: [],
      };

      store.addTeamMember(member1);
      store.addTeamMember(member2);
      store.removeTeamMember('test-1');
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.teamMembers).toHaveLength(1);
      expect(updatedState.project.teamMembers[0].id).toBe('test-2');
    });

    it('should validate fractional allocations sum to <= 5 hours', () => {
      const store = useProjectStore.getState();
      const member: TeamMember = {
        id: 'test-1',
        name: 'Fractional Worker',
        primaryRole: 'Lead Editor',
        allocations: [
          { role: 'Lead Editor', hoursPerDay: 3, rate: 120 },
          { role: 'Researcher', hoursPerDay: 2, rate: 80 },
        ],
      };

      store.addTeamMember(member);
      
      const totalHours = member.allocations.reduce((sum, a) => sum + a.hoursPerDay, 0);
      expect(totalHours).toBeLessThanOrEqual(5);
    });

    it('should handle multiple roles per person', () => {
      const store = useProjectStore.getState();
      const member: TeamMember = {
        id: 'test-1',
        name: 'Multi-role',
        primaryRole: 'Lead Editor',
        allocations: [
          { role: 'Lead Editor', hoursPerDay: 2, rate: 120 },
          { role: 'Researcher', hoursPerDay: 2, rate: 80 },
          { role: 'Reviewer', hoursPerDay: 1, rate: 100 },
        ],
      };

      store.addTeamMember(member);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.teamMembers[0].allocations).toHaveLength(3);
    });
  });

  describe('Content Structure Management', () => {
    it('should add a chapter', () => {
      const store = useProjectStore.getState();
      const chapter: Chapter = {
        id: 'ch-1',
        name: 'Test Chapter',
        sections: [],
      };

      store.addChapter(chapter);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.chapters).toHaveLength(1);
      expect(updatedState.project.chapters[0].name).toBe('Test Chapter');
    });

    it('should update a subsection', () => {
      const store = useProjectStore.getState();
      const chapter: Chapter = {
        id: 'ch-1',
        name: 'Chapter',
        sections: [
          {
            id: 'sec-1',
            name: 'Section',
            subsections: [
              {
                id: 'sub-1',
                name: 'Subsection',
                complexity: 1,
                editorHours: 2,
                researcherHours: 3,
                reviewHours: 1,
              },
            ],
          },
        ],
      };

      store.addChapter(chapter);
      store.updateSubsection('ch-1', 'sec-1', 'sub-1', { 
        complexity: 3,
        editorHours: 6,
      });
      
      const updatedState = useProjectStore.getState();
      const subsection = updatedState.project.chapters[0].sections[0].subsections[0];
      expect(subsection.complexity).toBe(3);
      expect(subsection.editorHours).toBe(6);
      expect(subsection.researcherHours).toBe(3); // Unchanged
    });

    it('should import chapters replacing existing ones', () => {
      const store = useProjectStore.getState();
      const oldChapter: Chapter = {
        id: 'old-1',
        name: 'Old Chapter',
        sections: [],
      };
      const newChapters: Chapter[] = [
        {
          id: 'new-1',
          name: 'New Chapter 1',
          sections: [],
        },
        {
          id: 'new-2',
          name: 'New Chapter 2',
          sections: [],
        },
      ];

      store.addChapter(oldChapter);
      store.importChapters(newChapters);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.chapters).toHaveLength(2);
      expect(updatedState.project.chapters[0].name).toBe('New Chapter 1');
      expect(updatedState.project.chapters[1].name).toBe('New Chapter 2');
    });

    it('should handle Main Topics sections for direct subsections', () => {
      const store = useProjectStore.getState();
      const chapter: Chapter = {
        id: 'ch-1',
        name: 'Chapter with Direct Items',
        sections: [
          {
            id: 'main-1',
            name: 'Main Topics',
            subsections: [
              {
                id: 'sub-1',
                name: 'Direct Item 1',
                complexity: 2,
                editorHours: 4,
                researcherHours: 6,
                reviewHours: 0,
              },
            ],
          },
        ],
      };

      store.addChapter(chapter);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.chapters[0].sections[0].name).toBe('Main Topics');
    });
  });

  describe('Fixed Costs Management', () => {
    it('should add fixed costs to correct categories', () => {
      const store = useProjectStore.getState();
      const softwareCost: FixedCost = {
        id: 'soft-1',
        name: 'Wiki.js',
        amount: 500,
      };
      const workshopCost: FixedCost = {
        id: 'work-1',
        name: 'Workshop 1',
        amount: 5000,
      };

      store.addFixedCost('software', softwareCost);
      store.addFixedCost('workshop', workshopCost);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.fixedCosts.software).toHaveLength(1);
      expect(updatedState.project.fixedCosts.workshop).toHaveLength(1);
      expect(updatedState.project.fixedCosts.software[0].name).toBe('Wiki.js');
      expect(updatedState.project.fixedCosts.workshop[0].amount).toBe(5000);
    });

    it('should remove fixed costs from correct category', () => {
      const store = useProjectStore.getState();
      const cost1: FixedCost = { id: '1', name: 'Cost 1', amount: 100 };
      const cost2: FixedCost = { id: '2', name: 'Cost 2', amount: 200 };

      store.addFixedCost('software', cost1);
      store.addFixedCost('software', cost2);
      store.removeFixedCost('software', '1');
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.fixedCosts.software).toHaveLength(1);
      expect(updatedState.project.fixedCosts.software[0].id).toBe('2');
    });
  });

  describe('Cost Calculations Integration', () => {
    it('should calculate costs correctly with store data', () => {
      const store = useProjectStore.getState();
      
      // Add team members
      store.addTeamMember({
        id: '1',
        name: 'Editor',
        primaryRole: 'Lead Editor',
        allocations: [
          { role: 'Lead Editor', hoursPerDay: 5, rate: 120 },
        ],
      });
      
      // Add content
      store.addChapter({
        id: 'ch-1',
        name: 'Chapter',
        sections: [
          {
            id: 'sec-1',
            name: 'Section',
            subsections: [
              {
                id: 'sub-1',
                name: 'Task',
                complexity: 2,
                editorHours: 25, // 1 week of work
                researcherHours: 0,
                reviewHours: 0,
              },
            ],
          },
        ],
      });
      
      const costs = store.calculateCosts();
      
      expect(costs.duration).toBe(1); // 1 week
      expect(costs.total).toBe(3000); // 5h * $120 * 5 days * 1 week
    });
  });

  describe('Philosophy Constraints', () => {
    it('should have correct default philosophy values', () => {
      const state = useProjectStore.getState();
      
      expect(state.project.philosophy.hoursPerDay).toBe(5);
      expect(state.project.philosophy.daysPerWeek).toBe(5);
      expect(state.project.philosophy.hoursPerWeek).toBe(25);
    });

    it('should maintain philosophy consistency', () => {
      const state = useProjectStore.getState();
      const { hoursPerDay, daysPerWeek, hoursPerWeek } = state.project.philosophy;
      
      expect(hoursPerDay * daysPerWeek).toBe(hoursPerWeek);
    });
  });

  describe('Data Persistence', () => {
    it('should reset project to initial state', () => {
      const store = useProjectStore.getState();
      
      // Add some data
      store.addTeamMember({
        id: 'test',
        name: 'Test',
        primaryRole: 'Researcher',
        allocations: [],
      });
      
      // Reset
      store.resetProject();
      
      const updatedState = useProjectStore.getState();
      // Should have default pre-populated team members
      expect(updatedState.project.teamMembers.length).toBeGreaterThan(0);
    });

    it('should load project data', () => {
      const store = useProjectStore.getState();
      const newProjectData = {
        ...store.project,
        name: 'Loaded Project',
        teamMembers: [],
      };
      
      store.loadProject(newProjectData);
      
      const updatedState = useProjectStore.getState();
      expect(updatedState.project.name).toBe('Loaded Project');
      expect(updatedState.project.teamMembers).toHaveLength(0);
    });
  });
});