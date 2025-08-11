import React, { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ChevronDown, ChevronRight, Upload, Download, FileDown, Trash2, Shuffle } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import type { Chapter, Subsection } from '../../types/project';

export const ContentStructure: React.FC = () => {
  const { project, updateSubsection, importChapters } = useProjectStore();
  // Initialize with all chapters expanded
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(project.chapters.map(ch => ch.id))
  );
  // Initialize with all sections expanded
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(project.chapters.flatMap(ch => ch.sections.map(s => s.id)))
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleClearContent = () => {
    // Create a custom confirmation using toast
    toast(
      (t) => (
        <div>
          <p className="font-medium mb-2">Clear all content?</p>
          <p className="text-sm text-muted-foreground mb-3">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                importChapters([]);
                toast.dismiss(t.id);
                toast.success('Content cleared');
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Clear
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

  const handleRandomizeParameters = () => {
    const randomizedChapters = project.chapters.map(chapter => ({
      ...chapter,
      sections: chapter.sections.map(section => ({
        ...section,
        subsections: section.subsections.map(subsection => ({
          ...subsection,
          complexity: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
          editorHours: Math.floor(Math.random() * 20) + 5,
          researcherHours: Math.floor(Math.random() * 15) + 3,
          reviewHours: Math.floor(Math.random() * 8) + 4,
        }))
      }))
    }));
    importChapters(randomizedChapters);
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        const chapters: Chapter[] = [];
        let currentChapter: Chapter | null = null;

        data.forEach((row, index) => {
          if (index === 0) return; // Skip header
          
          const [chapterName, sectionName, subsectionName, complexity, editorHours, researcherHours, reviewHours] = row;
          
          // Skip empty rows
          if (!chapterName && !sectionName && !subsectionName) return;
          
          // New chapter - check if it already exists
          if (chapterName && chapterName.trim()) {
            const existingChapter = chapters.find(ch => ch.name === chapterName.trim());
            if (existingChapter) {
              currentChapter = existingChapter;
            } else {
              currentChapter = {
                id: crypto.randomUUID(),
                name: chapterName.trim(),
                sections: []
              };
              chapters.push(currentChapter);
            }
          }
          
          // Handle subsections
          if (subsectionName && subsectionName.trim() && currentChapter) {
            // Case 1: Subsection with a section name
            if (sectionName && sectionName.trim()) {
              // Find or create the section
              let section = currentChapter.sections.find(sec => sec.name === sectionName.trim());
              if (!section) {
                section = {
                  id: crypto.randomUUID(),
                  name: sectionName.trim(),
                  subsections: []
                };
                currentChapter.sections.push(section);
              }
              
              // Add subsection to this section
              const existingSubsection = section.subsections.find(
                sub => sub.name === subsectionName.trim()
              );
              
              if (!existingSubsection) {
                const subsection: Subsection = {
                  id: crypto.randomUUID(),
                  name: subsectionName.trim(),
                  complexity: complexity ? parseInt(complexity) as 1 | 2 | 3 : 2,
                  editorHours: editorHours ? parseFloat(editorHours) : 4,
                  researcherHours: researcherHours ? parseFloat(researcherHours) : 6,
                  reviewHours: reviewHours ? parseFloat(reviewHours) : 2
                };
                section.subsections.push(subsection);
              }
            }
            // Case 2: Subsection without a section name (direct under chapter)
            else {
              // Create a section with the subsection's name
              let section = currentChapter.sections.find(sec => sec.name === subsectionName.trim());
              if (!section) {
                section = {
                  id: crypto.randomUUID(),
                  name: subsectionName.trim(),
                  subsections: []
                };
                currentChapter.sections.push(section);
                
                // Add a single subsection with the same name
                const subsection: Subsection = {
                  id: crypto.randomUUID(),
                  name: subsectionName.trim(),
                  complexity: complexity ? parseInt(complexity) as 1 | 2 | 3 : 2,
                  editorHours: editorHours ? parseFloat(editorHours) : 4,
                  researcherHours: researcherHours ? parseFloat(researcherHours) : 6,
                  reviewHours: reviewHours ? parseFloat(reviewHours) : 2
                };
                section.subsections.push(subsection);
              }
            }
          }
        });
        
        importChapters(chapters);
        toast.success(`CSV imported successfully! ${chapters.length} chapters loaded.`);
      }
    });
  };

  const exportToCSV = () => {
    const rows = [['Chapter', 'Section', 'Subsection', 'Complexity', 'Editor Hours', 'Researcher Hours', 'Review Hours']];
    
    project.chapters.forEach(chapter => {
      chapter.sections.forEach(section => {
        section.subsections.forEach(subsection => {
          rows.push([
            chapter.name,
            section.name === 'Main Topics' ? '' : section.name,
            subsection.name,
            subsection.complexity.toString(),
            subsection.editorHours.toString(),
            subsection.researcherHours.toString(),
            subsection.reviewHours.toString()
          ]);
        });
      });
    });
    
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-structure-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const downloadTemplate = () => {
    // Create a template with example data and instructions
    const templateRows = [
      ['Chapter', 'Section', 'Subsection', 'Complexity', 'Editor Hours', 'Researcher Hours', 'Review Hours'],
      ['# Instructions: Fill in your content structure below. Delete this row and the example rows when done.', '', '', '', '', '', ''],
      ['# Complexity: 1=Simple (definitions), 2=Moderate (standard content), 3=Complex (technical concepts)', '', '', '', '', '', ''],
      ['# Leave Section blank if subsections belong directly to the chapter', '', '', '', '', '', ''],
      ['# Example rows below - replace with your content:', '', '', '', '', '', ''],
      ['Chapter 1: Introduction', '', 'Overview of the Topic', '1', '2', '3', '1'],
      ['Chapter 1: Introduction', '', 'Key Concepts', '2', '4', '6', '2'],
      ['Chapter 1: Introduction', 'Historical Context', 'Early Development', '2', '3', '5', '1'],
      ['Chapter 1: Introduction', 'Historical Context', 'Modern Evolution', '3', '5', '8', '2'],
      ['Chapter 2: Core Concepts', '', 'Fundamental Principles', '2', '4', '6', '2'],
      ['Chapter 2: Core Concepts', 'Technical Details', 'Implementation', '3', '6', '10', '3'],
      ['Chapter 2: Core Concepts', 'Technical Details', 'Best Practices', '2', '4', '6', '2'],
    ];
    
    const csv = Papa.unparse(templateRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-structure-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getComplexityColor = (complexity: number) => {
    switch (complexity) {
      case 1: return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400';
      case 2: return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400';
      case 3: return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };



  const calculateChapterTotals = (chapter: Chapter) => {
    let editorHours = 0;
    let researcherHours = 0;
    let reviewHours = 0;
    
    chapter.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        editorHours += subsection.editorHours;
        researcherHours += subsection.researcherHours;
        reviewHours += subsection.reviewHours;
      });
    });
    
    return { editorHours, researcherHours, reviewHours };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-foreground">Content Structure</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-muted-foreground px-3 py-1.5 rounded border border-border hover:bg-accent transition-colors text-sm"
            title="Download a CSV template with instructions and examples"
          >
            <FileDown className="w-4 h-4" />
            Get Template
          </button>
          <label className="flex items-center gap-1.5 text-muted-foreground px-3 py-1.5 rounded border border-border hover:bg-accent cursor-pointer transition-colors text-sm">
            <Upload className="w-4 h-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="hidden"
            />
          </label>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 text-muted-foreground px-3 py-1.5 rounded border border-border hover:bg-accent transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleRandomizeParameters}
            className="flex items-center gap-1.5 text-muted-foreground px-3 py-1.5 rounded border border-border hover:bg-accent transition-colors text-sm"
            title="Generate random hours and complexity for all subsections"
          >
            <Shuffle className="w-4 h-4" />
            Randomize
          </button>
          <button
            onClick={handleClearContent}
            className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 px-3 py-1.5 rounded border border-rose-300 dark:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors text-sm"
            title="Clear all content structure"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Complexity Guide */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Complexity Guide</h3>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">Simple</span>
            <span className="text-muted-foreground">Basic definitions, glossaries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">Moderate</span>
            <span className="text-muted-foreground">Standard content, documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400">Complex</span>
            <span className="text-muted-foreground">Technical concepts, theory</span>
          </div>
        </div>
      </div>

      {/* CSV Import Help */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded p-4">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">📋 CSV Import Format</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p>
            <strong>Quick Start:</strong> Click "Get Template" to download a pre-formatted CSV with examples and instructions.
          </p>
          <p>
            <strong>Format:</strong> Your CSV should have columns for: Chapter, Section, Subsection, Complexity (1-3), Editor Hours, Researcher Hours, Review Hours
          </p>
          <p>
            <strong>Tip:</strong> Leave the Section column empty if subsections belong directly to a chapter (no intermediate section).
          </p>
        </div>
      </div>

      {/* Content Tree */}
      <div className="space-y-4">
        {project.chapters.map(chapter => {
          const isExpanded = expandedChapters.has(chapter.id);
          const totals = calculateChapterTotals(chapter);
          
          return (
            <div key={chapter.id} className="bg-white dark:bg-gray-800 rounded  border border-border">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  <h3 className="text-lg font-semibold text-foreground">{chapter.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Editor: {totals.editorHours}h</span>
                  <span>Research: {totals.researcherHours}h</span>
                  <span>Review: {totals.reviewHours}h</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="border-t border-border">
                  {chapter.sections.map(section => {
                    const isSectionExpanded = expandedSections.has(section.id);
                    
                    return (
                      <div key={section.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <div
                          className="px-8 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(section.id);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {isSectionExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">{section.name}</h4>
                          </div>
                        </div>
                        
                        {isSectionExpanded && (
                          <div className="px-12 pb-3">
                            {section.subsections.map(subsection => (
                              <div key={subsection.id} className="py-2 border-b border-gray-50 dark:border-gray-700 last:border-b-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <span className="text-gray-700 dark:text-gray-300">{subsection.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <select
                                      value={subsection.complexity}
                                      onChange={(e) => updateSubsection(
                                        chapter.id,
                                        section.id,
                                        subsection.id,
                                        { complexity: parseInt(e.target.value) as 1 | 2 | 3 }
                                      )}
                                      className={`px-3 py-1 rounded text-sm font-medium ${getComplexityColor(subsection.complexity)}`}
                                    >
                                      <option value="1">Simple</option>
                                      <option value="2">Moderate</option>
                                      <option value="3">Complex</option>
                                    </select>
                                    
                                    <div className="flex items-center gap-1">
                                      <label className="text-sm text-muted-foreground">Editor:</label>
                                      <input
                                        type="number"
                                        value={subsection.editorHours}
                                        onChange={(e) => updateSubsection(
                                          chapter.id,
                                          section.id,
                                          subsection.id,
                                          { editorHours: parseFloat(e.target.value) || 0 }
                                        )}
                                        className="w-16 px-2 py-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm font-mono"
                                        min="0"
                                        step="0.5"
                                      />
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <label className="text-sm text-muted-foreground">Research:</label>
                                      <input
                                        type="number"
                                        value={subsection.researcherHours}
                                        onChange={(e) => updateSubsection(
                                          chapter.id,
                                          section.id,
                                          subsection.id,
                                          { researcherHours: parseFloat(e.target.value) || 0 }
                                        )}
                                        className="w-16 px-2 py-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm font-mono"
                                        min="0"
                                        step="0.5"
                                      />
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                      <label className="text-sm text-muted-foreground">Review:</label>
                                      <input
                                        type="number"
                                        value={subsection.reviewHours}
                                        onChange={(e) => updateSubsection(
                                          chapter.id,
                                          section.id,
                                          subsection.id,
                                          { reviewHours: parseFloat(e.target.value) || 0 }
                                        )}
                                        className="w-16 px-2 py-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm font-mono"
                                        min="0"
                                        step="0.5"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};