const core = require('@actions/core');
const TurndownService = require('turndown');
const { Octokit } = require('@octokit/rest');
const github = require('@actions/github');
const {
  strikethrough,
  tables,
  taskListItems,
  gfm
} = require('turndown-plugin-gfm');

const { Err_DontGetTrueRoute } = require('./toMarkdownConstant.js');

exports.turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
})
  .use(strikethrough)
  .use(tables)
  .use(taskListItems)
  .use(gfm);

//add comment to issue
exports.addComment = async (comment) => {
  const githubToken = core.getInput('githubToken');

  if (!githubToken) throw new Error('GitHub token was not found');

  const octokit = new Octokit({ auth: githubToken });
  const payload = github.context.payload;
  const issue = payload.issue;
  const repository = payload.repository;

  await octokit.issues.createComment({
    owner: repository.owner.login,
    repo: repository.name,
    body: comment.toString(),
    issue_number: issue.number
  });

  core.debug(`issue: ${issue}`);
  core.debug(`repository: ${repository}`);
  core.debug(`comment: ${comment}`);
};

// Check the input parameters, and get the routing address of the article.
// - 原文网址：[原文标题](https://www.freecodecamp.org/news/xxxxxxx/
exports.getRouteAddr = (URL) => {
  const [_, title, path] = /原文网址：\[(.+?)\]\((.+?)\)/.exec(URL) || [];

  if (!title || !path) throw new SyntaxError(Err_DontGetTrueRoute);

  return { title, path };
};
