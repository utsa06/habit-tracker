const STATUS_OPTIONS = [
  { value: 'all',       label: 'All' },
  { value: 'completed', label: 'Completed today' },
  { value: 'pending',   label: 'Pending today' },
];

const SORT_OPTIONS = [
  { value: 'default',       label: 'Default' },
  { value: 'name',          label: 'Name' },
  { value: 'streak',        label: 'Streak' },
  { value: 'lastCompleted', label: 'Last completed' },
];

export default function HabitFilterBar({ filters, onChange }) {
  const isFiltered = filters.status !== 'all' || filters.sortBy !== 'default';

  return (
    <div className="flex items-center gap-3 flex-wrap mb-5">
      {/* Status pills */}
      <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg p-1">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, status: opt.value })}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150
              ${filters.status === opt.value
                ? 'bg-white shadow-sm text-gray-800'
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200" />

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Sort by</span>
        <select
          value={filters.sortBy}
          onChange={e => onChange({ ...filters, sortBy: e.target.value })}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700
            bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Clear filters button */}
      {isFiltered && (
        <button
          onClick={() => onChange({ status: 'all', sortBy: 'default' })}
          title="Reset all filters and sorting"
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300 hover:text-red-700 active:scale-95 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
