export interface Philosophy {
  hoursPerDay: number;
  daysPerWeek: number;
  hoursPerWeek: number;
}

export interface Role {
  name: string;
  defaultRate: number;
  category: 'preset' | 'custom';
}

export interface Allocation {
  role: string;
  hoursPerDay: number;
  rate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  primaryRole: string;
  allocations: Allocation[];
  totalHoursPerDay?: number;
  totalHoursPerWeek?: number;
}

export interface Subsection {
  id: string;
  name: string;
  complexity: 1 | 2 | 3;
  editorHours: number;
  researcherHours: number;
  reviewHours: number;
}

export interface Section {
  id: string;
  name: string;
  subsections: Subsection[];
}

export interface Chapter {
  id: string;
  name: string;
  sections: Section[];
}

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
}

export interface FixedCosts {
  software: FixedCost[];
  workshop: FixedCost[];
  consultants: FixedCost[];
  other: FixedCost[];
}

export interface ProjectData {
  id: string;
  name: string;
  philosophy: Philosophy;
  roles: {
    preset: Record<string, number>;
    custom: Record<string, number>;
  };
  teamMembers: TeamMember[];
  chapters: Chapter[];
  fixedCosts: FixedCosts;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkNeeded {
  'Editor': number;
  'Researcher': number;
  'Specialist Reviewer': number;
  [key: string]: number;
}

export interface TeamCapacity {
  [role: string]: number;
}

export interface MemberBreakdown {
  [memberName: string]: {
    allocations: Array<{
      role: string;
      hours: number;
      rate: number;
      cost: number;
    }>;
    total: number;
  };
}

export interface CostCalculation {
  total: number;
  breakdown: MemberBreakdown;
  workNeeded: WorkNeeded;
  teamCapacity: TeamCapacity;
  duration: number;
}