# Patela Expense Tracker

A privacy-first, cross-platform desktop expense tracking application built with Electron.

## About

This expense tracker was built by journalist [Sergio Spagnuolo](https://spagnuolo.news) using [Claude Code](https://www.anthropic.com/claude-code) out of frustration by the pricing and lack of privacy of current Mac and iOS expense trackers. It is named after my dog, [Patela](https://notas.spagnuolo.news/primeira-foto-das-minhas-tres-cachorras-sentadas-juntas-em-anos)</a>.

### Clone and setup
git clone https://github.com/sergiospagnuolo/patela-expense-tracker.git
cd patela-expense-tracker
npm install

### Development
npm start              # Run the app
npm run dev           # Run with logging

### Building
npm run build         # Build for your platform
npm run build-all     # Build for all platforms
npm run dist          # Clean build from scratch

## Features

- **Track Income & Expenses** - Comprehensive transaction management with 20+ categories
- **Data Visualization** - Heat map view and horizontal bar charts for spending analysis
- **Advanced Filtering** - Filter by category, tags, and date ranges
- **Privacy-First** - All data stays local on your computer
- **Cross-Platform** - Works on Windows, Mac, and Linux
- **Open Source** - 100% transparent and community-driven

## Privacy & Security

Patela Expense Tracker is very privacy-friendly. Here's what you need to know about how it works:

### Privacy-Safe Features

- **No External APIs** - App works completely offline
- **No internet connections** - Nothing leaves your computer
- **No data sent to servers** - All data stays local
- **No cloud storage** - Your data remains on your device
- **No analytics tracking** - We don't monitor your usage
- **No ads or third-party services** - Clean experience

### Local-Only Data Storage

All data stays on your computer in a secure SQLite database:

- **Mac:** `~/Library/Application Support/patela-expense-tracker/`
- **Windows:** `%APPDATA%/patela-expense-tracker/`
- **Linux:** `~/.config/patela-expense-tracker/`

### No Data Collection

- **No user tracking** - We don't know who you are
- **No usage statistics** - Your behavior isn't monitored
- **No personal info collection** - We don't ask for details
- **No automatic updates that phone home** - Manual updates only

### What This Means

- **Your financial data never leaves your computer**
- **No one can access your expense information**
- **Works completely offline**
- **No account creation or login required**
- **No privacy policy needed** (since no data is collected)

### Privacy Score: 10/10

Patela Expense Tracker is as private as it gets! It's essentially like keeping a digital notebook on your computer - completely private and secure.

**Major advantage:** Unlike web-based expense trackers that store your financial data on their servers, Patela keeps everything local and private.

## Technical Stack

- **Electron** - Cross-platform desktop app framework
- **Node.js** - JavaScript runtime for the backend
- **SQLite** - Local database for storing transaction data
- **better-sqlite3** - High-performance SQLite bindings
- **HTML/CSS/JavaScript** - Frontend interface
- **electron-builder** - Application packaging and distribution

## Design Philosophy

- **Privacy First** - No external connections or data collection
- **Local Storage** - All data remains on your computer
- **Simplicity** - Clean, intuitive interface
- **Open Source** - Transparent and community-driven
- **Cross-Platform** - Works on Windows, Mac, and Linux

## Installation

### Download Pre-built Releases

Download the latest release for your platform:

- **Windows:** `.exe` installer or portable version
- **Mac:** `.dmg` disk image
- **Linux:** `.AppImage`, `.deb`, or `.rpm` package

### Build from Source

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sergiospagnuolo/patela-expense-tracker.git
   cd patela-expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```

4. **Build for your platform:**
   ```bash
   npm run build
   ```

5. **Build for specific platforms:**
   ```bash
   npm run build-win    # Windows
   npm run build-mac    # Mac
   npm run build-linux  # Linux
   ```

## Usage

1. **Add Transactions** - Click "Add Transaction" to record income or expenses
2. **Categorize** - Choose from 20+ predefined categories
3. **Tag** - Add custom tags for better organization
4. **Visualize** - Toggle between grid and chart views for category analysis
5. **Filter** - Use category, tag, and date filters to analyze spending patterns

## Categories

The app includes comprehensive expense categories:

- Administrative
- Books & Education
- Clothing & Accessories
- Eat out
- Electronics
- Emergency
- Entertainment
- Gifts & Souvenirs
- Groceries
- Health & Medical
- Housing
- Internet & Phone
- Laundry & Cleaning
- Personal Care
- Shopping
- Sightseeing & Tours
- Sports & Fitness
- Transportation
- Travel & Vacation
- Utilities

## Built with Claude Code

This project showcases the power of AI-assisted development using Anthropic's Claude Code. The entire application was developed through collaborative programming between human creativity and AI technical assistance.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with privacy in mind by [Sergio Spagnuolo](https://spagnuolo.news) using [Claude Code](https://www.anthropic.com/claude-code)**