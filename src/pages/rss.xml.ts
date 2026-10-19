import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import type { APIContext } from 'astro';

// RSS 是纯静态内容，构建期生成即可（无需 SSR）
export const prerender = true;

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  // 配置 marked：GFM（表格/任务列表/删除线/自动链接）
  marked.setOptions({ gfm: true, breaks: false });

  return rss({
    title: 'AI Kosei · 研究与写作',
    description: 'GuanXcode 的 AI / Agent 工程实践与架构笔记',
    site: context.site ?? 'https://guanxcode.vip',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      // description 用于列表/预览（短而精），保持原有 subtitle
      description: post.data.subtitle ?? '',
      // content 是 RSS 阅读器展开后看到的完整正文（HTML）
      content: marked.parse(post.body ?? '') as string,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
