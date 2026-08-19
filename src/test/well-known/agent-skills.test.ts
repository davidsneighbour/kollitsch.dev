// @vitest-environment node
import { describe, expect, it } from 'vitest';

import {
  AGENT_SKILLS_INDEX,
  GET,
} from '@pages/.well-known/agent-skills/index.json.ts';

describe('/.well-known/agent-skills/index.json', () => {
  it('returns an Agent Skills Discovery index', async () => {
    const response = await GET({} as never);
    const body = await response.json();

    expect(response.headers.get('Content-Type')).toBe(
      'application/json; charset=utf-8',
    );
    expect(body).toEqual(AGENT_SKILLS_INDEX);
    expect(body.$schema).toBe(
      'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
    );
    expect(Array.isArray(body.skills)).toBe(true);
    expect(body.skills.length).toBeGreaterThan(0);
  });

  it('gives every skill a name, type, description, url, and sha256 digest', () => {
    const namePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const digestPattern = /^sha256:[a-f0-9]{64}$/;
    const seenNames = new Set<string>();

    for (const skill of AGENT_SKILLS_INDEX.skills) {
      expect(skill.name).toMatch(namePattern);
      expect(seenNames.has(skill.name)).toBe(false);
      seenNames.add(skill.name);

      expect(['skill-md', 'archive']).toContain(skill.type);
      expect(skill.description.length).toBeGreaterThan(0);
      expect(skill.description.length).toBeLessThanOrEqual(1024);
      expect(() => new URL(skill.url)).not.toThrow();
      expect(skill.digest).toMatch(digestPattern);
    }
  });
});
