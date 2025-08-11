#!/bin/bash

# Update all TypeScript/TSX files to use new field names
echo "Migrating field names..."

# Replace reviewHours with the new fields in all files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e 's/reviewHours: 0/researchAssistantHours: 0, topicSpecialistHours: 0, reviewerHours: 0/g' \
  -e 's/reviewHours: /researchAssistantHours: 0, topicSpecialistHours: 0, reviewerHours: /g' \
  {} \;

echo "Migration complete!"