import { useState } from 'react';

// A reusable child component. `onAdd` is a callback prop — the exact
// pattern of passing a callback into a Flutter widget's constructor.
// The parent (Dashboard) owns the data; this form just reports up.
function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Number() because input values are always strings in the DOM
      await onAdd({ type, amount: Number(amount), category, note });
      // Reset the form on success
      setAmount('');
      setCategory('');
      setNote('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="tx-form" onSubmit={handleSubmit}>
      <div className="type-toggle" role="group" aria-label="Transaction type">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : ''}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : ''}
          onClick={() => setType('income')}
        >
          Income
        </button>
      </div>

      <div className="tx-form-fields">
        <label>
          Amount (₱)
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </label>
        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Salary, Transport…"
            required
          />
        </label>
        <label>
          Note <span className="optional">optional</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jollibee"
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Adding…' : 'Add transaction'}
      </button>
    </form>
  );
}

export default TransactionForm;
