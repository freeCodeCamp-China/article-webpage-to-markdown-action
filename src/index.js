const fs = require('fs');
const { join } = require('path');
const { JSDOM } = require('jsdom');

const { Err_DontGetNewsLink } = require('./toMarkdownConstant');
const { addComment, getRouteAddr, turndownService } = require('./utilities');

// cd ./news-translation
// You can run `node script\toMarkdown\index.js URL<String>`(URL is the URL of the article).
(async () => {
  try {
    const newsLink = core.getInput('newsLink'),
      markDownFilePath = core.getInput('markDownFilePath') || './';

    if (!newsLink) throw new Error(Err_DontGetNewsLink);

    const { title, path } = getRouteAddr(newsLink);
    const articleChildRouter = path.split('/').filter(Boolean).at(-1);
    const {
      window: { document }
    } = await JSDOM.fromURL(path);

    const articleFileName = articleChildRouter + '.md',
      { textContent, href } =
        document.querySelector(
          '.author-card-content-no-bio > .author-card-name > a'
        ) || {};

    const articleText = `> -  原文地址：[${title}](${path})
> -  原文作者：[${textContent.trim() || '匿名'}](${href})
> -  译者：
> -  校对者：

${turndownService.turndown(document.documentElement.outerHTML)}`;

    const filePath = join(markDownFilePath, articleFileName);

    if (fs.existsSync(filePath)) throw new Error('file has exist');

    await fs.promises.writeFile(filePath, articleText);
  } catch (error) {
    console.log('ERR:', error);
    addComment(error);
    process.exit(1);
  }
})();
