import {GitHubLinksItem} from "./gitHubLinksItem";

export interface GitHubFileContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: GitHubLinksItem[];
}