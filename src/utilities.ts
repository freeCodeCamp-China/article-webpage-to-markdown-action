import { debug, getInput } from '@actions/core';
import github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { gfm, strikethrough, tables, taskListItems } from 'turndown-plugin-gfm';

import { Err_DontGetTrueRoute } from './toMarkdownConstant.js';

export const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
})
  .use(strikethrough)
  .use(tables)
  .use(taskListItems)
  .use(gfm);

//add comment to issue
export async function addComment(body: string) {
  const githubToken = getInput('githubToken');

  if (!githubToken) throw new Error('GitHub token was not found');

  const octokit = new Octokit({ auth: githubToken });
  const { issue, repository } = github.context.payload;

  if (issue && repository)
    await octokit.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      body,
      issue_number: issue.number
    });

  debug(`issue: ${issue}`);
  debug(`repository: ${repository}`);
  debug(`comment: ${body}`);
}

// Check the input parameters, and get the routing address of the article.
// [原文标题](https://www.freecodecamp.org/news/xxxxxxx/)
export function getRouteAddr(URL: string) {
  const [_, title, path] = /\[(.+?)\]\((.+?)\)/.exec(URL) || [];

  if (!title || !path) throw new SyntaxError(Err_DontGetTrueRoute);

  return { title, path };
}

export async function HTMLtoMarkdown(path: string) {
  const {
    window: { document }
  } = await JSDOM.fromURL(path);

  const title =
      document.querySelector('h1')?.textContent?.trim() ||
      document.title.trim(),
    { textContent, href } =
      document.querySelector<HTMLAnchorElement>(
        'a[class*="author" i], [class*="author" i] a'
      ) || {};
  var content = '';

  for (const selector of [
    'article',
    '.article',
    '.content',
    'main',
    '.main',
    'body'
  ]) {
    const box = document.querySelector(selector);

    if (box) {
      for (const useless of document.querySelectorAll(
        'aside, [class*="ads" i]'
      ))
        useless.remove();

      content = turndownService.turndown(box.innerHTML);
      break;
    }
  }

  return {
    meta: {
      title,
      author: textContent?.trim(),
      authorURL: href
    },
    content
  };
}
