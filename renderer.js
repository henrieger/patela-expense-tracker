// Application state
let transactions = [];
let filteredTransactions = [];
let isChartView = false;

// Categories
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    console.log('Initializing app...'); // Debug log
    try {
        // Check if electronAPI is available
        if (!window.electronAPI) {
            console.error('electronAPI not available!');
            showNotification('App initialization failed: electronAPI not available', 'error');
            return;
        }
        
        console.log('electronAPI available:', Object.keys(window.electronAPI)); // Debug log
        
        await loadTransactions();
        await updateOverview();
        await updateCategoriesDisplay();
        updateTransactionsList();
        
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error loading data: ' + error.message, 'error');
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Get DOM elements
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const formOverlay = document.getElementById('form-overlay');
    const closeFormBtn = document.getElementById('close-form-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveTransactionBtn = document.getElementById('save-transaction-btn');
    const transactionType = document.getElementById('transaction-type');
    const filterCategory = document.getElementById('filter-category');
    const filterTags = document.getElementById('filter-tags');
    const filterDateFrom = document.getElementById('filter-date-from');
    const filterDateTo = document.getElementById('filter-date-to');
    const chartToggleBtn = document.getElementById('chart-toggle-btn');
    
    // Check if elements exist
    if (!addTransactionBtn || !formOverlay) {
        console.error('Essential elements not found!');
        return;
    }
    
    // Chart toggle functionality
    if (chartToggleBtn) {
        console.log('Setting up chart toggle button');
        chartToggleBtn.addEventListener('click', () => {
            console.log('Chart toggle clicked, current state:', isChartView);
            isChartView = !isChartView;
            chartToggleBtn.textContent = isChartView ? 'Grid View' : 'Chart View';
            updateCategoriesDisplay();
        });
    } else {
        console.error('Chart toggle button not found!');
    }
    
    // Modal handling
    const navButtons = document.querySelectorAll('.nav-btn');
    const privacyModal = document.getElementById('privacy-modal');
    const aboutModal = document.getElementById('about-modal');
    const closePrivacyBtn = document.getElementById('close-privacy-btn');
    const closeAboutBtn = document.getElementById('close-about-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            if (tab === 'privacy') {
                privacyModal.style.display = 'flex';
            } else if (tab === 'about') {
                aboutModal.style.display = 'flex';
            }
        });
    });
    
    // Close modal handlers
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener('click', () => {
            privacyModal.style.display = 'none';
        });
    }
    
    if (closeAboutBtn) {
        closeAboutBtn.addEventListener('click', () => {
            aboutModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking overlay
    if (privacyModal) {
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                privacyModal.style.display = 'none';
            }
        });
    }
    
    if (aboutModal) {
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) {
                aboutModal.style.display = 'none';
            }
        });
    }
    
    // Form handling
    addTransactionBtn.addEventListener('click', showForm);
    closeFormBtn.addEventListener('click', hideForm);
    cancelBtn.addEventListener('click', hideForm);
    saveTransactionBtn.addEventListener('click', handleSaveTransaction);
    transactionType.addEventListener('change', handleTypeChange);
    
    // Filters
    filterCategory.addEventListener('change', applyFilters);
    filterTags.addEventListener('input', applyFilters);
    if (filterDateFrom) filterDateFrom.addEventListener('change', applyFilters);
    if (filterDateTo) filterDateTo.addEventListener('change', applyFilters);
    
    // Close form when clicking overlay
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) {
            hideForm();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && formOverlay.style.display !== 'none') {
            handleSaveTransaction();
        }
        if (e.key === 'Escape') {
            hideForm();
            if (privacyModal) privacyModal.style.display = 'none';
            if (aboutModal) aboutModal.style.display = 'none';
        }
    });
    
    console.log('Event listeners set up successfully');
}

async function loadTransactions() {
    try {
        transactions = await window.electronAPI.getTransactions();
        filteredTransactions = [...transactions];
    } catch (error) {
        console.error('Error loading transactions:', error);
        transactions = [];
        filteredTransactions = [];
    }
}

async function updateOverview() {
    try {
        const totals = await window.electronAPI.getTotals();
        
        document.getElementById('total-income').textContent = `$${totals.totalIncome.toFixed(2)}`;
        document.getElementById('total-expenses').textContent = `$${totals.totalExpenses.toFixed(2)}`;
        document.getElementById('balance').textContent = `$${totals.balance.toFixed(2)}`;
        
        // Update balance card styling based on positive/negative
        const balanceCard = document.querySelector('.balance-card');
        if (totals.balance < 0) {
            balanceCard.classList.add('negative');
        } else {
            balanceCard.classList.remove('negative');
        }
    } catch (error) {
        console.error('Error updating overview:', error);
    }
}

