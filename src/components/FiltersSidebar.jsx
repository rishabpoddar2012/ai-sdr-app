import React from 'react';
import './FiltersSidebar.css';

const FiltersSidebar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      score: '',
      source: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.status || filters.score || filters.source || filters.search;

  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>

      <div className="filter-group">
        <label className="filter-label">Search</label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search leads..."
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Score</label>
        <select
          name="score"
          value={filters.score}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All scores</option>
          <option value="hot">🔥 Hot</option>
          <option value="warm">⭐ Warm</option>
          <option value="cold">❄️ Cold</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Source</label>
        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All sources</option>
          <option value="hacker_news">Hacker News</option>
          <option value="reddit">Reddit</option>
          <option value="upwork">Upwork</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
        </select>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
