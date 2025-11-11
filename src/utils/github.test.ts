import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const MOCK_SETUP = {
  repository: {
    url: 'https://github.com/owner/repo.git',
  },
};

type ExecMock = (...args: unknown[]) => unknown;

// Module-scoped mock function so the hoisted vi.mock factory can reference it.
let mockedExecSync: ExecMock = (..._a: unknown[]) => undefined;

// Provide both a named `execSync` and a `default` shape to satisfy Vitest's ESM interop.
// Use ExecMock typing and avoid `any` casts.
vi.mock('node:child_process', () => ({
  default: {
    execSync: (...args: unknown[]) => (mockedExecSync as ExecMock)(...args),
  },
  execSync: (...args: unknown[]) => (mockedExecSync as ExecMock)(...args),
}));

// Mock the JSON setup import
vi.mock('@data/setup.json', () => ({ default: MOCK_SETUP }));

describe('getGithubInfo', () => {
  let cwdSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    // Ensure a fresh module instance per test when we import the SUT.
    vi.resetModules();
    // Reset the mock implementation/state for each test.
    // Assigning vi.fn() via a safe double-cast to the ExecMock type (no `any`).
    mockedExecSync = vi.fn() as unknown as ExecMock;
    // Stable cwd for path.relative calculations
    cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('/repo');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    cwdSpy = null;
  });

  it('returns structured GitHub info for a normal author email', async () => {
    // Prepare execSync output: hash|authorName|authorEmail|date
    mockedExecSync = vi.fn(
      () => 'abcd123|Alice Example|alice@example.com|2024-11-11T12:00:00Z',
    ) as unknown as ExecMock;

    const { getGithubInfo } = await import('./github.ts');

    const res = getGithubInfo('/repo/src/content/example.md');
    expect(res).not.toBeNull();

    expect(res).toMatchObject({
      author: { name: 'Alice Example', profileUrl: null },
      blameUrl:
        'https://github.com/owner/repo/blame/main/src/content/example.md',
      commitUrl: 'https://github.com/owner/repo/commit/abcd123',
      date: '2024-11-11T12:00:00Z',
      editUrl: 'https://github.com/owner/repo/edit/main/src/content/example.md',
      fileUrl: 'https://github.com/owner/repo/blob/main/src/content/example.md',
      hash: 'abcd123',
      historyUrl:
        'https://github.com/owner/repo/commits/main/src/content/example.md',
    });
  });

  it('parses GitHub noreply email into a profile URL', async () => {
    mockedExecSync = vi.fn(
      () =>
        'deadbeef|Bob|123+bobuser@users.noreply.github.com|2024-01-01T00:00:00Z',
    ) as unknown as ExecMock;

    const { getGithubInfo } = await import('./github.ts');

    const res = getGithubInfo('/repo/src/notes/note.md');
    expect(res).not.toBeNull();
    expect(res?.author.profileUrl).toBe('https://github.com/bobuser');
    expect(res?.author.name).toBe('Bob');
    expect(res?.commitUrl).toBe(
      'https://github.com/owner/repo/commit/deadbeef',
    );
  });

  it('returns null and warns when git command throws', async () => {
    // Simulate git failing (e.g., not a git repo)
    mockedExecSync = vi.fn(() => {
      throw new Error('git: not a git repository');
    }) as unknown as ExecMock;

    // Spy on console.warn to confirm warning path
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0);

    const { getGithubInfo } = await import('./github.ts');

    const res = getGithubInfo('/repo/src/does/not/exist.md');
    expect(res).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('handles malformed git output gracefully (returns best-effort object)', async () => {
    // Malformed: empty output
    mockedExecSync = vi.fn(() => '') as unknown as ExecMock;

    const { getGithubInfo } = await import('./github.ts');

    const res = getGithubInfo('/repo/src/malformed.md');
    // In the current implementation, even empty output produces an object (hash === '')
    expect(res).not.toBeNull();
    expect(res?.hash).toBe('');
    // author.name will be undefined because split result lacks parts
    expect(res?.author.name).toBeUndefined();
  });
});