async function updateCategoriesDisplay() {
    console.log('Updating categories display, chart view:', isChartView);
    
    try {
        const categoriesSummary = await window.electronAPI.getCategoriesSummary();
        const categoriesGrid = document.getElementById('categories-grid');
        const categoriesChart = document.getElementById('categories-chart');
        
        // Filter out categories with zero values
        const nonZeroCategories = Object.entries(categoriesSummary)
            .filter(([category, amount]) => amount > 0)
            .sort((a, b) => b[1] - a[1]);
        
        console.log('Categories summary:', categoriesSummary);
        console.log('Non-zero categories:', nonZeroCategories);
        
        if (isChartView) {
            console.log('Showing chart view');
            categoriesGrid.style.display = 'none';
            categoriesChart.style.display = 'block';
            drawBarChart(nonZeroCategories);
        } else {
            console.log('Showing grid view');
            categoriesGrid.style.display = 'grid';
            categoriesChart.style.display = 'none';
            
            categoriesGrid.innerHTML = '';
            
            if (nonZeroCategories.length === 0) {
                categoriesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #718096; padding: 40px;">No expenses recorded yet. Add some transactions to see category breakdown.</p>';
                return;
            }
            
            // Calculate heat map levels
            const amounts = nonZeroCategories.map(([, amount]) => amount);
            const maxAmount = Math.max(...amounts);
            const minAmount = Math.min(...amounts);
            
            nonZeroCategories.forEach(([category, amount]) => {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'category-item';
                
                // Calculate heat level (1-5)
                let heatLevel = 1;
                if (amounts.length > 1) {
                    const ratio = (amount - minAmount) / (maxAmount - minAmount);
                    heatLevel = Math.ceil(ratio * 5);
                    if (heatLevel === 0) heatLevel = 1;
                }
                
                categoryElement.classList.add(`heat-level-${heatLevel}`);
                
                categoryElement.innerHTML = `
                    <div class="category-name">${category}</div>
                    <div class="category-amount">$${amount.toFixed(2)}</div>
                `;
                
                categoriesGrid.appendChild(categoryElement);
            });
        }
    } catch (error) {
        console.error('Error updating categories display:', error);
    }
}

