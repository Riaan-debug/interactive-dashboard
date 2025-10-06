# Interactive Analytics Dashboard

A professional, interactive business intelligence dashboard built with React and modern web technologies. This dashboard demonstrates advanced data visualization, responsive design, and modern UI/UX patterns with full backend integration.

## Features

### Data Visualization
- **Interactive Charts**: Line, bar, and doughnut charts with Chart.js
- **Real-time Updates**: Dynamic data filtering and period selection
- **Responsive Charts**: Optimized for all screen sizes
- **Customizable Display**: Grid lines toggle and chart transparency controls

### Business Intelligence
- **KPI Metrics**: Sales, users, conversion rates, and orders tracking
- **Period Filtering**: Week, month, and year views
- **Performance Indicators**: Trend analysis with visual indicators
- **Performance Monitoring**: Real-time FPS, render time, CPU, and memory tracking

### Modern UI/UX
- **Dynamic Theming**: Customizable primary color system
- **Font Size Controls**: Small, medium, and large text options
- **Dark/Light Mode**: Full theme support with proper contrast
- **Responsive Layout**: Mobile-first design approach
- **Interactive Elements**: Hover effects, transitions, and smooth animations
- **Settings Persistence**: User preferences saved across sessions

### Backend Integration
- **Node.js API**: Express server with SQLite database
- **Data Export**: Real Excel (.xlsx), PDF, CSV, and JSON file generation
- **Backup System**: Automated backup creation and history tracking
- **Security**: CORS configuration, CSP headers, and proper error handling

## Tech Stack

### Frontend
- **Framework**: React 18 with modern hooks and context API
- **Charts**: Chart.js with React wrappers
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for modern iconography
- **Build Tool**: Vite for fast development and building
- **State Management**: React Context for global settings

### Backend
- **Runtime**: Node.js with Express framework
- **Database**: SQLite for data persistence
- **File Generation**: XLSX and PDFKit libraries
- **Security**: CORS middleware and security headers

## Dashboard Components

### Statistics Cards
- Total Sales with trend indicators
- User growth metrics
- Conversion rate analysis
- Order tracking with animated counters

### Interactive Charts
- **Sales Overview**: Line chart with period filtering
- **Revenue Analysis**: Quarterly bar chart
- **Device Usage**: Doughnut chart for platform distribution
- **Performance Metrics**: Real-time monitoring charts

### Settings & Configuration
- **Appearance Settings**: Primary color selection and font size controls
- **Chart Settings**: Grid lines and transparency controls
- **Notification Preferences**: Email alerts, push notifications, reports
- **Data Management**: Backup settings and export preferences

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Riaan-debug/interactive-dashboard.git
   cd interactive-dashboard
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

5. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to `http://localhost:3052`

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with your production-ready dashboard.

## Project Structure

```
interactive-dashboard/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React context providers
│   ├── data/              # Mock data and configurations
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── main.jsx           # Application entry point
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── database.sqlite    # SQLite database
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## Key Features Demonstrated

### Technical Skills
- **React Development**: Modern hooks, context API, component architecture
- **Data Visualization**: Interactive charts with Chart.js
- **Backend Integration**: Node.js API with database operations
- **File Generation**: Real Excel and PDF export functionality
- **State Management**: Global settings with persistence
- **Security**: CORS, CSP headers, and error handling

### Design & UX
- **Dynamic Theming**: CSS custom properties for color theming
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **User Experience**: Intuitive settings and smooth animations
- **Professional UI**: Clean, corporate-ready interface

### Business Intelligence
- **KPI Tracking**: Sales, users, conversion rates, orders
- **Performance Monitoring**: Real-time system metrics
- **Data Export**: Multiple format support for reporting
- **Backup Management**: Automated data protection

## Customization

### Data Sources
- Replace mock data with real API endpoints
- Connect to your own data sources
- Add real-time data streaming with WebSockets

### Branding
- Update color scheme using the dynamic theming system
- Customize chart colors and themes
- Add your company logo and styling

### Additional Features
- Add more chart types (pie charts, area charts, heatmaps)
- Implement real-time data updates
- Add user authentication and authorization
- Include advanced analytics and reporting

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Backend (Railway/Heroku)
1. Set up environment variables
2. Configure database connection
3. Deploy with proper CORS settings

### Full Stack (Same Domain)
1. Build frontend: `npm run build`
2. Serve static files from Express
3. Deploy as a single application

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `cd backend && npm start` - Start backend server
- `cd backend && npm run dev` - Start backend with nodemon

### Environment Configuration
- Frontend runs on port 3052
- Backend runs on port 3001
- Vite proxy configured for API requests
- CORS enabled for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the maintainer.

---

**Professional Interactive Dashboard - Built with React, Node.js, and modern web technologies**