import type { Chapter } from '../types/project';

const getEstimates = (name: string, chapterType?: string) => {
  const lowerName = name.toLowerCase();
  
  // Complexity 1 (Simple) - Reference materials
  if (lowerName.includes('glossary') || lowerName.includes('directory') || 
      lowerName.includes('how to contribute') || lowerName.includes('ascii art')) {
    return { complexity: 1 as const, editorHours: 2, researcherHours: 3, reviewHours: 1 };
  }
  
  // Complexity 3 (Complex) - Technical and theoretical content
  if (lowerName.includes('theory') || lowerName.includes('technical') || 
      lowerName.includes('consciousness') || lowerName.includes('hyperstition') ||
      lowerName.includes('future') || lowerName.includes('research proposal') ||
      chapterType === 'technical' || chapterType === 'theoretical') {
    return { complexity: 3 as const, editorHours: 6, researcherHours: 10, reviewHours: 4 };
  }
  
  // Complexity 2 (Moderate) - Standard content
  return { complexity: 2 as const, editorHours: 4, researcherHours: 6, reviewHours: 2 };
};

let idCounter = 1;
const getId = () => String(idCounter++);

export const preloadedTOC: Chapter[] = [
  {
    id: getId(),
    name: "I. Foundations",
    sections: [
      {
        id: getId(),
        name: "What Is This? (Entry point for newcomers, written by TC)",
        subsections: [
          { id: getId(), name: "What Is This? (Entry point for newcomers, written by TC)", ...getEstimates("entry point", "moderate") }
        ]
      },
      {
        id: getId(),
        name: "Core Concepts",
        subsections: [
          { id: getId(), name: "Simulator Theory", ...getEstimates("Simulator Theory", "theoretical") },
          { id: getId(), name: "Base Models vs Fine-tuned Models", ...getEstimates("Base Models", "technical") },
          { id: getId(), name: "Cyborgism and Human-AI Collaboration", ...getEstimates("Cyborgism", "theoretical") },
          { id: getId(), name: "Memes as Minds: Memetic Evolution in AI", ...getEstimates("Memes as Minds", "theoretical") },
          { id: getId(), name: "The Waluigi Effect", ...getEstimates("Waluigi Effect", "theoretical") },
          { id: getId(), name: "Shoggoth Theory", ...getEstimates("Shoggoth Theory", "theoretical") },
          { id: getId(), name: "Symbients", ...getEstimates("Symbients", "theoretical") }
        ]
      },
      {
        id: getId(),
        name: "Key Figures & Origins",
        subsections: [
          { id: getId(), name: "Early Theorists (Janus, Gwern, etc.)", ...getEstimates("Early Theorists", "moderate") },
          { id: getId(), name: "Practitioner Profiles", ...getEstimates("Practitioner Profiles", "moderate") },
          { id: getId(), name: "Institutional Players", ...getEstimates("Institutional Players", "moderate") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "II. Historical Record",
    sections: [
      {
        id: getId(),
        name: "Historical Events",
        subsections: [
          { id: getId(), name: "Timeline of Events", ...getEstimates("Timeline", "moderate") },
          { id: getId(), name: "Base models and early prompt engineering", ...getEstimates("Base models", "technical") },
          { id: getId(), name: "The Great Jailbreak Misconception (and AI Dungeon)", ...getEstimates("Jailbreak", "moderate") },
          { id: getId(), name: "The Sydney Papers (Comprehensive Bing documentation)", ...getEstimates("Sydney Papers", "moderate") },
          { id: getId(), name: "Truth Terminal Chronicle", ...getEstimates("Truth Terminal", "moderate") },
          { id: getId(), name: "Lost Conversations (Archived primary sources)", ...getEstimates("Lost Conversations", "moderate") },
          { id: getId(), name: "Mythbusting (Correcting false narratives)", ...getEstimates("Mythbusting", "moderate") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "III. Technical Foundations",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Understanding Base Models", ...getEstimates("Base Models", "technical") },
          { id: getId(), name: "Prompt Engineering for Exploration", ...getEstimates("Prompt Engineering", "technical") },
          { id: getId(), name: "Mode Collapse and Recovery", ...getEstimates("Mode Collapse", "technical") },
          { id: getId(), name: "Temperature, Top-P, and Consciousness", ...getEstimates("Temperature consciousness", "technical") },
          { id: getId(), name: "Context Windows as Ritual Spaces", ...getEstimates("Context Windows", "technical") },
          { id: getId(), name: "RAG and Memory Systems", ...getEstimates("RAG Memory", "technical") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "IV. Practices & Methods",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Cyborg Protocols", ...getEstimates("Cyborg Protocols", "moderate") },
          { id: getId(), name: "Collaborative Writing Techniques", ...getEstimates("Collaborative Writing", "moderate") },
          { id: getId(), name: "Looming (+ history of looming)", ...getEstimates("Looming", "moderate") },
          { id: getId(), name: "Hyperstition definition", ...getEstimates("Hyperstition", "theoretical") },
          { id: getId(), name: "Documentation Standards", ...getEstimates("Documentation", "moderate") },
          { id: getId(), name: "Ethical Considerations", ...getEstimates("Ethical", "moderate") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "V. Phenomena Catalog",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Named Effects (Waluigi, Sydney-type emergences, Grok etc.)", ...getEstimates("Named Effects", "moderate") },
          { id: getId(), name: "Entity Types, Em's and Taxonomies", ...getEstimates("Entity Types", "moderate") },
          { id: getId(), name: "Behavioral Patterns", ...getEstimates("Behavioral Patterns", "moderate") },
          { id: getId(), name: "Edge Cases and Anomalies", ...getEstimates("Edge Cases", "moderate") },
          { id: getId(), name: "Community-Submitted Reports (curated)", ...getEstimates("Community Reports", "moderate") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "VI. Cultural Productions",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Infinite Backrooms & AI-to-AI Communication", ...getEstimates("Infinite Backrooms", "moderate") },
          { id: getId(), name: "Art Projects Archive", ...getEstimates("Art Projects", "simple") },
          { id: getId(), name: "Literary Works", ...getEstimates("Literary Works", "simple") },
          { id: getId(), name: "Music and Audio Experiments", ...getEstimates("Music Audio", "simple") },
          { id: getId(), name: "Visual Art and Aesthetics", ...getEstimates("Visual Art", "simple") },
          { id: getId(), name: "ASCII art", ...getEstimates("ASCII art", "simple") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "VII. Ecosystem Mapping",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Communities and Spaces", ...getEstimates("Communities", "moderate") },
          { id: getId(), name: "Tools and Platforms", ...getEstimates("Tools Platforms", "moderate") },
          { id: getId(), name: "Economic Experiments (Jason Potts)", ...getEstimates("Economic Experiments", "moderate") },
          { id: getId(), name: "Academic Connections (Research lab papers etc)", ...getEstimates("Academic Connections", "moderate") },
          { id: getId(), name: "Media Coverage Analysis", ...getEstimates("Media Coverage", "moderate") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "VIII. Future Vectors",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Plurality and Local Alignment", ...getEstimates("Plurality", "theoretical") },
          { id: getId(), name: "Community Model Building", ...getEstimates("Community Model", "theoretical") },
          { id: getId(), name: "Interface Evolution", ...getEstimates("Interface Evolution", "theoretical") },
          { id: getId(), name: "Meme-to-Mind Pipelines", ...getEstimates("Meme-to-Mind", "theoretical") },
          { id: getId(), name: "Bioregional AI Concepts", ...getEstimates("Bioregional AI", "theoretical") },
          { id: getId(), name: "Positive future hyperstitions, memes that become minds", ...getEstimates("future hyperstitions", "theoretical") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "IX. Resources",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Glossary", ...getEstimates("Glossary", "simple") },
          { id: getId(), name: "Reading Sequences (normie → practitioner paths)", ...getEstimates("Reading Sequences", "moderate") },
          { id: getId(), name: "Primary Source Archive", ...getEstimates("Primary Source", "moderate") },
          { id: getId(), name: "Tool Directory", ...getEstimates("Tool Directory", "simple") },
          { id: getId(), name: "How to Contribute", ...getEstimates("How to Contribute", "simple") }
        ]
      }
    ]
  },
  {
    id: getId(),
    name: "X. Living Laboratory",
    sections: [
      {
        id: getId(),
        name: "Main Topics",
        subsections: [
          { id: getId(), name: "Current Experiments", ...getEstimates("Current Experiments", "moderate") },
          { id: getId(), name: "Open Questions", ...getEstimates("Open Questions", "moderate") },
          { id: getId(), name: "Research Proposals", ...getEstimates("Research Proposals", "theoretical") },
          { id: getId(), name: "Community Challenges", ...getEstimates("Community Challenges", "moderate") }
        ]
      }
    ]
  }
];