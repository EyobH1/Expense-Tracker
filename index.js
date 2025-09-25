const EXPENSE_CATEGORIES = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Healthcare', 'Education', 'Other'
];

const INCOME_CATEGORIES = [
    'Salary', 'Freelance', 'Investments', 'Gifts', 'Other'
];

function ExpenseTrackerApp() {
    const [transactions, setTransactions] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [category, setCategory] = React.useState(EXPENSE_CATEGORIES[0]);
    const [type, setType] = React.useState('expense');
    const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = React.useState('all');

    React.useEffect(() => {
        const savedTransactions = localStorage.getItem('expenseTracker');
        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem('expenseTracker', JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (e) => {
        e.preventDefault();
        
        if (!description.trim() || !amount || amount <= 0) {
            alert('Please enter valid description and amount!');
            return;
        }

        const newTransaction = {
            id: Date.now(),
            description: description.trim(),
            amount: parseFloat(amount),
            category: category,
            type: type,
            date: date
        };

        setTransactions(prev => [newTransaction, ...prev]);
        
        setDescription('');
        setAmount('');
        setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
    };

    const deleteTransaction = (id) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        if (filter === 'income') return transaction.type === 'income';
        if (filter === 'expense') return transaction.type === 'expense';
        return transaction.category === filter;
    });

    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            acc.income += transaction.amount;
        } else {
            acc.expenses += transaction.amount;
        }
        return acc;
    }, { income: 0, expenses: 0 });

    totals.balance = totals.income - totals.expenses;

    return (
        <div className="app">
            {}
            <header className="app-header">
                <h1>My Money</h1>
                <p>Track your income and expenses effortlessly</p>
            </header>

            {/* Dashboard Stats */}
            <div className="dashboard-stats">
                <div className="stat-card income">
                    <h3>Total Income</h3>
                    <div className="stat-amount">${totals.income.toFixed(2)}</div>
                    <p>All time income</p>
                </div>
                <div className="stat-card expenses">
                    <h3>Total Expenses</h3>
                    <div className="stat-amount">${totals.expenses.toFixed(2)}</div>
                    <p>All time expenses</p>
                </div>
                <div className="stat-card balance">
                    <h3>Current Balance</h3>
                    <div className="stat-amount">${totals.balance.toFixed(2)}</div>
                    <p>Available balance</p>
                </div>
            </div>

            {}
            <div className="app-main">
                {}
                <div>
                    {}
                    <form onSubmit={addTransaction} className="transaction-form">
                        <h3>Add New Transaction</h3>
                        
                        <div className="form-group">
                            <label>Type</label>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input 
                                        type="radio" 
                                        value="expense" 
                                        checked={type === 'expense'}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setCategory(EXPENSE_CATEGORIES[0]);
                                        }}
                                    />
                                    Expense
                                </label>
                                <label className="radio-option">
                                    <input 
                                        type="radio" 
                                        value="income" 
                                        checked={type === 'income'}
                                        onChange={(e) => {
                                            setType(e.target.value);
                                            setCategory(INCOME_CATEGORIES[0]);
                                        }}
                                    />
                                    Income
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input 
                                type="text" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g., Groceries, Salary, etc."
                            />
                        </div>

                        <div className="form-group">
                            <label>Amount ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={`btn ${type === 'income' ? 'btn-income' : 'btn-expense'}`}
                        >
                            Add {type === 'income' ? 'Income' : 'Expense'}
                        </button>
                    </form>

                    {}
                    <div className="transaction-list mt-2">
                        <h3>Transaction History</h3>
                        
                        {}
                        <div className="filter-section">
                            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">All Transactions</option>
                                <option value="income">Income Only</option>
                                <option value="expense">Expenses Only</option>
                                <option disabled>--- Categories ---</option>
                                {[...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div className="transactions">
                            {filteredTransactions.length === 0 ? (
                                <div className="no-transactions">
                                    <p>No transactions found. Add your first transaction above!</p>
                                </div>
                            ) : (
                                filteredTransactions.map(transaction => (
                                    <TransactionItem 
                                        key={transaction.id} 
                                        transaction={transaction}
                                        onDelete={deleteTransaction}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {}
                <div>
                    <ChartsSection transactions={transactions} />
                </div>
            </div>
        </div>
    );
}

function TransactionItem({ transaction, onDelete }) {
    return (
        <div className="transaction-item">
            <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-meta">
                    {transaction.category} • {transaction.date}
                </div>
            </div>
            <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
            <button 
                className="delete-btn"
                onClick={() => onDelete(transaction.id)}
                title="Delete transaction"
            >
                ×
            </button>
        </div>
    );
}

function ChartsSection({ transactions }) {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);

    React.useEffect(() => {
        if (!transactions.length) return;

        const expenses = transactions.filter(t => t.type === 'expense');
        const expensesByCategory = {};

        expenses.forEach(transaction => {
            expensesByCategory[transaction.category] = 
                (expensesByCategory[transaction.category] || 0) + transaction.amount;
        });

        const ctx = chartRef.current.getContext('2d');
        
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(expensesByCategory),
                datasets: [{
                    data: Object.values(expensesByCategory),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Expenses by Category'
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [transactions]);

    return (
        <div className="charts-section">
            <h3>Spending Overview</h3>
            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

ReactDOM.render(<ExpenseTrackerApp />, document.getElementById('root'));