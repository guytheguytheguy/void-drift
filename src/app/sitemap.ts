import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://voiddrift.veridux.ai',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://voiddrift.veridux.ai/play',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://voiddrift.veridux.ai/leaderboard',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    },
  ]
}
