import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft)

  return rss({
    title: 'Nhat-Nguyen — Notes & Essays',
    description: 'Essays and reflections by Nhat-Nguyen.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  })
}
