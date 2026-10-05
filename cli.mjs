#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { parseArgs } from "node:util";
import chalk from "chalk";
import ora from "ora";
import gradient from "gradient-string";
import boxen from "boxen";
import figlet from "figlet";
import ogs from "open-graph-scraper";
import * as clack from "@clack/prompts";

const execAsync = promisify(exec);

// Paths
const ROOT_DIR = process.cwd();
const DATA_FILE = path.join(ROOT_DIR, "src", "data", "links.json");
const THUMBNAILS_DIR = path.join(ROOT_DIR, "public", "thumbnails");

// Aesthetic Claude-inspired gradient: Coral -> Amber -> Warm Stone
const claudeGradient = gradient([
  { color: "#d97757", pos: 0 },
  { color: "#e09f3e", pos: 0.5 },
  { color: "#f5f4ef", pos: 1 },
]);

// Curated high-res abstract fallback thumbnails from Unsplash
const FALLBACK_THUMBNAILS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
];

function getRandomFallback() {
  return FALLBACK_THUMBNAILS[
    Math.floor(Math.random() * FALLBACK_THUMBNAILS.length)
  ];
}

// Generate URL slug from title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .slice(0, 40);
}

// Load existing links
async function loadLinks() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

// Save links to file
async function saveLinks(links) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(links, null, 2), "utf-8");
}

// Process thumbnail input: supports URL, local file, or suggested fallback
async function resolveThumbnail(rawInput, scrapedImg, title) {
  const input = rawInput.trim();

  // If user hit enter or left blank, use scraped image or fallback
  if (!input) {
    return scrapedImg || getRandomFallback();
  }

  // Check if it's a URL
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  // Check if it's a local file path
  // Handle ~ for user home directory
  let localPath = input;
  if (localPath.startsWith("~")) {
    localPath = path.join(process.env.HOME || "", localPath.slice(1));
  }
  localPath = path.resolve(ROOT_DIR, localPath);

  if (existsSync(localPath)) {
    const spinner = ora(chalk.dim("Processing local thumbnail...")).start();
    try {
      await fs.mkdir(THUMBNAILS_DIR, { recursive: true });
      const ext = path.extname(localPath) || ".jpg";
      const cleanSlug = slugify(title || "thumb");
      const filename = `${cleanSlug}-${Date.now()}${ext}`;
      const destPath = path.join(THUMBNAILS_DIR, filename);

      await fs.copyFile(localPath, destPath);
      spinner.succeed(
        chalk.green(`Copied local thumbnail to /public/thumbnails/${filename}`)
      );
      return `/thumbnails/${filename}`;
    } catch (err) {
      spinner.warn(
        chalk.yellow(`Could not copy local file (${err.message}). Using fallback.`)
      );
      return scrapedImg || getRandomFallback();
    }
  } else {
    // If not found locally and not URL, check if relative to current dir
    return scrapedImg || getRandomFallback();
  }
}

async function scrapeMetadata(url) {
  const spinner = ora(chalk.dim(`Inspecting ${chalk.cyan(url)}...`)).start();
  try {
    const { result } = await ogs({
      url,
      timeout: 8000,
      headers: { "user-agent": "Mozilla/5.0 (compatible; LinkFlowBot/1.0)" },
    });

    spinner.succeed(chalk.green("Metadata fetched successfully!"));

    let scrapedImg = "";
    if (result.ogImage && result.ogImage.length > 0) {
      scrapedImg = result.ogImage[0].url || "";
    }

    return {
      title: result.ogTitle || result.twitterTitle || "",
      description: result.ogDescription || result.twitterDescription || "",
      image: scrapedImg,
    };
  } catch (err) {
    spinner.info(
      chalk.dim("Could not auto-extract metadata; you can enter details manually.")
    );
    return { title: "", description: "", image: "" };
  }
}

