import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import { Octokit } from '@octokit/rest';
import { parseHTML } from 'linkedom';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm, strikethrough, tables, taskListItems } from 'turndown-plugin-gfm';

import { Err_DontGetTrueRoute } from './toMarkdownConstant';

export const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  hr: '---',
  codeBlockStyle: 'fenced'
})
  .use(strikethrough)
  .use(tables)
  .use(taskListItems)
  .use(gfm)
  .addRule('img-srcset', {
    filter: ['img'],
    replacement(_, { alt, title, src, srcset }: HTMLImageElement) {
      const [firstSet] = srcset.split(',')[0]?.split(/\s+/) || [];

      const content = [src || firstSet, title && JSON.stringify(title)].filter(
        Boolean
      );
      return `![${alt}](${content.join(' ')})`;
    }
  })
  .addRule('source-srcset', {
    filter: ['picture'],
    replacement(_, node: HTMLPictureElement) {
      const { src, alt, title } = node.querySelector('img') || {};

      const sourceList = Array.from(
        node.querySelectorAll('source'),
        ({ sizes, srcset }) => {
          const size = Math.max(
            ...sizes
              .split(/,|\)/)
              .map((pixel) => parseFloat(pixel.trim()))
              .filter(Boolean)
          );
          const [src] = srcset.split(',')[0]?.split(/\s+/) || [];

          return { size, src };
        }
      );
      const sources = sourceList.sort(({ size: a }, { size: b }) => b - a);

      const content = [
        src || sources[0]?.src,
        title && JSON.stringify(title)
      ].filter(Boolean);

      return `![${alt}](${content.join(' ')})`;
    }
  })
  .remove((node) => node.matches('script, aside, [class*="ads" i]'));

/**
 * add comment to issue
 */
export async function addComment(body: string) {
  const githubToken = getInput('githubToken');

  if (!githubToken) throw new Error('GitHub token was not found');

  const octokit = new Octokit({ auth: githubToken });
  const { issue, repository } = context.payload;

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

/**
 * Check the input parameters, and get the routing address of the article.
 */
export function getRouteAddr(markdown: string) {
  const { document } = parseHTML(marked(markdown));

  const { href } = document.querySelector('a') || {};

  if (!href) throw new SyntaxError(Err_DontGetTrueRoute);

  return href;
}

export async function loadPage(path: string) {
  const window = parseHTML(await (await fetch(path)).text());

  Object.defineProperty(window.document, 'baseURI', {
    value: path,
    writable: false
  });
  return window;
}

export function HTMLtoMarkdown(document: Document, ignoreSelector = '') {
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
      if (ignoreSelector)
        turndownService.remove((node) => node.matches(ignoreSelector));

      content = turndownService.turndown(box.innerHTML);
      break;
    }
  }

  return {
    meta: {
      title,
      author: textContent?.trim(),
      authorURL: href ? new URL(href, document.baseURI) + '' : ''
    },
    content
  };
}
