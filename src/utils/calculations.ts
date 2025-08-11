import type { ProjectData, CostCalculation, WorkNeeded, TeamCapacity, MemberBreakdown, FixedCost } from '../types/project';

export function calculateProjectCosts(project: ProjectData): CostCalculation {
  // Calculate total work needed by role
  const workNeeded: WorkNeeded = {
    'Editor': 0,
    'Researcher': 0,
    'Specialist Reviewer': 0,
  };
  
  project.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        workNeeded['Editor'] += subsection.editorHours;
        workNeeded['Researcher'] += subsection.researcherHours;
        // All review work goes to Specialist Reviewer role
        workNeeded['Specialist Reviewer'] += subsection.reviewHours;
      });
    });
  });
  
  // Calculate team capacity per week
  const teamCapacity: TeamCapacity = {};
  const memberBreakdown: MemberBreakdown = {};
  
  project.teamMembers.forEach(member => {
    memberBreakdown[member.name] = { allocations: [], total: 0 };
    
    member.allocations.forEach(allocation => {
      const weeklyHours = allocation.hoursPerDay * 5;
      teamCapacity[allocation.role] = (teamCapacity[allocation.role] || 0) + weeklyHours;
    });
  });
  
  // Calculate project duration (weeks) based on bottleneck
  let maxWeeks = 0;
  Object.keys(workNeeded).forEach(role => {
    if (workNeeded[role] > 0 && teamCapacity[role]) {
      const weeksForRole = Math.ceil(workNeeded[role] / teamCapacity[role]);
      maxWeeks = Math.max(maxWeeks, weeksForRole);
    }
  });
  
  // Calculate costs based on full project duration (team members are paid for their time)
  // Note: All team members are paid for the full project duration, even if idle
  // This means increasing capacity of the bottleneck role reduces duration AND total cost
  // But increasing capacity of non-bottleneck roles only increases cost (they have more idle time)
  let totalCost = 0;
  project.teamMembers.forEach(member => {
    member.allocations.forEach(allocation => {
      // Calculate total hours this member will be allocated during the project
      const memberWeeklyHours = allocation.hoursPerDay * 5;
      const totalHoursAllocated = memberWeeklyHours * maxWeeks;
      const cost = totalHoursAllocated * allocation.rate;
      
      memberBreakdown[member.name].allocations.push({
        role: allocation.role,
        hours: totalHoursAllocated,
        rate: allocation.rate,
        cost: cost,
      });
      memberBreakdown[member.name].total += cost;
      totalCost += cost;
    });
  });
  
  return {
    total: totalCost,
    breakdown: memberBreakdown,
    workNeeded,
    teamCapacity,
    duration: maxWeeks,
  };
}

export function calculateFixedCosts(project: ProjectData): number {
  let total = 0;
  const categories = Object.values(project.fixedCosts);
  categories.forEach(category => {
    category.forEach((cost: FixedCost) => {
      total += cost.amount;
    });
  });
  return total;
}

export function calculateTotalHours(project: ProjectData): number {
  let total = 0;
  project.chapters.forEach(chapter => {
    chapter.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        total += subsection.editorHours + subsection.researcherHours + subsection.reviewHours;
      });
    });
  });
  return total;
}