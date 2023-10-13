import { getInput } from '@actions/core';
import { context } from '@actions/github';
import { existsSync, outputFile } from 'fs-extra';
import { join } from 'path';
import { stringify } from 'yaml';

import { Err_DontGetNewsLink, Err_SameNameFile } from './toMarkdownConstant';
import {
  HTMLtoMarkdown,
  addComment,
  getRouteAddr,
  loadPage
} from './utilities';

(async () => {
  const newsLink = getInput('newsLink'),
    ignoreSelector = getInput('ignoreSelector'),
    markDownFilePath = getInput('markDownFilePath') || './';

  if (!newsLink) throw new Error(Err_DontGetNewsLink);

  const path = getRouteAddr(newsLink);
  const filePath = join(
    markDownFilePath,
    path.split('/').filter(Boolean).at(-1) + '.md'
  );
  if (existsSync(filePath)) throw new URIError(Err_SameNameFile);

  const { document } = await loadPage(path);
  const { meta, content } = HTMLtoMarkdown(document, ignoreSelector);

  const articleText = `---
${stringify({
  ...meta,
  originalURL: path,
  translator: '',
  reviewer: ''
}).trim()}
---

${content}`;

  await outputFile(filePath, articleText);

  const { repo, ref } = context;

  await addComment(
    `
- 原文地址：[${meta.title}](${path})
- 原文作者：[${meta.author || '匿名'}](${meta.authorURL})
- 翻译文件：[点击编辑](${join(
      `https://${repo.owner}/${repo.repo}/edit/${ref.replace(
        /^refs\/heads\//,
        ''
      )}`,
      filePath
    )})
`.trim()
  );
})().catch(async (error) => {
  console.log('ERR:', error);
  await addComment(error + '');
  process.exit(1);
});
