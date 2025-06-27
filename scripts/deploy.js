import { execSync } from "child_process";
import { rmSync, renameSync, existsSync, copyFileSync } from "fs";

try {
  execSync("pnpm build", { stdio: "inherit" });

  // Remove docs/
  rmSync("docs", { recursive: true, force: true });

  // Move dist/ to docs/
  renameSync("dist", "docs");

  // Copy CNAME file
  if (existsSync("CNAME")) {
    copyFileSync("CNAME", "docs/CNAME");
  } else {
    console.warn("No CNAME file found in root.");
  }

  // Commit and push
  execSync("git add -A", { stdio: "inherit" });

  // Check if should commit
  const hasChanges = execSync("git diff --cached --quiet || echo CHANGES")
    .toString()
    .includes("CHANGES");

  if (hasChanges) {
    execSync("git commit -m \"Update deployed site\"", { stdio: "inherit" });
    execSync("git push", { stdio: "inherit" });
    console.log("Deployment successful.");
  } else {
    console.log("Skipping deployment.");
  }
} catch (error) {
  console.error("Deployment failed:", error.message);
}
