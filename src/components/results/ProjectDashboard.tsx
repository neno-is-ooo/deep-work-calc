import React from 'react';
import { useProjectStore } from '../../store/projectStore';
import { calculateFixedCosts, calculateTotalHours } from '../../utils/calculations';
import { FileJson, FileText, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import type { FixedCost } from '../../types/project';
import { useTheme } from '../../hooks/useTheme';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const ProjectDashboard: React.FC = () => {
  const { project, calculateCosts } = useProjectStore();
  const { effectiveTheme } = useTheme();
  const costData = calculateCosts();
  const fixedCosts = calculateFixedCosts(project);
  const totalHours = calculateTotalHours(project);
  const totalProjectCost = costData.total + fixedCosts;
  
  // Calculate total subsections for velocity tracking
  const totalSubsections = project.chapters.reduce((total, chapter) => 
    total + chapter.sections.reduce((sectionTotal, section) => 
      sectionTotal + section.subsections.length, 0), 0);

  // Chart theme configuration - Cozy theme
  const chartTheme = {
    text: effectiveTheme === 'dark' ? 'hsl(30, 20%, 94%)' : 'hsl(30, 10%, 12%)',
    grid: effectiveTheme === 'dark' ? 'hsl(30, 6%, 20%)' : 'hsl(30, 12%, 88%)',
    background: effectiveTheme === 'dark' ? 'hsl(30, 8%, 11%)' : 'hsl(30, 20%, 96%)',
    tooltip: {
      background: effectiveTheme === 'dark' ? 'hsl(30, 8%, 11%)' : 'hsl(30, 20%, 96%)',
      text: effectiveTheme === 'dark' ? 'hsl(30, 20%, 92%)' : 'hsl(30, 10%, 15%)',
      border: effectiveTheme === 'dark' ? 'hsl(30, 6%, 20%)' : 'hsl(30, 12%, 88%)'
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(project, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `project-estimate-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportCSV = () => {
    let csv = 'Category,Item,Details,Amount\n';
    
    // Team members
    Object.entries(costData.breakdown).forEach(([name, data]) => {
      data.allocations.forEach(allocation => {
        csv += `Team Member,"${name}","${allocation.role} - ${allocation.hours.toFixed(2)}h @ $${allocation.rate}/hr",$${allocation.cost.toFixed(2)}\n`;
      });
    });
    
    // Fixed costs
    Object.entries(project.fixedCosts).forEach(([category, costs]) => {
      costs.forEach((cost: FixedCost) => {
        csv += `Fixed Cost - ${category},"${cost.name}","",$${cost.amount}\n`;
      });
    });
    
    csv += `\nSummary\n`;
    csv += `Total Team Costs,,,${costData.total.toFixed(2)}\n`;
    csv += `Total Fixed Costs,,,${fixedCosts.toFixed(2)}\n`;
    csv += `Total Project Cost,,,${totalProjectCost.toFixed(2)}\n`;
    csv += `Project Duration,,,${costData.duration} weeks\n`;
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
    const exportFileDefaultName = `project-estimate-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Prepare data for charts
  const pieData = [
    { name: 'Team Costs', value: costData.total, color: effectiveTheme === 'dark' ? 'hsl(20, 55%, 55%)' : 'hsl(20, 60%, 52%)' },
    { name: 'Fixed Costs', value: fixedCosts, color: effectiveTheme === 'dark' ? 'hsl(142, 30%, 50%)' : 'hsl(142, 35%, 55%)' }
  ];

  const workAllocationData = Object.entries(costData.workNeeded).map(([role, needed]) => ({
    role,
    needed,
    capacity: (costData.teamCapacity[role] || 0) * costData.duration,
    utilization: costData.teamCapacity[role] 
      ? Math.round((needed / ((costData.teamCapacity[role] || 1) * costData.duration)) * 100)
      : 0
  })).filter(item => item.needed > 0);

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'hsl(0, 55%, 60%)';  // Error red
    if (utilization > 80) return 'hsl(142, 35%, 55%)'; // Success green
    return 'hsl(38, 70%, 50%)'; // Warning amber
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Project Summary & Results</h2>
        <div className="flex gap-3">
          <button
            onClick={exportJSON}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <FileJson className="w-5 h-5" />
            Export JSON
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Velocity Tracking Card */}
      <div className="bg-accent/20 border border-accent/30 rounded p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          📊 Velocity-Based Planning (#NoEstimates)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card rounded p-3 border border-border">
            <div className="text-2xl font-mono text-foreground">{totalSubsections}</div>
            <div className="text-sm text-muted-foreground">Total Subsections</div>
            <div className="text-sm text-primary mt-1">Units of work</div>
          </div>
          <div className="bg-card rounded p-3 border border-border">
            <div className="text-2xl font-mono text-foreground">
              {costData.duration > 0 ? Math.round(totalSubsections / costData.duration * 10) / 10 : 0}
            </div>
            <div className="text-sm text-muted-foreground">Expected Velocity</div>
            <div className="text-sm text-primary mt-1">Subsections/week</div>
          </div>
          <div className="bg-card rounded p-3 border border-border">
            <div className="text-2xl font-mono text-foreground">{costData.duration}</div>
            <div className="text-sm text-muted-foreground">Estimated Duration</div>
            <div className="text-sm text-primary mt-1">Weeks</div>
          </div>
        </div>
        <div className="mt-3 p-2 bg-secondary/50 rounded">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Tip:</strong> After 2-3 weeks, measure actual subsections completed to get real velocity. 
            This will be more accurate than any upfront estimate.
          </p>
        </div>
      </div>

      {/* Cost Calculation Explanation */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          💰 Budget Envelope Calculation
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p>
            <strong>Duration:</strong> Set by bottleneck role (longest work queue).
            Currently: <span className="font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded">{costData.duration} weeks</span>
          </p>
          <p>
            <strong>Team Allocation:</strong> Team members are allocated (and paid) for the full project duration.
            This is a budget envelope, not a commitment.
          </p>
          <p>
            <strong>Formula:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-0.5 rounded">Deep Hours/Day × Days × Weeks × Rate</code>
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-base">Total Project Cost</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">${totalProjectCost.toLocaleString()}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-base">Project Duration</span>
            <Clock className="w-5 h-5 text-foreground" />
          </div>
          <div className="text-3xl font-bold text-foreground">{costData.duration} weeks</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-base">Total Hours</span>
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">{totalHours.toLocaleString()}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-base">Team Size</span>
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-foreground">{project.teamMembers.length}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cost Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: chartTheme.tooltip.background,
                  border: `1px solid ${chartTheme.tooltip.border}`,
                  color: chartTheme.tooltip.text
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Work Allocation Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded  p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">Work Allocation Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workAllocationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="role" angle={-45} textAnchor="end" height={80} stroke={chartTheme.text} />
              <YAxis stroke={chartTheme.text} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: chartTheme.tooltip.background,
                  border: `1px solid ${chartTheme.tooltip.border}`,
                  color: chartTheme.tooltip.text
                }}
              />
              <Legend wrapperStyle={{ color: chartTheme.text }} />
              <Bar dataKey="needed" fill="#3b82f6" name="Hours Needed" />
              <Bar dataKey="capacity" fill="#10b981" name="Hours Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Contributions */}
      <div className="bg-white dark:bg-gray-800 rounded  p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Team Member Contributions</h3>
        <div className="space-y-4">
          {Object.entries(costData.breakdown).map(([name, data]) => (
            <div key={name} className="border-b border-border pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-foreground">{name}</h4>
                <span className="text-lg font-semibold text-foreground">
                  ${data.total.toLocaleString()}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {data.allocations.map((allocation, index) => (
                  <div key={index} className="text-base text-muted-foreground">
                    <span className="font-medium">{allocation.role}:</span> {allocation.hours.toFixed(2)}h @ ${allocation.rate}/hr
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Allocation Details */}
      <div className="bg-white dark:bg-gray-800 rounded  p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Work Allocation Analysis</h3>
        <div className="space-y-3">
          {workAllocationData.map(item => {
            const isOverAllocated = item.utilization > 100;
            const isWellAllocated = item.utilization >= 80 && item.utilization <= 100;
            const isBottleneck = item.utilization === Math.max(...workAllocationData.map(d => d.utilization));
            
            return (
              <div key={item.role} className={`flex items-center justify-between p-3 rounded ${
                isBottleneck ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700' : 'bg-secondary'
              }`}>
                <div className="flex-1">
                  <div className="font-medium text-foreground flex items-center gap-2">
                    {item.role}
                    {isBottleneck && (
                      <span className="text-sm bg-warning/20 text-warning px-2 py-1 rounded">
                        BOTTLENECK
                      </span>
                    )}
                  </div>
                  <div className="text-base text-muted-foreground">
                    {item.needed.toFixed(2)}h needed / {item.capacity.toFixed(2)}h available
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded h-2">
                    <div
                      className="h-2 rounded transition-all"
                      style={{
                        width: `${Math.min(item.utilization, 100)}%`,
                        backgroundColor: getUtilizationColor(item.utilization)
                      }}
                    />
                  </div>
                  <span
                    className={`font-semibold ${
                      isOverAllocated ? 'text-red-600 dark:text-red-400' :
                      isWellAllocated ? 'text-primary' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {item.utilization}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};