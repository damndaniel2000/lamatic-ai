import { ReactNode } from "react";

export type RepoFiles = {
  path: string;
  content: string;
};

export type FileToUpload = {
  name: string;
  content: string;
};

export type GitFile = {
  path: string;
  // File = '100644'
  // ExecutableFile = '100755'
  // Directory = '040000'
  // Submodule = '160000'
  // Symlink = '120000'
  mode: "100644" | "100755" | "040000" | "160000" | "120000";
  type: "commit" | "tree" | "blob";
  sha?: string | null;
  content: string;
};

export type IconProps = {
  width: number;
  height: number;
};

export type FlowNode = {
  title: string;
  items: { name: string; icon?: ReactNode }[];
};
