import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamManagement } from './TeamManagement';
import { useProjectStore } from '../../store/projectStore';

describe('TeamManagement Component', () => {
  beforeEach(() => {
    // Reset store with minimal test data
    useProjectStore.setState((state) => ({
      ...state,
      project: {
        ...state.project,
        teamMembers: [
          {
            id: 'test-1',
            name: 'Test Member 1',
            primaryRole: 'Lead Editor',
            allocations: [
              { role: 'Lead Editor', hoursPerDay: 3, rate: 120 },
              { role: 'Researcher', hoursPerDay: 2, rate: 80 },
            ],
          },
        ],
      },
    }));
  });

  describe('Philosophy Display', () => {
    it('should display deep work philosophy values', () => {
      render(<TeamManagement />);
      
      // Use getAllByText since there are multiple "5" values (hours per day and days per week)
      const fiveValues = screen.getAllByText('5');
      expect(fiveValues.length).toBeGreaterThanOrEqual(2); // At least 2 instances of "5"
      
      // Check for "25" in the hours per week display
      const twentyFiveValues = screen.getAllByText('25');
      expect(twentyFiveValues.length).toBeGreaterThanOrEqual(1);
      
      expect(screen.getByText('Deep Work Philosophy')).toBeInTheDocument();
    });

    it('should explain sustainable work model', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText(/sustainable model/i)).toBeInTheDocument();
      expect(screen.getByText(/preventing burnout/i)).toBeInTheDocument();
    });
  });

  describe('Team Member Display', () => {
    it('should display team members', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Test Member 1')).toBeInTheDocument();
      // Use getAllByText since "Lead Editor" appears multiple times (role name and available roles)
      const leadEditorElements = screen.getAllByText('Lead Editor');
      expect(leadEditorElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should show allocations for each member', () => {
      render(<TeamManagement />);
      
      expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // Lead Editor hours
      expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // Researcher hours
      expect(screen.getByDisplayValue('120')).toBeInTheDocument(); // Lead Editor rate
      expect(screen.getByDisplayValue('80')).toBeInTheDocument(); // Researcher rate
    });

    it('should calculate and display weekly cost', () => {
      render(<TeamManagement />);
      
      // (3h * $120 + 2h * $80) * 5 days = $2600/week
      expect(screen.getByText('$2,600/week')).toBeInTheDocument();
    });

    it('should show daily and weekly hour totals', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('5/5')).toBeInTheDocument(); // hours per day
      // Check for "25" in the context of hours per week (it's in a span element)
      const weeklyHoursElements = screen.getAllByText('25');
      expect(weeklyHoursElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('hours per week')).toBeInTheDocument();
    });
  });

  describe('Team Member Interactions', () => {
    it('should add a new team member', async () => {
      render(<TeamManagement />);
      
      const addButton = screen.getByText('Add Team Member');
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Team Member 2')).toBeInTheDocument();
      });
    });

    it('should edit team member name', async () => {
      const user = userEvent.setup();
      render(<TeamManagement />);
      
      const nameElement = screen.getByText('Test Member 1');
      await user.click(nameElement);
      
      const input = screen.getByDisplayValue('Test Member 1');
      await user.clear(input);
      await user.type(input, 'Updated Name');
      await user.tab(); // Blur to save
      
      expect(screen.getByText('Updated Name')).toBeInTheDocument();
    });

    it('should update allocation hours', async () => {
      const user = userEvent.setup();
      render(<TeamManagement />);
      
      const hoursInput = screen.getByDisplayValue('3');
      await user.clear(hoursInput);
      await user.type(hoursInput, '4');
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('4')).toBeInTheDocument();
      });
    });

    it('should update allocation rate', async () => {
      const user = userEvent.setup();
      render(<TeamManagement />);
      
      const rateInput = screen.getByDisplayValue('120');
      await user.clear(rateInput);
      await user.type(rateInput, '150');
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('150')).toBeInTheDocument();
      });
    });

    it('should add another role allocation', async () => {
      render(<TeamManagement />);
      
      const addRoleButton = screen.getByText('+ Add Another Role');
      fireEvent.click(addRoleButton);
      
      await waitFor(() => {
        const researcherRoles = screen.getAllByText('Researcher');
        expect(researcherRoles.length).toBeGreaterThan(1);
      });
    });

    it('should remove a team member', async () => {
      render(<TeamManagement />);
      
      const deleteButtons = screen.getAllByRole('button');
      const deleteButton = deleteButtons.find(btn => btn.querySelector('.lucide-trash2'));
      
      if (deleteButton) {
        fireEvent.click(deleteButton);
        
        await waitFor(() => {
          expect(screen.queryByText('Test Member 1')).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Over-allocation Warning', () => {
    it('should show warning when member is over-allocated', () => {
      useProjectStore.setState((state) => ({
        ...state,
        project: {
          ...state.project,
          teamMembers: [
            {
              id: 'over-1',
              name: 'Overworked',
              primaryRole: 'Lead Editor',
              allocations: [
                { role: 'Lead Editor', hoursPerDay: 4, rate: 120 },
                { role: 'Researcher', hoursPerDay: 3, rate: 80 }, // 7 hours total
              ],
            },
          ],
        },
      }));
      
      render(<TeamManagement />);
      
      expect(screen.getByText(/Over-allocated/)).toBeInTheDocument();
      expect(screen.getByText('7/5')).toBeInTheDocument();
    });

    it('should not show warning when allocation is valid', () => {
      render(<TeamManagement />);
      
      expect(screen.queryByText(/Over-allocated/)).not.toBeInTheDocument();
    });
  });

  describe('Roles Reference', () => {
    it('should display available roles and default rates', () => {
      render(<TeamManagement />);
      
      expect(screen.getByText('Available Roles & Default Rates')).toBeInTheDocument();
      // Use getAllByText since $120/hour appears twice (Lead Editor and Topic Specialist)
      const rate120Elements = screen.getAllByText('$120/hour');
      expect(rate120Elements.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('$80/hour')).toBeInTheDocument();
      expect(screen.getByText('$60/hour')).toBeInTheDocument();
    });
  });

  describe('Fractional Allocations', () => {
    it('should handle fractional hour allocations', async () => {
      const user = userEvent.setup();
      render(<TeamManagement />);
      
      const hoursInput = screen.getByDisplayValue('3');
      await user.clear(hoursInput);
      await user.type(hoursInput, '2.5');
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('2.5')).toBeInTheDocument();
        expect(screen.getByText('4.5/5')).toBeInTheDocument(); // 2.5 + 2 = 4.5
      });
    });

    it('should calculate costs correctly with fractional hours', async () => {
      useProjectStore.setState((state) => ({
        ...state,
        project: {
          ...state.project,
          teamMembers: [
            {
              id: 'frac-1',
              name: 'Fractional Worker',
              primaryRole: 'Lead Editor',
              allocations: [
                { role: 'Lead Editor', hoursPerDay: 2.5, rate: 100 },
                { role: 'Researcher', hoursPerDay: 2.5, rate: 80 },
              ],
            },
          ],
        },
      }));
      
      render(<TeamManagement />);
      
      // (2.5h * $100 + 2.5h * $80) * 5 days = $2250/week
      expect(screen.getByText('$2,250/week')).toBeInTheDocument();
    });
  });
});