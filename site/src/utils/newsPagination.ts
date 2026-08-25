import { newsItems } from '../data/news';
import type { NewsItem } from '../types/news';

export const NEWS_PAGE_SIZE = 6;

export const sortedNewsItems: readonly NewsItem[] = [...newsItems].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export const newsPageCount = Math.ceil(sortedNewsItems.length / NEWS_PAGE_SIZE);

export function getNewsPageItems(page: number): readonly NewsItem[] {
  if (!Number.isInteger(page) || page < 1 || page > newsPageCount) {
    throw new Error(`News page ${page} is outside the available range.`);
  }

  const start = (page - 1) * NEWS_PAGE_SIZE;
  return sortedNewsItems.slice(start, start + NEWS_PAGE_SIZE);
}

export function getNewsPaginationPages(): readonly number[] {
  return Array.from({ length: Math.max(newsPageCount - 1, 0) }, (_, index) => index + 2);
}
