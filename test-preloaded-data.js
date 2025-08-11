// Test script to verify preloaded data has review hours
const { preloadedTOC } = require('./src/data/preloadedContent.ts');

function analyzeContent() {
  const workNeeded = {
    'Lead Editor': 0,
    'Researcher': 0,
    'Research Assistant': 0,
    'Reviewer': 0,
    'Topic Specialist': 0,
  };
  
  let totalSubsections = 0;
  let subsectionsWithReview = 0;
  let totalReviewHours = 0;
  
  preloadedTOC.forEach(chapter => {
    chapter.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        totalSubsections++;
        
        // Add direct work
        workNeeded['Lead Editor'] += subsection.editorHours;
        workNeeded['Researcher'] += subsection.researcherHours;
        
        // Check review hours
        if (subsection.reviewHours && subsection.reviewHours > 0) {
          subsectionsWithReview++;
          totalReviewHours += subsection.reviewHours;
          
          // Distribute review work based on complexity
          if (subsection.complexity === 3) {
            workNeeded['Topic Specialist'] += subsection.reviewHours * 0.6;
            workNeeded['Reviewer'] += subsection.reviewHours * 0.4;
          } else if (subsection.complexity === 2) {
            workNeeded['Research Assistant'] += subsection.reviewHours * 0.5;
            workNeeded['Reviewer'] += subsection.reviewHours * 0.5;
          } else {
            workNeeded['Research Assistant'] += subsection.reviewHours;
          }
        }
      });
    });
  });
  
  console.log('=== Content Analysis ===');
  console.log('Total subsections:', totalSubsections);
  console.log('Subsections with review hours:', subsectionsWithReview);
  console.log('Total review hours:', totalReviewHours);
  console.log('\n=== Work Distribution ===');
  Object.entries(workNeeded).forEach(([role, hours]) => {
    console.log(`${role}: ${hours.toFixed(1)} hours`);
  });
}

analyzeContent();