import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { TeamMember } from '../../types/project';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: TeamMember) => void;
  roles: Record<string, number>;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAdd, roles }) => {
  const [name, setName] = useState('');
  const [primaryRole, setPrimaryRole] = useState('Editor');
  const [allocations, setAllocations] = useState([
    { role: 'Editor', hoursPerDay: 5, rate: roles['Editor'] || 120 }
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a team member name');
      return;
    }
    
    // Warn about over-allocation but still allow it
    const totalHours = allocations.reduce((sum, a) => sum + a.hoursPerDay, 0);
    if (totalHours > 5) {
      toast('⚠️ This member is allocated more than 5 hours of deep work per day', {
        icon: '⚠️',
        duration: 4000,
      });
    }

    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      primaryRole,
      allocations
    };

    onAdd(newMember);
    
    // Reset form
    setName('');
    setPrimaryRole('Editor');
    setAllocations([{ role: 'Editor', hoursPerDay: 5, rate: roles['Editor'] || 120 }]);
    onClose();
  };

  const updateAllocation = (index: number, field: string, value: any) => {
    const newAllocations = [...allocations];
    
    // If changing role, check for duplicates
    if (field === 'role') {
      const isDuplicate = newAllocations.some((alloc, i) => i !== index && alloc.role === value);
      if (isDuplicate) {
        toast.error(`This member already has the ${value} role`);
        return;
      }
      // Update the rate when role changes
      newAllocations[index] = {
        ...newAllocations[index],
        role: value,
        rate: roles[value] || newAllocations[index].rate
      };
    } else {
      newAllocations[index] = {
        ...newAllocations[index],
        [field]: value
      };
    }
    
    setAllocations(newAllocations);
  };

  const addAllocation = () => {
    // Find a role that's not already in allocations
    const availableRoles = Object.keys(roles);
    const usedRoles = allocations.map(a => a.role);
    const nextRole = availableRoles.find(r => !usedRoles.includes(r)) || 'Researcher';
    const nextRate = roles[nextRole] || 80;
    
    setAllocations([...allocations, { role: nextRole, hoursPerDay: 1, rate: nextRate }]);
  };

  const removeAllocation = (index: number) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Add Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded bg-transparent text-foreground focus:outline-none focus:border-primary"
              placeholder="e.g., Sarah Chen"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Primary Role
            </label>
            <select
              value={primaryRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setPrimaryRole(newRole);
                // Update first allocation to match primary role
                if (allocations.length > 0 && allocations[0].role !== newRole) {
                  const newAllocations = [...allocations];
                  newAllocations[0] = {
                    ...newAllocations[0],
                    role: newRole,
                    rate: roles[newRole] || 80
                  };
                  setAllocations(newAllocations);
                }
              }}
              className="w-full px-3 py-2 border border-border rounded bg-card text-foreground focus:outline-none focus:border-primary"
            >
              {Object.keys(roles).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-foreground">
                Role Allocations
              </label>
              {allocations.length < Object.keys(roles).length && (
                <button
                  type="button"
                  onClick={addAllocation}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  + Add Role
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {allocations.map((allocation, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={allocation.role}
                    onChange={(e) => updateAllocation(index, 'role', e.target.value)}
                    className="flex-1 px-2 py-1 border border-border rounded bg-card text-foreground text-sm"
                  >
                    {Object.keys(roles).map(role => {
                      // Show current role or unallocated roles
                      const isCurrentRole = allocation.role === role;
                      const isAllocated = allocations.some(a => a.role === role);
                      if (isCurrentRole || !isAllocated) {
                        return <option key={role} value={role}>{role}</option>;
                      }
                      return null;
                    })}
                  </select>
                  
                  <input
                    type="number"
                    value={allocation.hoursPerDay}
                    onChange={(e) => updateAllocation(index, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 border border-border rounded bg-card text-foreground text-sm"
                    min="0"
                    max="5"
                    step="0.5"
                  />
                  <span className="text-sm text-muted-foreground">hrs</span>
                  
                  <input
                    type="number"
                    value={allocation.rate}
                    onChange={(e) => updateAllocation(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-border rounded bg-card text-foreground text-sm"
                    min="0"
                    step="10"
                  />
                  <span className="text-sm text-muted-foreground">$/hr</span>
                  
                  {allocations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAllocation(index)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Allocation Summary */}
            {(() => {
              const totalHours = allocations.reduce((sum, a) => sum + a.hoursPerDay, 0);
              const isOverAllocated = totalHours > 5;
              return (
                <div className={`mt-2 p-2 rounded text-sm ${
                  isOverAllocated 
                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  Total: {totalHours} hours per day
                  {isOverAllocated && ' (⚠️ Exceeds typical 5-hour deep work limit)'}
                </div>
              );
            })()}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors border border-primary"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};