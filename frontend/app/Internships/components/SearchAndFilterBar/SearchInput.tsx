// React
import React from 'react';

// Icons
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className='flex-1 relative'>
      <label htmlFor='search-input' className='sr-only'>
        Search
      </label>
      <div className='relative flex items-center'>
        <Search
          className='absolute left-3 text-gray-400'
          size={20}
          aria-hidden='true'
        />
        <input
          id='search-input'
          type='text'
          placeholder='Search internships, companies, or skills...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent'
        />
      </div>
    </div>
  );
};

export default SearchInput;