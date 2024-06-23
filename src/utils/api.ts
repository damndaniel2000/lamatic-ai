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

export const checkDirectoryExists = async (
  folderName: string
): Promise<boolean> => {
  try {
    // Check if the directory already exists
    const directoryExists = await checkDirectoryExists(folderName);

    // If contents are found, it means the directory already exists
    if (directoryExists) {
      throw new Error("Template directory already exists.");
    }
    // Attempt to fetch the directory contents
    const { data: contents } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: gitPayload.owner,
        repo: gitPayload.repo,
        path: folderName,
      }
    );

    // If contents are found, it means the directory or file exists
    if (Array.isArray(contents) && contents.length > 0) {
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If the error status is 404 (Not Found), directory or file does not exist
    if (error.status === 404) {
      return false;
    } else {
      console.error("Error:", error);
      throw error; // Propagate the error for handling in your React component or caller function
    }
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
