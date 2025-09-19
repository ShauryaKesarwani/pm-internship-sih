// React
import React from 'react';

// Icons
import { ChevronDown } from 'lucide-react';

interface MoreFiltersProps {
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  durations: string[];
  minStipend: number;
  setMinStipend: (stipend: number) => void;
  maxStipend: number;
  setMaxStipend: (stipend: number) => void;
}

const commonInputClasses =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9982] focus:border-transparent';

const MoreFilters: React.FC<MoreFiltersProps> = ({
  selectedDuration,
  setSelectedDuration,
  durations,
  minStipend,
  setMinStipend,
  maxStipend,
  setMaxStipend,
}) => {
  return (
    <div className='mt-6 pt-6 border-t border-gray-200'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Duration */}
        <div>
          <label
            htmlFor='duration-select'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Duration
          </label>
          <div className='relative'>
            <select
              id='duration-select'
              value={selectedDuration}
              onChange={e => setSelectedDuration(e.target.value)}
              className={`${commonInputClasses} appearance-none`}
            >
              <option value='all'>All Durations</option>
              {durations.map(duration => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Min Stipend */}
        <div>
          <label
            htmlFor='min-stipend'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Min Stipend (₹)
          </label>
          <input
            id='min-stipend'
            type='number'
            value={minStipend}
            onChange={e => setMinStipend(Number(e.target.value))}
            className={commonInputClasses}
          />
        </div>

        {/* Max Stipend */}
        <div>
          <label
            htmlFor='max-stipend'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Max Stipend (₹)
          </label>
          <input
            id='max-stipend'
            type='number'
            value={maxStipend}
            onChange={e => setMaxStipend(Number(e.target.value))}
            className={commonInputClasses}
          />
        </div>
      </div>
    </div>
  );
};

export default MoreFilters;