const ITEMS = ["Home", "Forecast", "Saved cities", "Map", "Settings", "About"];

export default function Sidebar({ page, onNavigate }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <ul>
        {ITEMS.map((item) => (
          <li key={item}>
            <button
              type="button"
              className={page === item ? "nav-item nav-item--active" : "nav-item"}
              aria-current={page === item ? "page" : undefined}
              onClick={() => onNavigate(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}