function drawBarChart(categoryData) {
    console.log('Drawing bar chart with data:', categoryData);
    
    const canvas = document.getElementById('chart-canvas');
    if (!canvas) {
        console.error('Chart canvas not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const containerWidth = canvas.parentElement.clientWidth;
    canvas.width = containerWidth;
    canvas.height = Math.max(300, categoryData.length * 50 + 80);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (categoryData.length === 0) {
        ctx.fillStyle = '#718096';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No expense data to display', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    const maxAmount = Math.max(...categoryData.map(([, amount]) => amount));
    const barHeight = 35;
    const barSpacing = 15;
    const leftMargin = 180;
    const rightMargin = 100;
    const topMargin = 30;
    const maxBarWidth = canvas.width - leftMargin - rightMargin;
    
    // Color palette (ColorBrewer Set3)
    const colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', 
                   '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'];
    
    categoryData.forEach(([category, amount], index) => {
        const y = topMargin + index * (barHeight + barSpacing);
        const barWidth = (amount / maxAmount) * maxBarWidth;
        
        // Draw bar
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(leftMargin, y, barWidth, barHeight);
        
        // Draw category label
        ctx.fillStyle = '#2d3748';
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(category, leftMargin - 15, y + barHeight / 2 + 5);
        
        // Draw amount label
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`$${amount.toFixed(2)}`, leftMargin + barWidth + 15, y + barHeight / 2 + 5);
    });
}

function updateTransactionsList() {
    const transactionsList = document.getElementById('transactions-list');
    
    if (filteredTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state" id="empty-state">
                <div class="empty-icon">📊</div>
                <p>No transactions found. Add your first transaction above!</p>
            </div>
        `;
        return;
    }
    
    transactionsList.innerHTML = '';
    
    filteredTransactions.forEach(transaction => {
        const transactionElement = createTransactionElement(transaction);
        transactionsList.appendChild(transactionElement);
    });
}

function createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    const tagsHtml = transaction.tags && transaction.tags.length > 0 
        ? `<div class="transaction-tags">
             ${transaction.tags.map(tag => `<span class="transaction-tag">${tag}</span>`).join('')}
           </div>`
        : '';
    
    div.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-type ${transaction.type}"></div>
            <div class="transaction-details">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-meta">
                    <span class="transaction-category ${transaction.type}">${transaction.category}</span>
                    <span>📅 ${formattedDate}</span>
                    ${tagsHtml}
                </div>
            </div>
        </div>
        <div class="transaction-amount">
            <div class="amount-value ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
    `;
    
    return div;
}

function showForm() {
    console.log('Show form clicked');
    const formOverlay = document.getElementById('form-overlay');
    formOverlay.style.display = 'flex';
    document.getElementById('amount').focus();
}

function hideForm() {
    const formOverlay = document.getElementById('form-overlay');
    formOverlay.style.display = 'none';
    clearForm();
}

function clearForm() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('transaction-type').value = 'expense';
    document.getElementById('category').value = 'Administrative';
    document.getElementById('date').valueAsDate = new Date();
    handleTypeChange();
}

function handleTypeChange() {
    const type = document.getElementById('transaction-type').value;
    const categoryGroup = document.getElementById('category-group');
    
    if (type === 'income') {
        categoryGroup.style.display = 'none';
    } else {
        categoryGroup.style.display = 'block';
    }
}

async function handleSaveTransaction() {
    console.log('Save transaction clicked');
    
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('transaction-type').value;
    const category = type === 'income' ? 'Income' : document.getElementById('category').value;
    const tags = document.getElementById('tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    console.log('Form data:', { amount, description, date, type, category, tags });
    
    // Validation
    if (!amount || !description || !date) {
        console.log('Validation failed: missing fields');
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (parseFloat(amount) <= 0) {
        console.log('Validation failed: invalid amount');
        showNotification('Amount must be greater than 0', 'error');
        return;
    }
    
    const transaction = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        tags,
        date
    };
    
    console.log('Saving transaction:', transaction);
    
    try {
        const savedTransaction = await window.electronAPI.addTransaction(transaction);
        console.log('Transaction saved:', savedTransaction);
        
        // Update local state
        transactions.unshift(savedTransaction);
        applyFilters();
        
        // Update displays
        await updateOverview();
        await updateCategoriesDisplay();
        
        // Clear and hide form
        hideForm();
        showNotification('Transaction added successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving transaction:', error);
        showNotification('Error saving transaction: ' + error.message, 'error');
    }
}

async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    try {
        // Update UI optimistically - remove from local array first
        const originalTransactions = [...transactions];
        transactions = transactions.filter(t => t.id !== id);
        applyFilters();
        
        // Then call the database
        const success = await window.electronAPI.deleteTransaction(id);
        
        if (success) {
            // Update displays after successful deletion
            await updateOverview();
            await updateCategoriesDisplay();
            showNotification('Transaction deleted successfully!', 'success');
        } else {
            // If deletion failed, restore the original transactions
            transactions = originalTransactions;
            applyFilters();
            showNotification('Error deleting transaction', 'error');
        }
    } catch (error) {
        // If there was an error, restore the original transactions
        console.error('Error deleting transaction:', error);
        
        // Reload transactions from database to be safe
        await loadTransactions();
        applyFilters();
        await updateOverview();
        await updateCategoriesDisplay();
        
        showNotification('Error deleting transaction: ' + error.message, 'error');
    }
}

function applyFilters() {
    const categoryFilter = document.getElementById('filter-category').value;
    const tagFilter = document.getElementById('filter-tags').value.toLowerCase().trim();
    const dateFromFilter = document.getElementById('filter-date-from') ? document.getElementById('filter-date-from').value : '';
    const dateToFilter = document.getElementById('filter-date-to') ? document.getElementById('filter-date-to').value : '';
    
    filteredTransactions = transactions.filter(transaction => {
        // Category filter
        const matchesCategory = categoryFilter === 'all' || 
                              (categoryFilter === 'income' && transaction.type === 'income') ||
                              transaction.category === categoryFilter;
        
        // Tag filter
        const matchesTags = !tagFilter || 
                           transaction.tags.some(tag => 
                               tag.toLowerCase().includes(tagFilter)
                           ) ||
                           transaction.description.toLowerCase().includes(tagFilter);
        
        // Date filter
        let matchesDate = true;
        if (dateFromFilter) {
            matchesDate = matchesDate && transaction.date >= dateFromFilter;
        }
        if (dateToFilter) {
            matchesDate = matchesDate && transaction.date <= dateToFilter;
        }
        
        return matchesCategory && matchesTags && matchesDate;
    });
    
    updateTransactionsList();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '2000',
        maxWidth: '300px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        default:
            notification.style.background = '#3b82f6';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}