import agentSkills from '@data/agent-skills.json' with { type: 'json' };
import type { APIRoute } from 'astro';

export const prerender = true;

export const AGENT_SKILLS_INDEX = agentSkills;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(AGENT_SKILLS_INDEX, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
