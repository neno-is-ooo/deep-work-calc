# Project Cost Calculation Model

## Overview

This application uses a **project-based costing model** where all team members work for the entire project duration, which is determined by the bottleneck role (the role that takes longest to complete their work).

## Key Concepts

### 1. Work Needed
Each subsection in your content structure requires hours from different roles:
- Editor Hours
- Researcher Hours  
- Review Hours

The total work needed per role is the sum across all subsections.

### 2. Team Capacity
Each team member contributes capacity based on their allocations:
- **Daily Capacity**: Hours per day for each role
- **Weekly Capacity**: Hours per day × 5 days
- **Total Team Capacity**: Sum of all members' contributions per role

### 3. Project Duration
The project duration is determined by the **bottleneck** - the role that needs the most weeks to complete their work:

```
Duration (weeks) = MAX(Work Needed for Role ÷ Team Capacity for Role)
```

### 4. Total Cost Calculation
**Important:** All team members are paid for the entire project duration, not just for the hours they actively work.

```
Individual Cost = Hours/Day × 5 Days × Project Duration × Hourly Rate
Total Cost = Sum of all individual costs
```

## Why Costs Change Counter-Intuitively

### Scenario 1: Reducing Hours → Higher Costs
When you reduce a team member's hours per day:
1. Their role's capacity decreases
2. If they become the bottleneck, project duration increases
3. ALL team members work more weeks
4. Total cost increases

**Example:**
- Original: Researcher at 5h/day completes in 4 weeks
- Changed: Researcher at 3h/day needs 7 weeks
- Impact: Everyone works 7 weeks instead of 4 → Higher total cost

### Scenario 2: Increasing Hours → Lower Costs
When you increase a team member's hours per day:
1. Their role's capacity increases
2. If they were the bottleneck, project completes faster
3. ALL team members work fewer weeks
4. Total cost can decrease

**Example:**
- Original: Researcher at 3h/day needs 7 weeks (bottleneck)
- Changed: Researcher at 5h/day completes in 4 weeks
- Impact: Everyone works 4 weeks instead of 7 → Lower total cost

## Real-World Analogy

Think of it like a construction project:
- If the electrician can only work 2 hours/day, the entire project stretches out
- The plumber, carpenter, and painter all have to be "on the project" longer
- Even if they finish their specific tasks early, they're committed to the project duration
- Increasing the electrician's hours speeds up the entire project, reducing everyone's total weeks

## Optimization Strategy

To minimize costs:
1. **Identify the bottleneck role** (shown in Work Allocation Analysis)
2. **Increase capacity for that role** by:
   - Adding more hours/day for existing team members
   - Adding new team members with that role
3. **Balance allocations** to avoid creating new bottlenecks

## Alternative Models

This tool uses a project-based model, but other approaches exist:
- **Task-based**: Pay only for actual hours worked
- **Fixed-price**: Set cost regardless of duration
- **Retainer**: Fixed monthly cost for availability

The project-based model reflects reality for many consulting and professional service engagements where team members are dedicated to a project for its duration.