// React
import React from 'react';

// Icons
import { ChevronDown } from 'lucide-react';

interface QuickFilterSelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  allOptionLabel: string;
}

const commonSelectClasses =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent';

const QuickFilterSelect: React.FC<QuickFilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
  allOptionLabel,
}) => (
  <div className='relative'>
    <select
      id={`${label.toLowerCase()}-select`}
      value={value}
      onChange={onChange}
      className={`${commonSelectClasses} appearance-none pr-10`}
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

export default QuickFilterSelect;