async function main() {
  const { values: args } = parseArgs({
    options: {
      url: { type: "string", short: "u" },
      thumb: { type: "string", short: "t" },
      title: { type: "string" },
      desc: { type: "string", short: "d" },
      tags: { type: "string" },
      deploy: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
    strict: false,
  });

  if (args.help) {
    console.log(claudeGradient(figlet.textSync("LinkFlow", { font: "Slant" })));
    console.log(chalk.hex("#9e9b91")(`
Usage:
  Interactive Mode:
    node cli.mjs              (or npm run add)

  Direct Command Mode:
    node cli.mjs -u <url> [-t <thumb>] [--title <title>] [-d <desc>] [--tags <tags>]

Options:
  -u, --url <url>         Link URL (required in direct mode)
  -t, --thumb <path|url>  Thumbnail URL or local image file path
  --title <title>         Custom title (auto-scraped if omitted)
  -d, --desc <desc>       Custom description (auto-scraped if omitted)
  --tags <tags>           Comma-separated tags (e.g. "design,tools")
  --deploy <type>         vercel | git | both | skip
  -h, --help              Show help information
`));
    process.exit(0);
  }

  // Direct programmatic mode if --url provided
  if (args.url) {
    const rawUrl = args.url.trim();
    const cleanUrl = rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`;
    const meta = await scrapeMetadata(cleanUrl);
    const title = (args.title || meta.title || new URL(cleanUrl).hostname).trim();
    const desc = (args.desc || meta.description || "Curated reference and web resource.").trim();
    const rawThumb = args.thumb || meta.image || "";
    const finalThumb = await resolveThumbnail(rawThumb, meta.image, title);
    const tags = args.tags
      ? args.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Web"];

    const newLink = {
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      url: cleanUrl,
      title,
      description: desc,
      thumbnail: finalThumb,
      tags: tags.length > 0 ? tags : ["General"],
      createdAt: new Date().toISOString(),
    };

    const links = await loadLinks();
    links.unshift(newLink);
    await saveLinks(links);

    console.log(
      boxen(
        [
          chalk.bold.hex("#f5f4ef")(newLink.title),
          chalk.hex("#9e9b91")(newLink.description),
          `${chalk.hex("#d97757")("URL:")} ${chalk.underline(newLink.url)}`,
          `${chalk.hex("#d97757")("Thumb:")} ${chalk.dim(newLink.thumbnail)}`,
          `${chalk.hex("#d97757")("Tags:")} ${newLink.tags.map((t) => `#${t}`).join(" ")}`,
        ].join("\n"),
        {
          padding: 1,
          borderColor: "#d97757",
          borderStyle: "round",
          title: chalk.bold.green("✓ Link Added to Vault"),
        }
      )
    );

    if (args.deploy === "vercel" || args.deploy === "both") {
      try {
        await execAsync("vercel --prod --yes", { cwd: ROOT_DIR });
        console.log(chalk.green("✓ Deployed to Vercel"));
      } catch (err) {
        console.log(chalk.yellow("Vercel deploy notice: Authenticate with `vercel login`"));
      }
    }
    if (args.deploy === "git" || args.deploy === "both") {
      try {
        await execAsync("git add . && git commit -m 'feat(links): add link via CLI'", { cwd: ROOT_DIR });
        const { stdout: remotes } = await execAsync("git remote -v", { cwd: ROOT_DIR });
        if (remotes.trim()) {
          await execAsync("git push", { cwd: ROOT_DIR });
          console.log(chalk.green("✓ Pushed to Git"));
        }
      } catch (err) {
        console.log(chalk.yellow(`Git notice: ${err.message}`));
      }
    }

    process.exit(0);
  }

  // Interactive Animated Mode
  console.clear();

  // Print Banner
  const asciiTitle = figlet.textSync("LinkFlow", {
    font: "Slant",
    horizontalLayout: "default",
  });

  console.log(claudeGradient(asciiTitle));
  console.log(
    chalk.hex("#9e9b91")(
      "  Tactile Link Directory · Interactive CLI & Vercel Synchronizer\n"
    )
  );

  clack.intro(chalk.bold.hex("#d97757")("Add Curated Links to Site"));

  const links = await loadLinks();
  const initialCount = links.length;
  const newLinksAdded = [];

  let addingMore = true;

  while (addingMore) {
    console.log(chalk.hex("#2e2b26")("─".repeat(50)));

    // 1. Link URL
    const rawUrl = await clack.text({
      message: "Enter Link URL:",
      placeholder: "https://example.com",
      validate: (value) => {
        if (!value || value.trim().length === 0) return "URL is required";
        try {
          const formatted = value.includes("://") ? value : `https://${value}`;
          new URL(formatted);
        } catch {
          return "Please enter a valid URL";
        }
      },
    });

    if (clack.isCancel(rawUrl)) {
      clack.cancel("Operation cancelled.");
      process.exit(0);
    }

    const cleanUrl = rawUrl.includes("://") ? rawUrl : `https://${rawUrl}`;

    // Scrape Open Graph metadata in background
    const meta = await scrapeMetadata(cleanUrl);

    // 2. Thumbnail input (as requested by user)
    const rawThumbnail = await clack.text({
      message: "Thumbnail (image URL, local file path, or hit Enter to use suggested):",
      placeholder: meta.image || "Leave blank for auto / custom path",
      initialValue: meta.image || "",
    });

    if (clack.isCancel(rawThumbnail)) {
      clack.cancel("Operation cancelled.");
      process.exit(0);
    }

    // 3. Title
    const title = await clack.text({
      message: "Title:",
      placeholder: "Resource Title",
      initialValue: meta.title || new URL(cleanUrl).hostname,
      validate: (v) => (!v.trim() ? "Title cannot be empty" : undefined),
    });

    if (clack.isCancel(title)) {
      clack.cancel("Operation cancelled.");
      process.exit(0);
    }

    // Resolve thumbnail with final title context
    const finalThumbnail = await resolveThumbnail(
      rawThumbnail,
      meta.image,
      title
    );

    // 4. Description
    const description = await clack.text({
      message: "Description:",
      placeholder: "Brief note or summary...",
      initialValue: meta.description || "Curated reference and web resource.",
    });

    if (clack.isCancel(description)) {
      clack.cancel("Operation cancelled.");
      process.exit(0);
    }

    // 5. Tags
    const tagsInput = await clack.text({
      message: "Tags (comma separated):",
      placeholder: "design, inspiration, tools",
      initialValue: "Web",
    });

    if (clack.isCancel(tagsInput)) {
      clack.cancel("Operation cancelled.");
      process.exit(0);
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Build link record
    const newLink = {
      id: `${slugify(title)}-${Date.now().toString(36)}`,
      url: cleanUrl,
      title: title.trim(),
      description: description.trim(),
      thumbnail: finalThumbnail,
      tags: tags.length > 0 ? tags : ["General"],
      createdAt: new Date().toISOString(),
    };

    links.unshift(newLink);
    newLinksAdded.push(newLink);

    // Show Card Preview
    const cardContent = [
      `${chalk.bold.hex("#f5f4ef")(newLink.title)}`,
      `${chalk.hex("#9e9b91")(newLink.description)}`,
      `${chalk.hex("#d97757")("URL:")} ${chalk.underline(newLink.url)}`,
      `${chalk.hex("#d97757")("Thumb:")} ${chalk.dim(newLink.thumbnail)}`,
      `${chalk.hex("#d97757")("Tags:")} ${newLink.tags.map((t) => `#${t}`).join(" ")}`,
    ].join("\n");

    console.log(
      boxen(cardContent, {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: "round",
        borderColor: "#d97757",
        title: chalk.bold.green("✓ Link Added to Vault"),
        titleAlignment: "center",
      })
    );

    // Ask if adding another link
    const addAnother = await clack.confirm({
      message: "Add another link?",
      initialValue: false,
    });

    if (clack.isCancel(addAnother) || !addAnother) {
      addingMore = false;
    }
  }

  // Save changes to disk
  const saveSpinner = ora(chalk.dim("Saving updated links dataset...")).start();
  await saveLinks(links);
  saveSpinner.succeed(
    chalk.green(
      `Saved! Added ${newLinksAdded.length} new link(s). Total in archive: ${links.length}`
    )
  );

  // Deployment Phase
  console.log("\n" + chalk.hex("#2e2b26")("─".repeat(50)));
  const deployAction = await clack.select({
    message: "Deploy changes:",
    options: [
      {
        value: "vercel",
        label: "Deploy to Vercel (via Vercel CLI)",
        hint: "Runs 'vercel --prod'",
      },
      {
        value: "git",
        label: "Commit & Push to Git (GitHub/GitLab)",
        hint: "Triggers Vercel automatic git deployment",
      },
      {
        value: "both",
        label: "Both (Git Push + Vercel Deploy)",
        hint: "Recommended for production",
      },
      {
        value: "skip",
        label: "Skip deployment for now",
        hint: "Save locally only",
      },
    ],
  });

  if (clack.isCancel(deployAction) || deployAction === "skip") {
    clack.outro(
      chalk.hex("#d97757")(
        "Links saved locally! Run `npm run dev` to preview your site."
      )
    );
    process.exit(0);
  }

  // Handle Git push
  if (deployAction === "git" || deployAction === "both") {
    const gitSpinner = ora(
      chalk.dim("Staging and committing changes to Git...")
    ).start();
    try {
      await execAsync("git add .", { cwd: ROOT_DIR });
      const commitMsg = `feat(links): add ${newLinksAdded.length} curated link(s) via CLI`;
      await execAsync(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR });
      gitSpinner.succeed(chalk.green(`Committed: "${commitMsg}"`));

      // Check if remote exists
      const { stdout: remotes } = await execAsync("git remote -v", {
        cwd: ROOT_DIR,
      });

      if (remotes.trim()) {
        const pushSpinner = ora(chalk.dim("Pushing changes to remote...")).start();
        try {
          const { stdout: branch } = await execAsync(
            "git rev-parse --abbrev-ref HEAD",
            { cwd: ROOT_DIR }
          );
          await execAsync(`git push origin ${branch.trim()}`, { cwd: ROOT_DIR });
          pushSpinner.succeed(
            chalk.green(`Pushed to remote! Vercel will auto-deploy.`)
          );
        } catch (pushErr) {
          pushSpinner.warn(
            chalk.yellow(`Git push warning: ${pushErr.message.trim()}`)
          );
        }
      } else {
        console.log(
          chalk.hex("#9e9b91")(
            "\nTip: No git remote found. To auto-deploy via GitHub on Vercel:\n" +
              chalk.cyan("  git remote add origin <your-github-repo-url>\n") +
              chalk.cyan("  git push -u origin main\n")
          )
        );
      }
    } catch (err) {
      gitSpinner.warn(chalk.yellow(`Git: ${err.message.trim()}`));
    }
  }

  // Handle Vercel CLI deploy
  if (deployAction === "vercel" || deployAction === "both") {
    const vercelSpinner = ora(
      chalk.dim("Deploying site to Vercel production...")
    ).start();

    try {
      const { stdout } = await execAsync("vercel --prod --yes", {
        cwd: ROOT_DIR,
      });
      vercelSpinner.succeed(chalk.green("Deployed to Vercel successfully!"));
      console.log(chalk.hex("#f5f4ef")(stdout));
    } catch (err) {
      vercelSpinner.fail(chalk.red("Vercel deployment requires authentication."));
      console.log(
        boxen(
          chalk.yellow(
            "To deploy directly using Vercel CLI, authenticate once:\n\n" +
              chalk.bold.white("  vercel login\n") +
              chalk.bold.white("  vercel --prod\n\n") +
              "Or link your Git repository to Vercel for automatic CI/CD deploys!"
          ),
          {
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderColor: "#d97757",
            borderStyle: "round",
          }
        )
      );
    }
  }

  clack.outro(
    claudeGradient("✨ All set! Your links and site are synchronized.")
  );
}

main().catch((err) => {
  console.error(chalk.red("\nFatal Error:"), err);
  process.exit(1);
});
