const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - More permissive CORS
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Add security headers to allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      category TEXT NOT NULL,
      setting_key TEXT NOT NULL,
      setting_value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(user_id, category, setting_key)
    )`);

    // Backups table
    db.run(`CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      backup_type TEXT NOT NULL,
      file_size INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'completed',
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Dashboard data table (for backup purposes)
    db.run(`CREATE TABLE IF NOT EXISTS dashboard_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      data_type TEXT NOT NULL,
      data_content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    console.log('Database tables initialized successfully');
  });
};

// Initialize database on startup
initDatabase();

// Basic route
app.get('/', (req, res) => {
  console.log('Root endpoint hit:', req.method, req.url);
  res.json({ message: 'Interactive Dashboard Backend API' });
});

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint hit:', req.method, req.url);
  
  // Set CORS headers specifically for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'SQLite connected'
  });
});

// ===== BACKUP & EXPORT ROUTES =====

// Create backup
app.post('/api/backup/create', (req, res) => {
  console.log('Backup creation requested:', req.body);
  
  // Set CORS headers specifically for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  const { backupType, includeData } = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `dashboard-backup-${timestamp}.json`;
  
  try {
    // For now, create a simple backup file
    const backupData = {
      timestamp: new Date().toISOString(),
      type: backupType || 'manual',
      includesData: includeData || false,
      dashboardSettings: {
        // This would come from your frontend settings
        general: { dashboardRefreshRate: 30, defaultPeriod: 'week' },
        appearance: { primaryColor: '#3B82F6', fontSize: 'medium' },
        notifications: { emailAlerts: true, pushNotifications: false }
      }
    };
    
    // Save backup record to database
    db.run(
      'INSERT INTO backups (user_id, filename, file_path, backup_type, file_size, status) VALUES (?, ?, ?, ?, ?, ?)',
      [1, filename, `backups/${filename}`, backupType || 'manual', JSON.stringify(backupData).length, 'completed'],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to save backup record' });
        }
        
        res.json({
          success: true,
          message: 'Backup created successfully',
          backupId: this.lastID,
          filename: filename,
          timestamp: backupData.timestamp
        });
      }
    );
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// List backups
app.get('/api/backup/list', (req, res) => {
  console.log('Backup list requested');
  
  db.all('SELECT * FROM backups ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch backups' });
    }
    
    res.json({
      success: true,
      backups: rows
    });
  });
});

// Export data in different formats
app.post('/api/export/data', (req, res) => {
  console.log('Export requested:', req.body);
  
  const { format, dataType, selectedPeriod } = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  try {
    let filename, contentType, data;
    
    switch (format) {
      case 'excel':
        filename = `dashboard-export-${dataType}-${timestamp}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        // Generate sample Excel data
        data = 'Date,Revenue,Profit,Users,Orders\n2025-08-31,15000,4500,1250,89\n2025-08-30,14200,4200,1180,82\n2025-08-29,13800,4100,1150,78\n2025-08-28,13500,4000,1120,75\n2025-08-27,13200,3900,1100,72';
        break;
        
      case 'csv':
        filename = `dashboard-export-${dataType}-${timestamp}.csv`;
        contentType = 'text/csv';
        // Generate sample CSV data
        data = 'Date,Revenue,Profit,Users,Orders\n2025-08-31,15000,4500,1250,89\n2025-08-30,14200,4200,1180,82\n2025-08-29,13800,4100,1150,78\n2025-08-28,13500,4000,1120,75\n2025-08-27,13200,3900,1100,72';
        break;
        
      case 'json':
        filename = `dashboard-export-${dataType}-${timestamp}.json`;
        contentType = 'application/json';
        data = JSON.stringify({
          exportType: dataType,
          period: selectedPeriod,
          timestamp: new Date().toISOString(),
          data: {
            dailyStats: [
              { date: '2025-08-31', revenue: 15000, profit: 4500, users: 1250, orders: 89 },
              { date: '2025-08-30', revenue: 14200, profit: 4200, users: 1180, orders: 82 },
              { date: '2025-08-29', revenue: 13800, profit: 4100, users: 1150, orders: 78 },
              { date: '2025-08-28', revenue: 13500, profit: 4000, users: 1120, orders: 75 },
              { date: '2025-08-27', revenue: 13200, profit: 3900, users: 1100, orders: 72 }
            ]
          }
        }, null, 2);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid export format' });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(data));
    
    // Send the file data
    res.send(data);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to create export' });
  }
});

// Get backup/export settings
app.get('/api/settings/backup', (req, res) => {
  console.log('Backup settings requested');
  
  // Mock settings for now - these would come from your frontend
  const settings = {
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    exportFormat: 'excel'
  };
  
  res.json({
    success: true,
    settings: settings
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = { app, db };

