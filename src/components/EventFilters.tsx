import React from 'react';
import { Filter, SlidersHorizontal, X, Search, Sparkles } from 'lucide-react';
import { EventCategory } from '../types/event';

export type PriceFilter = 'all' | 'free' | 'under100' | 'premium';
export type FormatFilter = 'all' | 'in-person' | 'virtual';
export type SortOption = 'date-asc' | 'popular' | 'price-asc' | 'price-desc';

interface EventFiltersProps {
  categories: EventCategory[];
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceFilter: PriceFilter;
  onPriceFilterChange: (pf: PriceFilter) => void;
  formatFilter: FormatFilter;
  onFormatFilterChange: (ff: FormatFilter) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  priceFilter,
  onPriceFilterChange,
  formatFilter,
  onFormatFilterChange,
  sortBy,
  onSortByChange,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm transition-colors duration-200">
      {/* Top row: Category Pills */}
      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Categories</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Horizontal scrollable category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary filter & sort controls */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Price Dropdown */}
        <div>
          <label htmlFor="price-filter-select" className="sr-only">Price filter</label>
          <select
            id="price-filter-select"
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value as PriceFilter)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Pricing: All Events</option>
            <option value="free">Free Passes Only</option>
            <option value="under100">Under ₹200</option>
            <option value="premium">₹200 and above</option>
          </select>
        </div>

        {/* Format Dropdown */}
        <div>
          <label htmlFor="format-filter-select" className="sr-only">Format filter</label>
          <select
            id="format-filter-select"
            value={formatFilter}
            onChange={(e) => onFormatFilterChange(e.target.value as FormatFilter)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Format: All Locations</option>
            <option value="in-person">In-Person Only</option>
            <option value="virtual">Virtual / Hybrid Only</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <label htmlFor="sort-filter-select" className="sr-only">Sort by</label>
          <select
            id="sort-filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date-asc">Sort: Upcoming Soonest</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Result Status Ticker */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">
          Showing <strong className="text-slate-800 dark:text-slate-200">{totalResults}</strong> event{totalResults === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Filters applied
          </span>
        )}
      </div>
    </div>
  );
};
