import { createRoute } from 'honox/factory'

export const POST = createRoute(async (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');

  const body = await c.req.parseBody();
  const lang = body.lang as string;
  const slug = body.slug as string;
  const episode = body.episode as string;

  await c.env.DB.prepare("INSERT INTO unlocked_ads (user_id, slug, episode) VALUES (?, ?, ?)")
    .bind(user.id, slug, parseInt(episode, 10))
    .run();

  return c.redirect(`/episode/${lang}/${slug}/${episode}`);
})
