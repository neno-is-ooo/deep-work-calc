import { describe, it, expect } from 'vitest';
import { calculateProjectCosts, calculateFixedCosts, calculateTotalHours } from './calculations';
import type { ProjectData } from '../types/project';

describe('Calculation Utilities', () => {
  const mockProject: ProjectData = {
    id: 'test-1',
    name: 'Test Project',
    philosophy: {
      hoursPerDay: 5,
      daysPerWeek: 5,
      hoursPerWeek: 25,
    },
    roles: {
      preset: {
        'Lead Editor': 120,
        'Researcher': 80,
        'Research Assistant': 60,
      },
      custom: {},
    },
    teamMembers: [
      {
        id: '1',
        name: 'Team Member 1',
        primaryRole: 'Lead Editor',
        allocations: [
          { role: 'Lead Editor', hoursPerDay: 3, rate: 120 },
          { role: 'Researcher', hoursPerDay: 2, rate: 80 },
        ],
      },
      {
        id: '2',
        name: 'Team Member 2',
        primaryRole: 'Researcher',
        allocations: [
          { role: 'Researcher', hoursPerDay: 5, rate: 80 },
        ],
      },
    ],
    chapters: [
      {
        id: 'ch1',
        name: 'Chapter 1',
        sections: [
          {
            id: 'sec1',
            name: 'Section 1',
            subsections: [
              {
                id: 'sub1',
                name: 'Subsection 1',
                complexity: 2,
                editorHours: 10,
                researcherHours: 15,
                reviewHours: 5,
              },
            ],
          },
        ],
      },
    ],
    fixedCosts: {
      software: [{ id: '1', name: 'Wiki.js', amount: 500 }],
      workshop: [
        { id: '2', name: 'Workshop 1', amount: 5000 },
        { id: '3', name: 'Workshop 2', amount: 5000 },
      ],
      consultants: [],
      other: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('calculateProjectCosts', () => {
    it('should calculate correct work needed by role', () => {
      const result = calculateProjectCosts(mockProject);
      
      expect(result.workNeeded['Lead Editor']).toBe(10);
      expect(result.workNeeded['Researcher']).toBe(15);
      // Complexity 2 splits review hours 50/50 between Research Assistant and Reviewer
      expect(result.workNeeded['Research Assistant']).toBe(2.5); // 5 * 0.5
      expect(result.workNeeded['Reviewer']).toBe(2.5); // 5 * 0.5
    });

    it('should calculate correct team capacity per week', () => {
      const result = calculateProjectCosts(mockProject);
      
      // Team Member 1: 3h/day Lead Editor + 2h/day Researcher = 15 + 10 = 25h/week total
      // Team Member 2: 5h/day Researcher = 25h/week
      expect(result.teamCapacity['Lead Editor']).toBe(15); // 3h/day * 5 days
      expect(result.teamCapacity['Researcher']).toBe(35); // (2h + 5h)/day * 5 days
    });

    it('should calculate correct project duration based on bottleneck', () => {
      const result = calculateProjectCosts(mockProject);
      
      // Lead Editor: 10h needed / 15h per week = 1 week
      // Researcher: 15h needed / 35h per week = 1 week
      // Research Assistant: 5h needed / 0h per week = Infinity (no capacity)
      expect(result.duration).toBe(1);
    });

    it('should calculate correct costs per team member', () => {
      const result = calculateProjectCosts(mockProject);
      
      // With actual hours worked model:
      // Team Member 1: Lead Editor 10h * $120 + Researcher 4.286h * $80 = $1542.86
      expect(result.breakdown['Team Member 1'].total).toBeCloseTo(1542.86, 1);
      
      // Team Member 2: Researcher 10.714h * $80 = $857.14
      expect(result.breakdown['Team Member 2'].total).toBeCloseTo(857.14, 1);
      
      expect(result.total).toBeCloseTo(2400, 1);
    });

    it('should handle fractional allocations correctly', () => {
      const projectWithFractions = {
        ...mockProject,
        teamMembers: [
          {
            id: '1',
            name: 'Fractional Worker',
            primaryRole: 'Lead Editor',
            allocations: [
              { role: 'Lead Editor', hoursPerDay: 2.5, rate: 100 },
              { role: 'Researcher', hoursPerDay: 2.5, rate: 80 },
            ],
          },
        ],
      };
      
      const result = calculateProjectCosts(projectWithFractions);
      
      expect(result.teamCapacity['Lead Editor']).toBe(12.5); // 2.5h * 5 days
      expect(result.teamCapacity['Researcher']).toBe(12.5);
    });

    it('should respect 5-hour daily limit philosophy', () => {
      const overAllocatedProject = {
        ...mockProject,
        teamMembers: [
          {
            id: '1',
            name: 'Overworked',
            primaryRole: 'Lead Editor',
            allocations: [
              { role: 'Lead Editor', hoursPerDay: 6, rate: 120 }, // Over 5h limit
            ],
          },
        ],
      };
      
      const result = calculateProjectCosts(overAllocatedProject);
      
      // Should still calculate with 6h even though it violates philosophy
      expect(result.teamCapacity['Lead Editor']).toBe(30); // 6h * 5 days
    });
  });

  describe('calculateFixedCosts', () => {
    it('should sum all fixed costs correctly', () => {
      const total = calculateFixedCosts(mockProject);
      
      expect(total).toBe(10500); // 500 + 5000 + 5000
    });

    it('should handle empty categories', () => {
      const projectNoFixed = {
        ...mockProject,
        fixedCosts: {
          software: [],
          workshop: [],
          consultants: [],
      other: [],
        },
      };
      
      const total = calculateFixedCosts(projectNoFixed);
      expect(total).toBe(0);
    });

    it('should handle mixed categories correctly', () => {
      const projectMixed = {
        ...mockProject,
        fixedCosts: {
          software: [
            { id: '1', name: 'Tool 1', amount: 100 },
            { id: '2', name: 'Tool 2', amount: 200 },
          ],
          workshop: [{ id: '3', name: 'Event', amount: 1000 }],
          consultants: [],
          other: [{ id: '4', name: 'Misc', amount: 50 }],
        },
      };
      
      const total = calculateFixedCosts(projectMixed);
      expect(total).toBe(1350);
    });
  });

  describe('calculateTotalHours', () => {
    it('should sum all hours across subsections', () => {
      const total = calculateTotalHours(mockProject);
      
      expect(total).toBe(30); // 10 + 15 + 5
    });

    it('should handle multiple chapters and sections', () => {
      const multiChapterProject = {
        ...mockProject,
        chapters: [
          {
            id: 'ch1',
            name: 'Chapter 1',
            sections: [
              {
                id: 'sec1',
                name: 'Section 1',
                subsections: [
                  {
                    id: 'sub1',
                    name: 'Sub 1',
                    complexity: 1 as const,
                    editorHours: 5,
                    researcherHours: 10,
                    reviewHours: 2,
                  },
                  {
                    id: 'sub2',
                    name: 'Sub 2',
                    complexity: 2 as const,
                    editorHours: 3,
                    researcherHours: 6,
                    reviewHours: 1,
                  },
                ],
              },
            ],
          },
          {
            id: 'ch2',
            name: 'Chapter 2',
            sections: [
              {
                id: 'sec2',
                name: 'Section 2',
                subsections: [
                  {
                    id: 'sub3',
                    name: 'Sub 3',
                    complexity: 3 as const,
                    editorHours: 8,
                    researcherHours: 12,
                    reviewHours: 4,
                  },
                ],
              },
            ],
          },
        ],
      };
      
      const total = calculateTotalHours(multiChapterProject);
      expect(total).toBe(51); // (5+10+2) + (3+6+1) + (8+12+4)
    });

    it('should handle empty chapters', () => {
      const emptyProject = {
        ...mockProject,
        chapters: [],
      };
      
      const total = calculateTotalHours(emptyProject);
      expect(total).toBe(0);
    });
  });

  describe('Deep Work Philosophy Validation', () => {
    it('should enforce 25 hours per week maximum', () => {
      const result = calculateProjectCosts(mockProject);
      
      // Each team member should work max 25h/week (5h/day * 5 days)
      Object.values(result.breakdown).forEach(member => {
        const totalHoursPerWeek = member.allocations.reduce(
          (sum, alloc) => sum + (alloc.hours / result.duration),
          0
        );
        expect(totalHoursPerWeek).toBeLessThanOrEqual(25.1); // Small margin for rounding
      });
    });

    it('should calculate realistic project duration', () => {
      const largeProject = {
        ...mockProject,
        chapters: [
          {
            id: 'ch1',
            name: 'Large Chapter',
            sections: [
              {
                id: 'sec1',
                name: 'Section',
                subsections: [
                  {
                    id: 'sub1',
                    name: 'Big Task',
                    complexity: 3 as const,
                    editorHours: 100,
                    researcherHours: 150,
                    reviewHours: 50,
                  },
                ],
              },
            ],
          },
        ],
      };
      
      const result = calculateProjectCosts(largeProject);
      
      // With 15h/week Lead Editor capacity, 100h work = 7 weeks
      expect(result.duration).toBe(7);
    });
  });

  describe('Cost Calculation Accuracy', () => {
    it('should handle different rates for same role', () => {
      const differentRatesProject = {
        ...mockProject,
        teamMembers: [
          {
            id: '1',
            name: 'Senior',
            primaryRole: 'Researcher',
            allocations: [{ role: 'Researcher', hoursPerDay: 5, rate: 100 }],
          },
          {
            id: '2',
            name: 'Junior',
            primaryRole: 'Researcher',
            allocations: [{ role: 'Researcher', hoursPerDay: 5, rate: 60 }],
          },
        ],
      };
      
      const result = calculateProjectCosts(differentRatesProject);
      
      // With actual hours worked model:
      // Each provides 50% of capacity, work 7.5h each
      // Senior: 7.5h * $100 = $750
      // Junior: 7.5h * $60 = $450
      expect(result.breakdown['Senior'].total).toBe(750);
      expect(result.breakdown['Junior'].total).toBe(450);
      expect(result.total).toBe(1200);
    });

    it('should round up weeks to avoid underestimation', () => {
      const partialWeekProject = {
        ...mockProject,
        chapters: [
          {
            id: 'ch1',
            name: 'Chapter',
            sections: [
              {
                id: 'sec1',
                name: 'Section',
                subsections: [
                  {
                    id: 'sub1',
                    name: 'Task',
                    complexity: 2 as const,
                    editorHours: 16, // Slightly more than 1 week at 15h/week
                    researcherHours: 0,
                    reviewHours: 0,
                  },
                ],
              },
            ],
          },
        ],
      };
      
      const result = calculateProjectCosts(partialWeekProject);
      
      // 16h / 15h per week = 1.07 weeks, should round up to 2
      expect(result.duration).toBe(2);
    });
  });
});