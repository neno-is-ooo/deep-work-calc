import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { TeamManagement } from './components/team/TeamManagement';
import { ContentStructure } from './components/content/ContentStructure';
import { FixedCosts } from './components/costs/FixedCosts';
import { ProjectDashboard } from './components/results/ProjectDashboard';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { CostMonitor } from './components/CostMonitor';
import { useTheme } from './hooks/useTheme';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('philosophy');
  useTheme(); // Initialize theme

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            boxShadow: 'var(--shadow-md)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'var(--card)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: 'var(--card)',
            },
          },
        }}
      />
      <CostMonitor />
      
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <header className="relative mb-12">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-serif font-light text-foreground">
            Deep Work Budget Calculator
          </h1>
          <p className="font-sans text-muted-foreground mt-2 text-base">
            Velocity-based budget envelopes for sustainable knowledge work
          </p>
          <div className="mt-6 p-3 bg-secondary/30 rounded text-muted-foreground text-base font-sans max-w-2xl border border-border">
            📔 No data is retained on servers - all data is stored locally in your browser
          </div>
        </header>
        
        <div className="bg-card rounded border border-border overflow-hidden shadow-sm">
          <div className="border-b border-border">
            <nav className="flex">
              {['philosophy', 'content', 'costs', 'results'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 text-base font-medium transition-all relative ${
                    activeTab === tab
                      ? 'text-foreground bg-card'
                      : 'text-muted-foreground hover:text-foreground bg-secondary/20'
                  }`}
                >
                  {tab === 'philosophy' && 'Philosophy & Team'}
                  {tab === 'content' && 'Content Structure'}
                  {tab === 'costs' && 'Fixed Costs'}
                  {tab === 'results' && 'Results & Export'}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === 'philosophy' && <TeamManagement />}
            {activeTab === 'content' && <ContentStructure />}
            {activeTab === 'costs' && <FixedCosts />}
            {activeTab === 'results' && <ProjectDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
