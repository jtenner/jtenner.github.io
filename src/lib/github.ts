type GithubMeta = {
  owner: string;
  ownerUrl: string | null;
  repo: string | null;
  repoUrl: string | null;
};

const buildGithubMeta = (owner: string, repo: string | null): GithubMeta => ({
  owner,
  ownerUrl: owner ? `https://github.com/${owner}` : null,
  repo,
  repoUrl: owner ? `https://github.com/${owner}${repo ? `/${repo}` : ""}` : null,
});

export const parseGithubReference = (input: string): GithubMeta => {
  const trimmed = input.trim().replace(/^@/, "");

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname === "github.com" || parsed.hostname === "www.github.com") {
      const [owner = "", repo = ""] = parsed.pathname.split("/").filter(Boolean);
      return buildGithubMeta(owner, repo || null);
    }
  } catch (_error) {
    const [owner = "", repo = ""] = trimmed.split("/").filter(Boolean);
    if (owner) {
      return buildGithubMeta(owner, repo || null);
    }
  }

  return buildGithubMeta(trimmed, null);
};
