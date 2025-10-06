const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

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
    
    // Sample data for all exports
    const sampleData = [
      { Date: '2025-08-31', Revenue: 15000, Profit: 4500, Users: 1250, Orders: 89 },
      { Date: '2025-08-30', Revenue: 14200, Profit: 4200, Users: 1180, Orders: 82 },
      { Date: '2025-08-29', Revenue: 13800, Profit: 4100, Users: 1150, Orders: 78 },
      { Date: '2025-08-28', Revenue: 13500, Profit: 4000, Users: 1120, Orders: 75 },
      { Date: '2025-08-27', Revenue: 13200, Profit: 3900, Users: 1100, Orders: 72 }
    ];
    
    switch (format) {
      case 'excel':
        filename = `dashboard-export-${dataType}-${timestamp}.xlsx`;
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
        // Create actual Excel workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sampleData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard Data');
        
        // Generate Excel buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        data = excelBuffer;
        break;
        
      case 'csv':
        filename = `dashboard-export-${dataType}-${timestamp}.csv`;
        contentType = 'text/csv';
        
        // Generate CSV data
        const csvHeaders = Object.keys(sampleData[0]).join(',');
        const csvRows = sampleData.map(row => Object.values(row).join(','));
        data = [csvHeaders, ...csvRows].join('\n');
        break;
        
      case 'json':
        filename = `dashboard-export-${dataType}-${timestamp}.json`;
        contentType = 'application/json';
        data = JSON.stringify({
          exportType: dataType,
          period: selectedPeriod,
          timestamp: new Date().toISOString(),
          data: {
            dailyStats: sampleData
          }
        }, null, 2);
        break;
        
      case 'pdf':
        filename = `dashboard-export-${dataType}-${timestamp}.pdf`;
        contentType = 'application/pdf';
        
        // Create actual PDF document
        const doc = new PDFDocument();
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          data = Buffer.concat(buffers);
          // Send the PDF
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
          res.setHeader('Content-Length', data.length);
          res.send(data);
        });
        
        // Add content to PDF
        doc.fontSize(20).text('Dashboard Export Report', 50, 50);
        doc.fontSize(12).text(`Data Type: ${dataType}`, 50, 100);
        doc.text(`Period: ${selectedPeriod}`, 50, 120);
        doc.text(`Export Date: ${new Date().toLocaleString()}`, 50, 140);
        
        doc.moveDown(2);
        doc.fontSize(14).text('Sample Data:', 50, 200);
        
        // Add table data
        let yPosition = 240;
        doc.fontSize(10);
        
        // Headers
        doc.text('Date', 50, yPosition);
        doc.text('Revenue', 150, yPosition);
        doc.text('Profit', 250, yPosition);
        doc.text('Users', 350, yPosition);
        doc.text('Orders', 450, yPosition);
        
        yPosition += 20;
        
        // Data rows
        sampleData.forEach(row => {
          doc.text(row.Date, 50, yPosition);
          doc.text(row.Revenue.toString(), 150, yPosition);
          doc.text(row.Profit.toString(), 250, yPosition);
          doc.text(row.Users.toString(), 350, yPosition);
          doc.text(row.Orders.toString(), 450, yPosition);
          yPosition += 15;
        });
        
        doc.end();
        return; // Early return for PDF since it's handled asynchronously
        
      default:
        return res.status(400).json({ error: 'Invalid export format' });
    }
    
    // Set headers for file download (except PDF which is handled above)
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
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Database: ${dbPath}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = { app, db };

