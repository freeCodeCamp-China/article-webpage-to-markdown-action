import { getInput, setOutput } from '@actions/core';
import { context } from '@actions/github';
import { existsSync, outputFile } from 'fs-extra';
import { join } from 'path';
import { stringify } from 'yaml';

import { Err_DontGetPageURL, Err_SameNameFile } from './toMarkdownConstant';
import {
  HTMLtoMarkdown,
  addComment,
  getRouteAddr,
  loadPage
} from './utilities';

const pageURL = getInput('pageURL'),
  ignoreSelector = getInput('ignoreSelector'),
  markdownFolder = getInput('markdownFolder') || './';

if (!pageURL) throw new Error(Err_DontGetPageURL);

const { href, pathname } = getRouteAddr(pageURL);
const filePath = join(
  markdownFolder,
  pathname.split('/').filter(Boolean).at(-1) + '.md'
);
if (existsSync(filePath)) throw new URIError(Err_SameNameFile);

(async () => {
  const { document } = await loadPage(href);
  const { meta, content } = HTMLtoMarkdown(document, ignoreSelector);

  const articleText = `---
${stringify({
  ...meta,
  originalURL: href,
  translator: '',
  reviewer: ''
}).trim()}
---

${content.replace('\n\n', '\n\n<!-- more -->\n\n')}`;

  await outputFile(filePath, articleText);

  const { repo, ref } = context;
  const editorURL = `https://github.com/${repo.owner}/${
    repo.repo
  }/edit/${join(ref.replace(/^refs\/heads\//, ''), filePath)}`;

  setOutput('original_url', href);
  setOutput('title', meta.title);
  setOutput('date', meta.date);
  setOutput('author', meta.author);
  setOutput('author_url', meta.authorURL);
  setOutput('markdown_file_path', filePath);
  setOutput('editor_url', editorURL);
})().catch(async (error) => {
  console.log('ERR:', error);
  await addComment(error + '');
  process.exit(1);
});
