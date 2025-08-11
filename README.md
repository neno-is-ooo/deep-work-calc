# Deep Work Project Cost Estimator

A sophisticated web application for realistic project planning based on sustainable deep work principles (5 hours/day, 25 hours/week).

## 🚀 Features

### Core Functionality
- **Deep Work Philosophy**: Built around sustainable 5-hour workdays and 25-hour work weeks
- **Fractional Team Allocation**: Team members can work across multiple roles with hourly limits
- **Content Structure Management**: Hierarchical chapter/section/subsection organization
- **Fixed Costs Tracking**: Software, workshops, and other project expenses
- **Real-time Calculations**: Instant cost and duration estimates
- **Dark Mode**: Full dark mode support with system preference detection

### CSV Import/Export
- **Template Download**: Get a pre-formatted CSV template with examples
- **Bulk Import**: Import your entire content structure from CSV
- **Data Export**: Export current structure for external editing
- **Format**: Chapter, Section, Subsection, Complexity, Editor Hours, Researcher Hours, Review Hours

## 📋 CSV Template Format

The CSV import feature accepts the following format:

```csv
Chapter,Section,Subsection,Complexity,Editor Hours,Researcher Hours,Review Hours
Chapter 1: Introduction,,Overview,1,2,3,1
Chapter 1: Introduction,Background,Historical Context,2,4,6,2
Chapter 2: Core Concepts,,Main Ideas,2,4,6,2
```

**Notes:**
- Leave Section blank if subsections belong directly to the chapter
- Complexity: 1=Simple, 2=Moderate, 3=Complex
- Hours are per subsection

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with dark mode
- **State Management**: Zustand
- **Charts**: Recharts
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **CSV Processing**: PapaParse

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the v2 directory
cd estimator-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3002`

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm test          # Run tests
npm run test:ui   # Run tests with UI
npm run lint      # Run ESLint
```

## 🎨 Dark Mode

The application supports three theme modes:
- **Light**: Traditional light theme
- **Dark**: Eye-friendly dark theme
- **System**: Follows OS preference

Toggle the theme using the sun/moon icon in the top-right corner.

## 📊 Project Structure

```
estimator-v2/
├── src/
│   ├── components/
│   │   ├── team/          # Team management
│   │   ├── content/       # Content structure
│   │   ├── costs/         # Fixed costs
│   │   ├── results/       # Dashboard & charts
│   │   └── ui/            # Shared UI components
│   ├── hooks/             # Custom React hooks
│   ├── store/             # Zustand store
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   └── data/              # Pre-loaded content
├── content-structure-template.csv  # Sample CSV template
└── tests/                 # Test files
```

## 💾 Data Storage

All data is stored locally in your browser using localStorage. No data is sent to external servers.

## 🧪 Testing

The project includes comprehensive tests for:
- Calculation utilities
- State management
- Component rendering
- Deep work philosophy enforcement

Run tests with: `npm test`

## 📈 Philosophy

This tool is built on the principle that sustainable, high-quality work happens in focused 5-hour blocks, not traditional 8-hour days. It helps teams plan realistic project timelines that prevent burnout while maintaining productivity.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

Built with sustainable work principles inspired by Cal Newport's Deep Work philosophy.