const REPO_DIRECTIVE = /^::github\[([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)\]$/;
const repositoryCache = new Map();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCount(value) {
  const count = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(count);
}

async function getRepository(repositoryName) {
  if (repositoryCache.has(repositoryName)) {
    return repositoryCache.get(repositoryName);
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "jtenner.github.io",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repositoryName}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub returned HTTP ${response.status}`);
    }

    const repository = await response.json();
    repositoryCache.set(repositoryName, repository);
    return repository;
  } catch (error) {
    console.warn(
      `[github-card] Could not load ${repositoryName}: ${error instanceof Error ? error.message : String(error)}`,
    );
    repositoryCache.set(repositoryName, null);
    return null;
  }
}

function renderMetaItem(label, value, icon) {
  return `<span class="github-repo-card__meta-item" aria-label="${escapeHtml(label)}">${icon}<span>${escapeHtml(value)}</span></span>`;
}

function renderCard(repositoryName, repository) {
  const repositoryUrl = repository?.html_url ?? `https://github.com/${repositoryName}`;
  const fullName = repository?.full_name ?? repositoryName;
  const description = repository?.description ?? "View this repository on GitHub.";

  const metadata = [];

  if (repository?.language) {
    metadata.push(
      `<span class="github-repo-card__meta-item"><span class="github-repo-card__language-dot" aria-hidden="true"></span><span>${escapeHtml(repository.language)}</span></span>`,
    );
  }

  if (repository) {
    metadata.push(
      renderMetaItem(
        `${repository.stargazers_count} GitHub stars`,
        formatCount(repository.stargazers_count),
        '<span class="github-repo-card__meta-icon" aria-hidden="true">★</span>',
      ),
    );
    metadata.push(
      renderMetaItem(
        `${repository.forks_count} GitHub forks`,
        formatCount(repository.forks_count),
        '<span class="github-repo-card__meta-icon" aria-hidden="true">⑂</span>',
      ),
    );
  }

  if (repository?.license?.spdx_id && repository.license.spdx_id !== "NOASSERTION") {
    metadata.push(
      `<span class="github-repo-card__meta-item"><span>${escapeHtml(repository.license.spdx_id)}</span></span>`,
    );
  }

  return `<a
  class="github-repo-card"
  href="${escapeHtml(repositoryUrl)}"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Open ${escapeHtml(fullName)} on GitHub"
  data-github-repo="${escapeHtml(repositoryName)}"
>
  <span class="github-repo-card__header">
    <svg class="github-repo-card__github-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.28 9.28 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
    </svg>
    <span class="github-repo-card__name">${escapeHtml(fullName)}</span>
    <span class="github-repo-card__arrow" aria-hidden="true">↗</span>
  </span>
  <span class="github-repo-card__description">${escapeHtml(description)}</span>
  ${metadata.length > 0 ? `<span class="github-repo-card__meta">${metadata.join("")}</span>` : ""}
</a>`;
}

async function transformChildren(node) {
  if (!Array.isArray(node?.children)) {
    return;
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (
      child.type === "paragraph" &&
      child.children?.length === 1 &&
      child.children[0]?.type === "text"
    ) {
      const source = child.children[0].value.trim();
      const match = REPO_DIRECTIVE.exec(source);

      if (match) {
        const repositoryName = match[1];
        const repository = await getRepository(repositoryName);

        node.children[index] = {
          type: "html",
          value: renderCard(repositoryName, repository),
        };
        continue;
      }
    }

    await transformChildren(child);
  }
}

export function remarkGithubCard() {
  return async function githubCardTransformer(tree) {
    await transformChildren(tree);
  };
}
