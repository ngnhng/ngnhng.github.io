import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search articles..." }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}