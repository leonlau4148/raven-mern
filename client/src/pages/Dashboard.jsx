import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect with [] as the dependency array runs ONCE after the first
  // render — this is your initState. Fetch-on-mount, exactly like
  // calling cubit.loadTransactions() when a screen opens.
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get('/transactions');
        setTransactions(data);
      } catch (err) {
        // 401 here means an expired/invalid token — log out cleanly
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (form) => {
    const { data } = await api.post('/transactions', form);
    // Never mutate state directly (no transactions.push!) — build a
    // new array so React sees the change. Same immutability rule
    // as emitting new state objects from a Cubit.
    setTransactions([data, ...transactions]);
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(transactions.filter((tx) => tx._id !== id));
  };

  // Derived state — computed on every render, never stored.
  // In Flutter you'd compute this in build(); same principle.
  const income = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const balance = income - expenses;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <p className="brand">Raven Finance</p>
          <h1>Hello, {user.username}</h1>
        </div>
        <button className="ghost" onClick={logout}>
          Sign out
        </button>
      </header>

      <section className="summary">
        <div className="summary-card">
          <span className="summary-label">Balance</span>
          <span className="summary-value">{peso.format(balance)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Income</span>
          <span className="summary-value income">{peso.format(income)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Expenses</span>
          <span className="summary-value expense">
            {peso.format(expenses)}
          </span>
        </div>
      </section>

      <section className="panel">
        <h2>New transaction</h2>
        <TransactionForm onAdd={handleAdd} />
      </section>

      <section className="panel">
        <h2>History</h2>
        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : (
          <TransactionList
            transactions={transactions}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}

export default Dashboard;
