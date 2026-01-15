import { useState, useMemo } from 'react';

/**
 * Custom hook for search functionality
 * @param data - Array of data to search
 * @param searchableFields - Fields to search in
 * @returns Filtered data and search term handlers
 */
export const useSearch = <T extends Record<string, any>>(
  data: T[],
  searchableFields: (keyof T | ((item: T) => string))[]
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const searchLower = searchTerm.toLowerCase();

    return data.filter((item) => {
      return searchableFields.some((field) => {
        let value: string;
        
        if (typeof field === 'function') {
          value = field(item);
        } else {
          value = String(item[field] || '');
        }

        return value.toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchableFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
  };
};
