import { Octokit } from "@octokit/rest";
import { FileToUpload, GitFile, RepoFiles } from "./types";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

const gitPayload = {
  owner: "damndaniel2000",
  repo: "lamatic-templates",
};

export const getGitFiles = async (): Promise<RepoFiles[] | null> => {
  try {
    const response = await octokit.repos.getContent({
      ...gitPayload,
      path: "",
    });

    if (Array.isArray(response.data)) {
      const folders = response.data.filter((item) => item.type === "dir");
      const fileContents: RepoFiles[] = [];

      for (const folder of folders) {
        const folderContent = await octokit.repos.getContent({
          ...gitPayload,
          path: folder.path,
        });

        if (Array.isArray(folderContent.data)) {
          const jsonFiles = folderContent.data.filter((file) =>
            file.name.endsWith(".json")
          );

          for (const jsonFile of jsonFiles) {
            const fileResponse = await octokit.repos.getContent({
              ...gitPayload,
              path: jsonFile.path,
            });

            if ("content" in fileResponse.data) {
              const decodedContent = atob(fileResponse.data.content);
              fileContents.push({
                path: jsonFile.path,
                content: decodedContent,
              });
            }
          }
        }
      }
      return fileContents;
    } else {
      console.error("Repository root content is not a directory");
      return null;
    }
  } catch (e) {
    console.error("An error occurred while fetching the files:", e);
    return null;
  }
};

export const uploadFile = async (files: FileToUpload[], folderName: string) => {
  try {
    const commits = await octokit.repos.listCommits(gitPayload);
    const commitSha = commits.data[0].sha;

    const commitableFiles: GitFile[] = files.map(({ name, content }) => {
      return {
        path: `${folderName}/${name}`, // Prepend folder name to file path
        mode: "100644",
        type: "commit",
        content: content,
      };
    });

    const {
      data: { sha: currentTreeSHA },
    } = await octokit.git.createTree({
      ...gitPayload,
      tree: commitableFiles,
      base_tree: commitSha,
      message: "Updated programatically with Octokit",
      parents: [commitSha],
    });

    const {
      data: { sha: newCommitSHA },
    } = await octokit.git.createCommit({
      ...gitPayload,
      tree: currentTreeSHA,
      message: `Updated programatically with Octokit`,
      parents: [commitSha],
    });

    await octokit.git.updateRef({
      ...gitPayload,
      sha: newCommitSHA,
      ref: "heads/main",
    });

    console.log("SUCCESS");
  } catch (e) {
    console.log(e);
  }
};
