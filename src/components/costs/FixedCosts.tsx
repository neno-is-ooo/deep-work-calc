import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Plus, Trash2, DollarSign, Calendar, Package, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const FixedCosts: React.FC = () => {
  const { project, addFixedCost, removeFixedCost } = useProjectStore();
  const [newCosts, setNewCosts] = useState({
    software: { name: '', amount: '' },
    workshop: { name: '', amount: '' },
    consultants: { name: '', amount: '' },
    other: { name: '', amount: '' }
  });

  const handleAddCost = (category: 'software' | 'workshop' | 'consultants' | 'other') => {
    const cost = newCosts[category];
    if (!cost.name && !cost.amount) {
      toast.error('Please enter both a name and amount');
      return;
    }
    if (!cost.name) {
      toast.error('Please enter a name');
      return;
    }
    if (!cost.amount) {
      toast.error('Please enter an amount');
      return;
    }
    
    addFixedCost(category, {
      id: crypto.randomUUID(),
      name: cost.name,
      amount: parseFloat(cost.amount) || 0
    });
    
    // Show success toast
    const categoryName = category === 'software' ? 'Software' : 
                        category === 'workshop' ? 'Workshop' :
                        category === 'consultants' ? 'Expert Interview' : 'Cost';
    toast.success(`${categoryName} added: ${cost.name}`);
    
    setNewCosts({
      ...newCosts,
      [category]: { name: '', amount: '' }
    });
  };

  const calculateCategoryTotal = (category: 'software' | 'workshop' | 'consultants' | 'other') => {
    return project.fixedCosts[category].reduce((sum, cost) => sum + cost.amount, 0);
  };

  const calculateTotalFixedCosts = () => {
    return calculateCategoryTotal('software') + 
           calculateCategoryTotal('workshop') + 
           calculateCategoryTotal('consultants') +
           calculateCategoryTotal('other');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'software': return <Package className="w-5 h-5" />;
      case 'workshop': return <Calendar className="w-5 h-5" />;
      case 'consultants': return <Users className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'software': return 'bg-secondary/50 border-border';
      case 'workshop': return 'bg-secondary/50 border-border';
      case 'consultants': return 'bg-secondary/50 border-border';
      default: return 'bg-secondary/50 border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Fixed Costs Management</h2>
        <div className="text-foreground px-4 py-2 rounded border border-slate-900 dark:border-zinc-100">
          <span className="text-base text-muted-foreground">Total Fixed Costs:</span>
          <span className="text-xl font-light ml-2">${calculateTotalFixedCosts().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['software', 'workshop', 'consultants', 'other'] as const).map(category => (
          <div key={category} className={`rounded border p-5 overflow-hidden ${getCategoryColor(category)}`}>
            <div className="flex items-center gap-2 mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-semibold capitalize dark:text-gray-100">
                {category === 'other' ? 'Other Costs' : 
                 category === 'workshop' ? 'Workshops & Events' : 
                 category === 'consultants' ? 'Expert Interviews' :
                 'Software Stack'}
              </h3>
            </div>

            {/* Add new cost form */}
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder={`${category === 'software' ? 'Software name' : 
                              category === 'workshop' ? 'Workshop name' : 
                              category === 'consultants' ? 'Expert name' :
                              'Cost name'}`}
                value={newCosts[category].name}
                onChange={(e) => setNewCosts({
                  ...newCosts,
                  [category]: { ...newCosts[category], name: e.target.value }
                })}
                className="w-full px-2 py-1.5 border-b border-border bg-transparent text-foreground text-base focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2 items-center w-full">
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={newCosts[category].amount}
                  onChange={(e) => setNewCosts({
                    ...newCosts,
                    [category]: { ...newCosts[category], amount: e.target.value }
                  })}
                  className="w-full min-w-0 px-2 py-1.5 border-b border-border bg-transparent text-foreground text-base focus:outline-none focus:border-primary transition-colors font-mono"
                  min="0"
                  step="100"
                />
                <button
                  onClick={() => handleAddCost(category)}
                  className="w-10 h-10 text-foreground rounded border border-border hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center flex-shrink-0"
                  title="Add cost"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cost items list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {project.fixedCosts[category].map(cost => (
                <div key={cost.id} className="flex items-center justify-between bg-white dark:bg-gray-700 rounded p-3">
                  <div>
                    <div className="font-medium text-foreground">{cost.name}</div>
                    <div className="text-base text-muted-foreground">${cost.amount.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => removeFixedCost(category, cost.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {project.fixedCosts[category].length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No {category === 'other' ? 'other costs' : 
                      category === 'workshop' ? 'workshops' : 
                      category === 'consultants' ? 'expert interviews' :
                      'software'} added yet
                </div>
              )}
            </div>

            {/* Category total */}
            <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                <span className="text-lg font-semibold dark:text-gray-100">${calculateCategoryTotal(category).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 rounded p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Fixed Costs Summary</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm opacity-90">Software</div>
            <div className="text-2xl font-bold">${calculateCategoryTotal('software').toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Workshops</div>
            <div className="text-2xl font-bold">${calculateCategoryTotal('workshop').toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Other</div>
            <div className="text-2xl font-bold">${calculateCategoryTotal('other').toLocaleString()}</div>
          </div>
          <div className="border-l-2 border-white/30 pl-4">
            <div className="text-sm opacity-90">Total Fixed</div>
            <div className="text-3xl font-bold">${calculateTotalFixedCosts().toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};