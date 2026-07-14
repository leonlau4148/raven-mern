// A "stateless widget" — no hooks, just props in, JSX out.
// Rendering a list with .map() is the ListView.builder equivalent;
// `key` is how React tracks list items across re-renders (like Keys
// in Flutter lists).

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
});

function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <p className="empty-state">
        No transactions yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => (
        <li key={tx._id} className="tx-row">
          <div className="tx-info">
            <span className="tx-category">{tx.category}</span>
            <span className="tx-meta">
              {new Date(tx.date).toLocaleDateString('en-PH', {
                month: 'short',
                day: 'numeric',
              })}
              {tx.note && ` · ${tx.note}`}
            </span>
          </div>
          <span className={`tx-amount ${tx.type}`}>
            {tx.type === 'expense' ? '−' : '+'}
            {peso.format(tx.amount)}
          </span>
          <button
            className="tx-delete"
            onClick={() => onDelete(tx._id)}
            aria-label={`Delete ${tx.category} transaction`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TransactionList;
