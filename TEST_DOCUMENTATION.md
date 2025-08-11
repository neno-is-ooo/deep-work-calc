# Test Documentation - Deep Work Project Cost Estimator

## Testing Philosophy

Our testing approach ensures that the application maintains **ontological consistency** with the deep work philosophy while providing accurate cost estimations and maintaining data integrity.

## Core Principles Being Tested

### 1. Deep Work Philosophy (5-Hour Rule)
- **Principle**: Sustainable work is 5 hours of deep, focused work per day
- **Tests**: 
  - Validate that team members can allocate up to 5 hours daily
  - Warn when over-allocation occurs
  - Calculate weekly capacity as 25 hours (5 days × 5 hours)
- **Location**: `TeamManagement.test.tsx`, `calculations.test.ts`

### 2. Fractional Role Allocation
- **Principle**: People can work across multiple roles within their 5-hour limit
- **Tests**:
  - Multiple allocations per person
  - Fractional hours (e.g., 2.5 hours)
  - Sum of allocations validation
- **Location**: `projectStore.test.ts`, `TeamManagement.test.tsx`

### 3. Complexity-Based Estimation
- **Principle**: Work complexity determines effort required
- **Complexity Levels**:
  - Simple (1): 2 editor hours, 3 researcher hours
  - Moderate (2): 4 editor hours, 6 researcher hours  
  - Complex (3): 6 editor hours, 10 researcher hours
- **Tests**: Verify hour calculations based on complexity
- **Location**: `calculations.test.ts`

### 4. Bottleneck-Based Duration
- **Principle**: Project duration is determined by the role with the most constrained capacity
- **Tests**:
  - Calculate capacity per role
  - Identify bottleneck role
  - Round up partial weeks
- **Location**: `calculations.test.ts`

## Test Coverage Areas

### Unit Tests

#### 1. Calculation Logic (`calculations.test.ts`)
- ✅ Work needed calculation by role
- ✅ Team capacity calculation
- ✅ Project duration based on bottleneck
- ✅ Cost calculations with different rates
- ✅ Fixed costs summation
- ✅ Total hours across all subsections
- ✅ Fractional allocations
- ✅ Week rounding for realistic estimates

#### 2. State Management (`projectStore.test.ts`)
- ✅ Team member CRUD operations
- ✅ Content structure management
- ✅ Fixed costs management
- ✅ Data persistence
- ✅ Cost calculation integration
- ✅ Philosophy constraints validation

#### 3. Component Tests (`TeamManagement.test.tsx`)
- ✅ Philosophy display
- ✅ Team member rendering
- ✅ Interactive editing
- ✅ Over-allocation warnings
- ✅ Cost calculations display
- ✅ Fractional hours handling

### Integration Tests (To Be Implemented)

#### 1. CSV Import/Export
- [ ] Import content structure from CSV
- [ ] Export current structure to CSV
- [ ] Handle malformed CSV data
- [ ] Preserve hierarchy

#### 2. End-to-End Workflow
- [ ] Complete project setup
- [ ] Team configuration
- [ ] Content estimation
- [ ] Cost calculation
- [ ] Export results

## Test Data Scenarios

### Scenario 1: Small Project
- 1 chapter, 3 subsections
- 2 team members
- Duration: 1-2 weeks
- **Purpose**: Validate basic calculations

### Scenario 2: Large Project  
- 10 chapters, 50+ subsections
- 5 team members with fractional allocations
- Duration: 12+ weeks
- **Purpose**: Test scalability and bottleneck identification

### Scenario 3: Over-allocated Team
- Team members with >5 hours/day
- **Purpose**: Validate warning systems

### Scenario 4: Mixed Complexity
- Subsections with all 3 complexity levels
- **Purpose**: Verify complexity-based calculations

## Ontological Consistency Checks

### 1. Philosophy Alignment
```typescript
test('should enforce 25 hours per week maximum', () => {
  // Each team member works max 25h/week
  expect(totalHoursPerWeek).toBeLessThanOrEqual(25);
});
```

### 2. Realistic Duration
```typescript
test('should calculate realistic project duration', () => {
  // Duration based on actual capacity, not wishful thinking
  expect(duration).toBe(Math.ceil(workNeeded / weeklyCapacity));
});
```

### 3. Cost Accuracy
```typescript
test('should calculate costs based on actual allocations', () => {
  // Costs reflect real hours × rates × duration
  expect(totalCost).toBe(sumOfAllAllocations);
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test calculations.test.ts

# Run in watch mode
npm test -- --watch

# Run with UI
npm test -- --ui
```

## Test Metrics

### Current Coverage Goals
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

### Critical Path Coverage
- Cost calculations: 100%
- Team allocation validation: 100%
- Duration calculation: 100%
- Philosophy constraints: 100%

## Validation Rules

### Team Member Validation
1. Name must be non-empty
2. Must have at least one allocation
3. Total daily hours ≤ 5
4. Rates must be positive
5. Hours must be ≥ 0

### Content Structure Validation
1. Chapters must have unique IDs
2. Sections must belong to a chapter
3. Subsections must have complexity 1-3
4. Hours must be non-negative
5. Review hours calculated automatically

### Fixed Costs Validation
1. Amount must be positive
2. Name must be non-empty
3. Category must be valid (software/workshop/other)

## Edge Cases Tested

1. **Zero capacity for required role**
   - Test: Project needs Research Assistant but no capacity
   - Expected: Duration calculation handles gracefully

2. **Fractional week duration**
   - Test: 16 hours needed, 15 hours/week capacity
   - Expected: Rounds up to 2 weeks

3. **Empty project**
   - Test: No chapters, no team
   - Expected: Returns 0 cost, 0 duration

4. **Over-allocation**
   - Test: Team member with 7 hours/day
   - Expected: Warning displayed, calculations continue

5. **Different rates for same role**
   - Test: Senior vs Junior researchers
   - Expected: Correct individual cost calculations

## Future Test Enhancements

1. **Performance Tests**
   - Large dataset handling (100+ chapters)
   - Render performance with many team members
   - State update efficiency

2. **Accessibility Tests**
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA labels

3. **Error Boundary Tests**
   - Component error handling
   - Data corruption recovery
   - Network failure handling

4. **Localization Tests**
   - Currency formatting
   - Date formatting
   - Number formatting

## Test Maintenance

### When to Update Tests
- New feature added
- Bug fix implemented
- Business logic changed
- UI/UX updates

### Test Review Checklist
- [ ] Tests pass locally
- [ ] Coverage maintained/improved
- [ ] Edge cases covered
- [ ] Documentation updated
- [ ] Ontological consistency verified

---

*Last Updated: 2025-08-08*
*Version: 1.0.0*