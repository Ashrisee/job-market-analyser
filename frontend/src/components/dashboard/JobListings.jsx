import { useState } from 'react';
import JobMatchCard from './JobMatchCard';
import FilterPanel from '../forms/FilterPanel';
import { CardShimmer } from '../ui/ShimmerLoader';
import { Search, Inbox } from 'lucide-react';

export default function JobListings({ jobs = [], loading = false }) {
  const [filters, setFilters] = useState({ minMatch: 0, remoteOnly: false, source: '', sortBy: 'score' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');

  let filtered = [...jobs];

  // Apply filters
  if (filters.minMatch > 0) filtered = filtered.filter(j => j.overall_score >= filters.minMatch);
  if (filters.remoteOnly) filtered = filtered.filter(j => j.is_remote);
  if (filters.source) filtered = filtered.filter(j => j.source === filters.source);
  if (search) filtered = filtered.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));

  // Sort
  if (filters.sortBy === 'salary') filtered.sort((a, b) => (b.salary_min || 0) - (a.salary_min || 0));
  else if (filters.sortBy === 'date') filtered.sort((a, b) => (b.posted_date || '').localeCompare(a.posted_date || ''));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <h3 className="text-sm font-semibold text-white/70">Live Job Listings ({filtered.length})</h3>
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="pl-9 pr-4 py-2 glass rounded-xl bg-transparent text-xs text-white/70 outline-none w-48 focus:w-64 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all placeholder:text-white/20"
          />
        </div>

        <FilterPanel filters={filters} onChange={setFilters} isOpen={filterOpen} onToggle={() => setFilterOpen(!filterOpen)} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <CardShimmer key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filtered.map((job, i) => (
            <JobMatchCard key={`${job.title}-${job.company}-${i}`} job={job} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-white/30">
          <Inbox size={48} className="mb-3 opacity-50" />
          <p className="text-sm font-medium">No jobs match your criteria</p>
          <p className="text-xs mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
