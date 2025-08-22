const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class ExpenseDatabase {
  constructor() {
    // Use app's user data directory instead of __dirname
    const userDataPath = app.getPath('userData');
    const dbDir = path.join(userDataPath, 'data');
    
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Initialize database in user data directory
    this.db = new Database(path.join(dbDir, 'expenses.db'));
    this.initTables();
  }

  initTables() {
    // Create transactions table
    const createTable = this.db.prepare(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    createTable.run();
  }

  getAllTransactions() {
    const stmt = this.db.prepare('SELECT * FROM transactions ORDER BY date DESC, created_at DESC');
    const rows = stmt.all();
    
    return rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }

  addTransaction(transaction) {
    const { type, amount, category, description, tags, date } = transaction;
    
    const stmt = this.db.prepare(`
      INSERT INTO transactions (type, amount, category, description, tags, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run([
      type,
      parseFloat(amount),
      category,
      description,
      JSON.stringify(tags || []),
      date
    ]);

    // Return the inserted transaction with its new ID
    return {
      id: info.lastInsertRowid,
      ...transaction,
      tags: tags || []
    };
  }

  updateTransaction(transaction) {
    const { id, type, amount, category, description, tags, date } = transaction;
    
    const stmt = this.db.prepare(`
      UPDATE transactions 
      SET type = ?, amount = ?, category = ?, description = ?, tags = ?, date = ?
      WHERE id = ?
    `);

    const info = stmt.run([
      type,
      parseFloat(amount),
      category,
      description,
      JSON.stringify(tags || []),
      date,
      id
    ]);

    if (info.changes === 0) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    // Return the updated transaction
    return {
      ...transaction,
      tags: tags || []
    };
  }

  deleteTransaction(id) {
    const stmt = this.db.prepare('DELETE FROM transactions WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }

  getTotals() {
    const incomeStmt = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE type = 'income'
    `);
    
    const expenseStmt = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM transactions 
      WHERE type = 'expense'
    `);

    const totalIncome = incomeStmt.get().total;
    const totalExpenses = expenseStmt.get().total;
    const balance = totalIncome - totalExpenses;

    return {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      balance: parseFloat(balance.toFixed(2))
    };
  }

  getCategoriesSummary() {
    const stmt = this.db.prepare(`
      SELECT category, COALESCE(SUM(amount), 0) as total
      FROM transactions 
      WHERE type = 'expense'
      GROUP BY category
    `);

    const rows = stmt.all();
    const summary = {};
    
    // Initialize all categories to 0
    const categories = [
      'Administrative',
      'Books & Education', 
      'Clothing & Accessories',
      'Eat out',
      'Electronics',
      'Emergency',
      'Entertainment',
      'Gifts & Souvenirs',
      'Groceries',
      'Health & Medical',
      'Housing',
      'Internet & Phone',
      'Laundry & Cleaning',
      'Personal Care',
      'Shopping',
      'Sightseeing & Tours',
      'Sports & Fitness',
      'Transportation',
      'Travel & Vacation',
      'Utilities'
    ];
    
    categories.forEach(cat => summary[cat] = 0);
    
    // Fill in actual totals
    rows.forEach(row => {
      summary[row.category] = parseFloat(row.total.toFixed(2));
    });

    return summary;
  }

  close() {
    this.db.close();
  }
}

module.exports = ExpenseDatabase;