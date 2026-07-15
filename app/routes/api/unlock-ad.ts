import { createRoute } from 'honox/factory'

export const POST = createRoute(async (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/login');

  const body = await c.req.parseBody();
  const slug = body.slug as string;
  const episode = body.episode as string;

  // Simulasi Server: Merekam ke Database bahwa user ini telah menonton iklan untuk episode spesifik
  await c.env.DB.prepare("INSERT INTO unlocked_ads (user_id, slug, episode) VALUES (?, ?, ?)")
    .bind(user.id, slug, parseInt(episode, 10))
    .run();

  // Redirect kembali ke episode tersebut, sekarang akan terbuka!
  return c.redirect(`/episode/${slug}/${episode}`);
})
