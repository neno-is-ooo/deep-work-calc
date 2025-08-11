import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { calculateProjectCosts, calculateFixedCosts, calculateTotalHours } from '../../utils/calculations';
import { DollarSign, TrendingUp, TrendingDown, Minus, Clock, Users, AlertCircle } from 'lucide-react';

interface CostHistory {
  timestamp: number;
  cost: number;
  duration: number;
  hours: number;
}

export const CostMonitor: React.FC = () => {
  const { project } = useProjectStore();
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized by default
  const [costHistory, setCostHistory] = useState<CostHistory[]>([]);
  const [previousCost, setPreviousCost] = useState<number | null>(null);

  // Calculate current costs
  const costData = calculateProjectCosts(project);
  const fixedCosts = calculateFixedCosts(project);
  const totalHours = calculateTotalHours(project);
  const totalCost = costData.total + fixedCosts;

  // Load saved state from localStorage
  useEffect(() => {
    const savedMinimized = localStorage.getItem('costMonitorMinimized');
    
    if (savedMinimized === 'false') {
      setIsMinimized(false);
    }
  }, []);

  // Track cost changes
  useEffect(() => {
    if (previousCost !== null && previousCost !== totalCost) {
      setCostHistory(prev => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          cost: totalCost,
          duration: costData.duration,
          hours: totalHours
        }];
        // Keep only last 10 entries
        return newHistory.slice(-10);
      });
    }
    setPreviousCost(totalCost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCost, costData.duration, totalHours]);

  // Toggle minimize state
  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('costMonitorMinimized', String(newState));
  };



  // Calculate cost delta
  const costDelta = previousCost !== null ? totalCost - previousCost : 0;
  const costDeltaPercent = previousCost !== null && previousCost > 0 
    ? ((costDelta / previousCost) * 100).toFixed(1) 
    : '0';

  // Generate sparkline data
  const sparklineData = costHistory.map(h => h.cost);
  const maxCost = Math.max(...sparklineData, totalCost);
  const minCost = Math.min(...sparklineData, totalCost);
  const range = maxCost - minCost || 1;

  // Find bottleneck role
  const bottleneckRole = Object.keys(costData.workNeeded).reduce((prev, curr) => {
    const prevWeeks = costData.teamCapacity[prev] ? costData.workNeeded[prev] / costData.teamCapacity[prev] : 0;
    const currWeeks = costData.teamCapacity[curr] ? costData.workNeeded[curr] / costData.teamCapacity[curr] : 0;
    return currWeeks > prevWeeks ? curr : prev;
  }, 'Lead Editor');

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`bg-card border border-border transition-all duration-300 ${
          isMinimized ? 'px-4 py-2 rounded' : 'rounded px-4 py-3'
        }`}
      >


        {/* Content */}
        {isMinimized ? (
          // Minimized view - informative but compact
          <div className="flex items-center gap-5">
            <button
              onClick={toggleMinimize}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Click for details"
            >
              <DollarSign className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">
                    ${totalCost.toLocaleString()}
                  </span>
                  {costDelta !== 0 && (
                    <span className={`text-base ${
                      costDelta > 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {costDelta > 0 ? '↑' : '↓'}{Math.abs(Number(costDeltaPercent))}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Project Cost
                </div>
              </div>
            </button>
            
            <div className="border-l pl-5 border-gray-300 dark:border-gray-600">
              <div className="text-base font-semibold text-foreground">
                {costData.duration} weeks
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Duration
              </div>
            </div>
            
            <div className="border-l pl-5 border-gray-300 dark:border-gray-600">
              <div className="text-base font-semibold text-warning">
                {bottleneckRole}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Bottleneck
              </div>
            </div>

            <div className="border-l pl-5 border-gray-300 dark:border-gray-600">
              <div className="text-base font-semibold text-foreground">
                {totalHours.toLocaleString()}h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Hours
              </div>
            </div>
          </div>
        ) : (
          // Expanded view - compact horizontal layout
          <div className="flex items-center gap-6">
            <button
              onClick={toggleMinimize}
              className="hover:opacity-80 transition-opacity"
              title="Minimize"
            >
              <Minus className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {/* Main Cost */}
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ${totalCost.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Labor: ${costData.total.toLocaleString()} + Fixed: ${fixedCosts.toLocaleString()}
                </div>
              </div>
              {costDelta !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${
                  costDelta > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {costDelta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{costDeltaPercent}%</span>
                </div>
              )}
            </div>

            {/* Sparkline */}
            {sparklineData.length > 1 && (
              <div className="h-8 w-24 flex items-end gap-0.5">
                {sparklineData.slice(-8).map((cost, i) => {
                  const height = ((cost - minCost) / range) * 100;
                  const isLast = i === sparklineData.slice(-8).length - 1;
                  
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${
                        isLast ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ height: `${height}%`, minHeight: '2px' }}
                    />
                  );
                })}
              </div>
            )}

            <div className="border-l pl-4 border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">{costData.duration} weeks</span>
              </div>
            </div>

            <div className="border-l pl-4 border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {bottleneckRole}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">(bottleneck)</span>
              </div>
            </div>

            <div className="border-l pl-4 border-gray-300 dark:border-gray-600">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{project.teamMembers.length} members</span>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
  );
};