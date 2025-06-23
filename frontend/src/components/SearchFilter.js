// components/SearchFilter.js
import React from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm
}) => {
  return (
    <div className="search-filter">
      <div className="search-filter-content">
        <div className="search-input-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;