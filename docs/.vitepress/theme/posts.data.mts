import { createContentLoader } from 'vitepress'

// Збирає всі пости оновлень (укр + en) під час збірки. Дата — з frontmatter
// `date:` (fallback: з імені файлу YYYY-MM-DD-slug.md), сортування — новіші
// зверху. Достатньо створити файл поста — головна, /updates і сайдбар
// підхоплять його автоматично.

export interface UpdatePost {
  title: string
  url: string
  /** ISO-дата yyyy-mm-dd */
  date: string
  lang: 'uk' | 'en'
}

declare const data: UpdatePost[]
export { data }

function isoDate(fm: Record<string, any>, url: string): string {
  if (fm.date) return new Date(fm.date).toISOString().slice(0, 10)
  return /(\d{4}-\d{2}-\d{2})/.exec(url)?.[1] ?? ''
}

export default createContentLoader(
  ['updates/posts/*.md', 'en/updates/posts/*.md'],
  {
    transform(raw): UpdatePost[] {
      return raw
        .map(({ url, frontmatter }) => ({
          title: String(frontmatter.title ?? url),
          url,
          date: isoDate(frontmatter, url),
          lang: url.startsWith('/en/') ? ('en' as const) : ('uk' as const),
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
    },
  }
)
