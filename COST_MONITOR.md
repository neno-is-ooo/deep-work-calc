# Cost Monitor - Real-time Project Cost Tracking

## Overview
The Cost Monitor is a floating, draggable panel that provides real-time visibility into your project costs as you make changes across different tabs.

## Features

### 🎯 Core Functionality
- **Real-time Updates**: Instantly see cost changes as you modify team, content, or fixed costs
- **Floating Panel**: Always visible, regardless of which tab you're on
- **Draggable**: Position it anywhere on your screen
- **Persistent Position**: Remembers where you placed it between sessions

### 📊 Visual Indicators
- **Cost Delta**: Shows increase/decrease from previous value with percentage
- **Color Coding**: 
  - 🟢 Green for cost decreases
  - 🔴 Red for cost increases
- **Sparkline Chart**: Visual trend of last 10 cost changes
- **Animated Transitions**: Smooth updates that catch your eye without being jarring

### 🎮 Controls
- **Minimize/Expand**: Toggle between compact and full view
- **Hide**: Close the monitor (press Ctrl+M to show again)
- **Drag**: Click and hold the header to reposition

### 📈 Information Displayed

#### Expanded View
- Total Project Cost (large, prominent display)
- Cost change indicator (amount and percentage)
- Sparkline trend chart
- Project Duration (weeks)
- Total Hours
- Team Size
- Cost breakdown (Labor vs Fixed costs)

#### Minimized View
- Total Project Cost
- Cost change percentage

## Usage

### Keyboard Shortcuts
- **Ctrl+M**: Toggle show/hide the Cost Monitor

### Positioning
- Default position: Bottom-right corner
- Drag to any position on screen
- Position is saved automatically

### Best Practices
1. **Position for Visibility**: Place it where it won't obstruct your work but remains visible
2. **Use Minimize**: Keep it minimized when you need more screen space
3. **Watch the Trend**: The sparkline helps you understand if costs are trending up or down
4. **Monitor Delta**: Pay attention to the percentage change to understand impact

## Technical Details

### State Persistence
- Position stored in `localStorage`
- Minimize/expand state preserved
- Hidden state remembered

### Performance
- Efficient re-renders only on cost changes
- Debounced calculations to prevent lag
- Limited history (last 10 changes) for memory efficiency

### Responsive Design
- Works on all screen sizes
- Bounds checking prevents dragging off-screen
- Dark mode support

## Troubleshooting

### Monitor Not Visible?
- Press **Ctrl+M** to show
- Check if it's minimized (look for small bar)
- Clear localStorage if position is corrupted

### Position Reset
To reset position to default:
1. Open browser console
2. Run: `localStorage.removeItem('costMonitorPosition')`
3. Refresh the page

### Performance Issues
If experiencing lag:
1. Try minimizing the monitor
2. Clear cost history in localStorage
3. Refresh the page

## Future Enhancements (Planned)
- [ ] Sound effects for significant changes
- [ ] Export cost history
- [ ] Multiple monitor layouts
- [ ] Threshold alerts
- [ ] Comparison mode
- [ ] Budget tracking
- [ ] Cost projections