import type { ReactNode } from 'react';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

export interface FilterOption { value: string; label: string; }
export interface FilterConfig { key: string; placeholder?: string; options: FilterOption[]; width?: string; }

interface FilterBarProps {
  search?: { value: string; onChange: (v:string)=>void; placeholder?: string; className?: string };
  selects?: { config: FilterConfig; value: string; onChange:(v:string)=>void; icon?: ReactNode }[];
  extra?: ReactNode;
  resultsInfo?: ReactNode;
  className?: string;
}

export function FilterBar({ search, selects=[], extra, resultsInfo, className }: FilterBarProps){
  return <div className={`flex flex-wrap items-center gap-4 ${className||''}`}>
    {search && <div className="relative flex-1 min-w-64">
      <Input placeholder={search.placeholder||'Search...'} value={search.value} onChange={e=>search.onChange(e.target.value)} className={search.className} />
    </div>}
    {selects.map(s => <Select key={s.config.key} value={s.value} onValueChange={s.onChange}>
      <SelectTrigger className={s.config.width || 'w-40'}>
        {s.icon}
        <SelectValue placeholder={s.config.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {s.config.options.map(o=> <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>)}
    {extra}
    {resultsInfo && <div className="text-sm text-muted-foreground ml-auto">{resultsInfo}</div>}
  </div>;
}
