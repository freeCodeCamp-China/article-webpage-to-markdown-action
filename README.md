# article-webpage-to-markdown-action

![GitHub](https://img.shields.io/github/license/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/freeCodeCamp-China/article-webpage-to-markdown-action?include_prereleases&label=release-last)

Language: English | [简体中文](./README-zh-cn.md)

## Introduction

Automatically generate Markdown files based on the webpages of articles. Currently supports freeCodeCamp's news site.

### Project structure

```plain
news-translate
|  action.yml  // Entry file 
│  package.json
│  README.md
│
|-.github
│  |-ISSUE_TEMPLATE
│  │   AutoGenerateMarkdown.md  // Automatically generate Markdown issue template 
│  │
│  |-workflows
│      WebPageToMarkdown.yml  // Actions file for automatically generating Markdown files 
│
|-dist  // Compiled static folder 
│
|-node_modules
│
|-src
|  |-index.ts  // Entry file of the script 
|  |-toMarkdownConstant.ts  // Configuration file 
|  |-utilities.ts  // Function library file 
|
|-test
   |-utilities.test.js  // test file 
```

---

### Usage

Add the following step your job.

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v0.2.0
  with:
    newsLink: '${{ github.event.issue.Body }}'
    markDownFilePath: './chinese/articles/'
    githubToken: ${{ github.token }}
```

The following is an extended example with all possible options available for this Action.

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v0.2.0
  with:
    # A string in a specific format that contains a link to freeCodeCamp News
    # format: "原文网址：[原文标题](https://www.freecodecamp.org/news/xxxxxxx/"
    newsLink: '${{ github.event.issue.Body }}'
    # Path of the generated MarkDown file
    # Relative path relative to the root folder
    markDownFilePath: './chinese/articles/'
    githubToken: ${{ github.token }}
```

<h3 id="submit-an-issue">Run the script by the issue of GitHub</h3>

**Issues** >> **New issue** >> Fill in the title and description of the issue >> **Submit new issue**

### Description

```plain
- 原文网址：[原文标题](https://www.freeCodeCamp.org/news/路由/)
- MarkDown 文件：https://github.com/freeCodeCamp/news-translation/edit/master/chinese/articles/文章文件名称.md
```

Replace `原文标题` with the original title. And replace `路由` and `文章文件名称` with the route of the article.

### Example

If the URL of an article is `https://www.freecodecamp.org/news/Example/`, and its title is `Example Title`.

_Description:_

```plain
- 原文网址：[Example Title](https://www.freecodecamp.org/news/Example/)
- MarkDown 文件：https://github.com/freeCodeCamp/news-translation/edit/master/chinese/articles/Example.md
```

If you want to confirm whether the script is executed successfully, you can check the execution result of **Actions**, or check the existence of the file at the location you set in the option `markDownFilePath`. If you do not configure the option `markDownFilePath`, the file is generated in the current path by default.

If the script execution **fails**, you need to confirm the problem, solve them, and post a **new issue** according to the previous steps. In the **Action log**, The [_Common Error Messages_](#CommonErrorMessages) will give you some reliable tips.

---

### Common Error Messages

- **No parameters were found. Please confirm that the description of the issue has been entered.**
  The description of the issue is empty, please fill in the content according to the template.
- **The route to the article is not matched. Please confirm that the URL is correct.**
  In the description of the issue, you only need to replace `原文标题`, `路由` and `文章文件名称`. And please keep other characters.
- **There is one file with the same name exists.Please check if the article has been added.**
  There is a file with the same name under the folder `./chinese/articles`.
- **The DOM of the website has been modified, or there is a problem with loading, please confirm.**
  The DOM structure of the website may be changed and the script needs to be modified.

---

## Contributing guide

Please go to the [contributing guide](CONTRIBUTING.md).

---

## License

- The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
