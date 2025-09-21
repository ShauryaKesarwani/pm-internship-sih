// React
import React from 'react';

// Icons
import { Search, Filter, ChevronDown } from 'lucide-react';

import SearchInput from './SearchInput';
import QuickFilterSelect from './QuickFilterSelect';
import GenerateButton from './GenerateButton';
import MoreFilters from './MoreFilters';

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  minStipend: number;
  setMinStipend: (stipend: number) => void;
  maxStipend: number;
  setMaxStipend: (stipend: number) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  categories: string[];
  locations: string[];
  durations: string[];
  generateInternships: () => void;
  isGenerating: boolean;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  selectedDuration,
  setSelectedDuration,
  minStipend,
  setMinStipend,
  maxStipend,
  setMaxStipend,
  showFilters,
  setShowFilters,
  categories,
  locations,
  durations,
  generateInternships,
  isGenerating,
}) => {
  const commonSelectClasses =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent';
  const commonInputClasses =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent';

  // Helper component to reduce repetition for select elements
  const FilterSelect: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    allOptionLabel: string;
  }> = ({ label, value, onChange, options, allOptionLabel }) => (
    <div className='relative'>
      <select
        id={`${label.toLowerCase()}-select`}
        value={value}
        onChange={onChange}
        className={`${commonSelectClasses} appearance-none`}
      >
        <option value='all'>{allOptionLabel}</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <ChevronDown size={16} />
      </div>
      <label htmlFor={`${label.toLowerCase()}-select`} className='sr-only'>
        {label}
      </label>
    </div>
  );

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6 mb-8'>
      <div className='flex flex-col lg:flex-row gap-4'>

        {/* Search Input */}
        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Quick Filters and Generate Button */}
        <div className='flex flex-wrap gap-2 items-center'>
          <QuickFilterSelect
            label='Category'
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            options={categories}
            allOptionLabel='All Categories'
          />
          {/* <QuickFilterSelect
            label='Location'
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            options={locations}
            allOptionLabel='All Locations'
          /> */}
          <QuickFilterSelect
            label='Type'
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            options={['Remote', 'On-site', 'Hybrid']}
            allOptionLabel='All Location'
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50'
          >
            <Filter size={20} />
            <span>More Filters</span>
          </button>

          <GenerateButton
            isGenerating={isGenerating}
            onClick={generateInternships}
          />
        </div>
      </div>
      {showFilters && (
        <MoreFilters
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          durations={durations}
          minStipend={minStipend}
          setMinStipend={setMinStipend}
          maxStipend={maxStipend}
          setMaxStipend={setMaxStipend}
        />
      )}
    </div>
  );
};

export default SearchAndFilterBar;