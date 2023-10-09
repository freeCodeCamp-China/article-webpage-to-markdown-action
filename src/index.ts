import { getInput } from '@actions/core';
import { existsSync, promises } from 'fs';
import { join } from 'path';

import { Err_DontGetNewsLink, Err_SameNameFile } from './toMarkdownConstant';
import { HTMLtoMarkdown, addComment, getRouteAddr } from './utilities';

// cd ./news-translation
// You can run `node script\toMarkdown\index.js URL<String>`(URL is the URL of the article).
(async () => {
  const newsLink = getInput('newsLink'),
    markDownFilePath = getInput('markDownFilePath') || './';

  if (!newsLink) throw new Error(Err_DontGetNewsLink);

  const { title, path } = getRouteAddr(newsLink);
  const filePath = join(
    markDownFilePath,
    path.split('/').filter(Boolean).at(-1) + '.md'
  );
  if (existsSync(filePath)) throw new URIError(Err_SameNameFile);

  const { meta, content } = await HTMLtoMarkdown(path);

  const articleText = `> -  原文地址：[${title}](${path})
> -  原文作者：[${meta.author || '匿名'}](${meta.authorURL})
> -  译者：
> -  校对者：

${content}`;

  await promises.writeFile(filePath, articleText);
})().catch((error) => {
  console.log('ERR:', error);
  addComment(error + '');
  process.exit(1);
});
