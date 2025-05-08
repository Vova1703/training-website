import React, { useState } from 'react';
import { useSearch } from '../context/SearchContext';

function Search() {
  const { handleSearch } = useSearch();
  const [query, setQuery] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      handleSearch(query); // Виклик функції пошуку
    } else {
      alert('Будь ласка, введіть пошуковий запит.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук інформації про рисів..."
        className="form-control"
      />
      <button type="submit" className="btn btn-primary">
        Пошук
      </button>
    </form>
  );
}

export default Search;