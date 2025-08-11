import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Plus, Trash2, Edit2, Users, Clock, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TeamMember, Allocation } from '../../types/project';
import { AddMemberModal } from './AddMemberModal';

export const TeamManagement: React.FC = () => {
  const { project, addTeamMember, updateTeamMember, removeTeamMember } = useProjectStore();
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<string | null>(null);

  const handleAddMember = (member: TeamMember) => {
    addTeamMember(member);
  };

  const calculateTotalHours = (allocations: Allocation[]) => {
    return allocations.reduce((sum, a) => sum + a.hoursPerDay, 0);
  };

  const calculateWeeklyCost = (member: TeamMember) => {
    return member.allocations.reduce((sum, a) => sum + (a.hoursPerDay * 5 * a.rate), 0);
  };

  const loadPresetTeam = () => {
    toast(
      (t) => (
        <div>
          <p className="font-medium mb-2">Load preset team?</p>
          <p className="text-sm text-muted-foreground mb-3">This will replace your current team configuration.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // Clear existing team members
                project.teamMembers.forEach(member => removeTeamMember(member.id));
                
                // Add preset team members
                const presetTeam: TeamMember[] = [
                  {
                    id: crypto.randomUUID(),
                    name: 'Alex Morgan',
                    primaryRole: 'Editor',
                    allocations: [
                      { role: 'Editor', hoursPerDay: 5, rate: 120 }
                    ]
                  },
                  {
                    id: crypto.randomUUID(),
                    name: 'Jordan Lee',
                    primaryRole: 'Researcher',
                    allocations: [
                      { role: 'Researcher', hoursPerDay: 5, rate: 120 }
                    ]
                  },
                  {
                    id: crypto.randomUUID(),
                    name: 'Sam Taylor',
                    primaryRole: 'Specialist Reviewer',
                    allocations: [
                      { role: 'Specialist Reviewer', hoursPerDay: 4, rate: 120 },
                      { role: 'Researcher', hoursPerDay: 1, rate: 120 }
                    ]
                  }
                ];
                
                presetTeam.forEach(member => addTeamMember(member));
                toast.dismiss(t.id);
                toast.success('Preset team loaded successfully');
              }}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              Load Team
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-secondary text-foreground rounded text-sm hover:bg-secondary/80"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: 'top-center',
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Philosophy Section */}
      <div className="bg-secondary/50 rounded p-6 border border-border">
        <h2 className="text-xl font-medium text-foreground mb-6">Deep Work Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card rounded p-4 border-2 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group interactive-hint">
            <label className="text-sm font-sans text-muted-foreground mb-3 block flex items-center gap-2">
              <span className="text-primary">⚡</span> Deep Focus Hours/Day
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Adjustable</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const current = project.philosophy.hoursPerDay;
                  if (current > 1) {
                    useProjectStore.getState().updatePhilosophy({ hoursPerDay: current - 1 });
                  }
                }}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-primary/20 text-foreground flex items-center justify-center transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={project.philosophy.hoursPerDay}
                onChange={(e) => {
                  const hours = Math.max(1, Math.min(8, parseInt(e.target.value) || 5));
                  useProjectStore.getState().updatePhilosophy({ hoursPerDay: hours });
                }}
                className={`text-3xl font-mono font-bold bg-transparent border-b-2 w-16 text-center transition-all focus:outline-none ${
                  project.philosophy.hoursPerDay > 6 
                    ? 'border-error text-error' 
                    : project.philosophy.hoursPerDay > 5 
                    ? 'border-warning text-warning'
                    : 'border-primary text-foreground'
                }`}
                min="1"
                max="8"
              />
              <button
                onClick={() => {
                  const current = project.philosophy.hoursPerDay;
                  if (current < 8) {
                    useProjectStore.getState().updatePhilosophy({ hoursPerDay: current + 1 });
                  }
                }}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-primary/20 text-foreground flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
            {project.philosophy.hoursPerDay > 6 && (
              <p className="text-sm text-error mt-2">⚠️ Unsustainable pace</p>
            )}
            {project.philosophy.hoursPerDay > 5 && project.philosophy.hoursPerDay <= 6 && (
              <p className="text-sm text-warning mt-2">Challenging pace</p>
            )}
          </div>
          <div className="bg-card rounded p-4 border-2 border-primary/30 hover:border-primary/50 transition-all cursor-pointer group interactive-hint">
            <label className="text-sm font-sans text-muted-foreground mb-3 block flex items-center gap-2">
              <span className="text-primary">📅</span> Days per Week
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Adjustable</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const current = project.philosophy.daysPerWeek;
                  if (current > 1) {
                    useProjectStore.getState().updatePhilosophy({ daysPerWeek: current - 1 });
                  }
                }}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-primary/20 text-foreground flex items-center justify-center transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={project.philosophy.daysPerWeek}
                onChange={(e) => {
                  const days = Math.max(1, Math.min(7, parseInt(e.target.value) || 5));
                  useProjectStore.getState().updatePhilosophy({ daysPerWeek: days });
                }}
                className="text-3xl font-mono font-bold bg-transparent border-b-2 border-primary w-16 text-center text-foreground transition-all focus:outline-none focus:border-primary/70"
                min="1"
                max="7"
              />
              <button
                onClick={() => {
                  const current = project.philosophy.daysPerWeek;
                  if (current < 7) {
                    useProjectStore.getState().updatePhilosophy({ daysPerWeek: current + 1 });
                  }
                }}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-primary/20 text-foreground flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <div className="bg-card rounded p-4 border-2 border-border">
            <label className="text-sm font-sans text-muted-foreground mb-3 block flex items-center gap-2">
              <span className="text-muted-foreground">📊</span> Total Hours/Week
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">Calculated</span>
            </label>
            <div className="text-3xl font-mono font-bold text-foreground">{project.philosophy.hoursPerWeek}</div>
            {project.philosophy.hoursPerWeek > 30 && (
              <p className="text-sm text-warning mt-2 flex items-center gap-1">
                <span>⚠️</span> Above sustainable limit
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <p className="text-base text-foreground font-medium mb-2 flex items-center gap-2">
            💡 <span>Research shows 4-5 hours of deep work per day is optimal</span>
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Great work requires focused attention, not long hours. This calculator uses sustainable pace 
            as a core principle, recognizing that knowledge work has cognitive limits.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary">💡 Tip:</span>
            <span className="text-muted-foreground">Click the + / - buttons or type directly in the input fields above to adjust your work parameters.</span>
          </div>
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </h2>
          <div className="flex gap-2">
            <button
              onClick={loadPresetTeam}
              className="flex items-center gap-2 text-muted-foreground px-3 py-1.5 rounded border border-border hover:bg-accent transition-colors text-base"
              title="Load a preset team configuration"
            >
              <UserPlus className="w-4 h-4" />
              Load Preset Team
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-foreground px-3 py-1.5 rounded border border-border hover:bg-primary hover:text-primary-foreground transition-colors text-base"
            >
              <Plus className="w-4 h-4" />
              Add Team Member
            </button>
          </div>
        </div>

        {/* Cost Calculation Note */}
        <div className="mb-4 p-3 bg-secondary/50 border border-border rounded">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Tip:</strong> Team members only bill for actual hours worked. Adding capacity to bottleneck roles 
            can reduce project duration and costs. The "Load Preset Team" button provides a balanced starting configuration.
          </p>
        </div>

        <div className="grid gap-3">
          {project.teamMembers.map((member) => {
            const totalHours = calculateTotalHours(member.allocations);
            const weeklyCost = calculateWeeklyCost(member);
            const isOverAllocated = totalHours > 5;

            return (
              <div
                key={member.id}
                className="bg-card rounded border border-border overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {editingMember === member.id ? (
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                            onBlur={() => setEditingMember(null)}
                            className="border-b border-border bg-transparent text-foreground px-1 py-0.5 outline-none focus:border-primary"
                            autoFocus
                          />
                        ) : (
                          <span 
                            onClick={() => setEditingMember(member.id)}
                            className="cursor-pointer hover:text-muted-foreground"
                          >
                            {member.name}
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMember(member.id)}
                        className="p-2 text-foreground hover:bg-accent rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeTeamMember(member.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Allocations */}
                  <div className="space-y-2 mb-4">
                    {member.allocations.map((allocation, index) => (
                      <div key={index} className="flex items-center gap-4 bg-secondary rounded p-3">
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{allocation.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <input
                            type="number"
                            value={allocation.hoursPerDay}
                            onChange={(e) => {
                              const newAllocations = [...member.allocations];
                              newAllocations[index] = {
                                ...allocation,
                                hoursPerDay: parseFloat(e.target.value) || 0
                              };
                              updateTeamMember(member.id, { allocations: newAllocations });
                            }}
                            className="w-16 px-2 py-1 border border-input bg-background text-foreground rounded text-center font-mono"
                            min="0"
                            max="5"
                            step="0.5"
                          />
                          <span className="text-sm text-muted-foreground">hrs/day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">$</span>
                          <input
                            type="number"
                            value={allocation.rate}
                            onChange={(e) => {
                              const newAllocations = [...member.allocations];
                              newAllocations[index] = {
                                ...allocation,
                                rate: parseFloat(e.target.value) || 0
                              };
                              updateTeamMember(member.id, { allocations: newAllocations });
                            }}
                            className="w-20 px-2 py-1 border border-input bg-background text-foreground rounded text-center font-mono"
                            min="0"
                            step="10"
                          />
                          <span className="text-sm text-muted-foreground">/hr</span>
                        </div>
                        {member.allocations.length > 1 && (
                          <button
                            onClick={() => {
                              const newAllocations = member.allocations.filter((_, i) => i !== index);
                              updateTeamMember(member.id, { allocations: newAllocations });
                            }}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Remove this role"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Allocation Button */}
                  {showRoleDropdown === member.id ? (
                    <div className="flex items-center gap-2">
                      <select
                        autoFocus
                        onChange={(e) => {
                          if (e.target.value) {
                            const roleName = e.target.value;
                            const defaultRate = project.roles.preset[roleName] || 80;
                            const newAllocations = [
                              ...member.allocations,
                              { role: roleName, hoursPerDay: 1, rate: defaultRate }
                            ];
                            updateTeamMember(member.id, { allocations: newAllocations });
                          }
                          setShowRoleDropdown(null);
                        }}
                        onBlur={() => setShowRoleDropdown(null)}
                        className="px-3 py-1.5 border border-border rounded bg-background text-foreground text-base"
                      >
                        <option value="">Select a role...</option>
                        {Object.entries(project.roles.preset)
                          .filter(([roleName]) => !member.allocations.some(a => a.role === roleName))
                          .map(([roleName, rate]) => (
                            <option key={roleName} value={roleName}>
                              {roleName} (${rate}/hr)
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => setShowRoleDropdown(null)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowRoleDropdown(member.id)}
                      className="text-base text-primary hover:text-primary/80 font-medium"
                    >
                      + Add Another Role
                    </button>
                  )}

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`text-base ${isOverAllocated ? 'text-warning' : 'text-primary'}`}>
                          <span className="font-medium">{totalHours}</span> hours per day
                        </div>
                        <div className="text-base text-muted-foreground">
                          <span className="font-medium">{totalHours * 5}</span> hours per week
                        </div>
                      </div>
                      <div className="text-xl font-semibold text-foreground">
                        ${weeklyCost.toLocaleString()}/week
                      </div>
                    </div>
                    {isOverAllocated && (
                      <div className="mt-2 text-base text-warning bg-warning/10 rounded p-2">
                        ⚠️ Allocated more than typical 5-hour deep work limit
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
        roles={project.roles.preset}
      />
    </div>
  );
};