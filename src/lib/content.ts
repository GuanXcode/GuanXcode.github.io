import type { CollectionEntry } from 'astro:content';

type WorkEntry = CollectionEntry<'works'>;

export function filterVisibleWorks(
  works: WorkEntry[],
  isAuthenticated: boolean,
): WorkEntry[] {
  if (isAuthenticated) return works;
  return works.filter((w) => w.data.visibility === 'public');
}

export function canViewWork(
  work: WorkEntry,
  isAuthenticated: boolean,
): boolean {
  return work.data.visibility === 'public' || isAuthenticated;
}
