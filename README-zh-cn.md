## article-webpage-to-markdown-action

![GitHub](https://img.shields.io/github/license/freeCodeCamp-China/article-webpage-to-markdown-action) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/freeCodeCamp-China/article-webpage-to-markdown-action) ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/freeCodeCamp-China/article-webpage-to-markdown-action?include_prereleases&label=release-last) 

语言: [English](./README.md) | 简体中文

### 简介

根据文章的网页自动生成 Markdown 文件。目前只支持 freeCodeCamp 的 news 站点。

#### 项目结构
 
```
news-translate
|  action.yml  /** 入口文件 **/
│  package.json
│  README.md
│
|-.github
│  |-ISSUE_TEMPLATE
│  │   AutoGenerateMarkdown.md  /** 自动生成 Markdown 文件的 issue 模板 **/
│  │
│  |-workflows
│      WebPageToMarkdown.yml  /** 用于自动生成 Markdown 文件的 Actions 文件 **/
│
|-dist  /** 编译后的静态文件夹 **/
|
|-node_modules
│
|-src
   |-toMarkdown
      |  index.js  /** 脚本的入口文件 **/
      |  toMarkdownConstant.js  /** 配置文件 **/
      |  utilities.js  /** 函数库文件 **/
      |
      |-__tests__
         utilities.test.js  /** 测试文件 **/
```
---
<h3>Usage</h3>

在 job 中添加下面的 step.

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v0.1.7
  with:
    newsLink: '${{ github.event.issue.Body }}'
    markDownFilePath: './chinese/articles/'
    githubToken: ${{ github.token }}
```

下面是一个扩展示例，尽可能包含所有选项。

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v0.1.7
  with:
    # 一个特定的格式的字符串，该字符串包含一个指向 freeCodeCamp 的News 的链接。
    # 格式: "原文网址：[原文标题](https://www.freecodecamp.org/news/xxxxxxx/"
    newsLink: '${{ github.event.issue.Body }}'
    # 生成 MarkDown 文件的路径
    # 相对命令行位置的相对路径
    markDownFilePath: './chinese/articles/'
    githubToken: ${{ github.token }}
```

<h4 id="submit-an-issue">通过 GitHub 的 issue 运行脚本</h4>

**Issues** >> **New issue** >> 填写 issue 的标题和描述 >> **Submit new issue**

#### 描述（Description）：
```
- 原文网址：[原文标题](https://www.freeCodeCamp.org/news/路由/)
- MarkDown 文件：https://github.com/freeCodeCamp/news-translation/edit/master/chinese/articles/文章文件名称.md
```
用原文标题替换 `原文标题`，用文章的路由地址替换 `路由` 和 `文章文件名称`。

#### 示例：
如果文章的 URL 是 `https://www.freecodecamp.org/news/Example/`，标题是 `Example Title`。

*标题（Title）：*
```
[Auto]示例标题
```
*描述（Description）：*
```
- 原文网址：[Example Title](https://www.freeCodeCamp.org/news/Example/)
- MarkDown 文件：https://github.com/freeCodeCamp/news-translation/edit/master/chinese/articles/Example.md
```

可以通过检查 **Actions** 的执行结果，以确认脚本是否成功执行。或者在选项 `markDownFilePath` 中设置的位置检查文件是否存在。 如果未配置选项`markDownFilePath`，则默认情况下会在当前路径中生成文件。

如果脚本执行**失败**，您需要确认问题，解决问题，然后根据前面的步骤发布**新 issue**。 [*常见错误消息*](#CommonErrorMessages) 和 *Actions 的日志* 将为您提供一些可靠的提示。

<h3 id="CommonErrorMessages">常见错误消息</h3>

- **No parameters were found. Please confirm that the description of the issue has been entered.**
  issue 的描述为空，请根据模板填写内容。
- **The route to the article is not matched. Please confirm that the URL is correct.**
  在 issue 的描述中，只需要替换 `原文标题`， `路由` 和 `文章文件名称` 即可，并且请保留其他字符。
- **There is one file with the same name exists.Please check if the article has been added.**
  在 `./chinese/articles` 文件夹下有一个同名文件。
- **The DOM of the website has been modified, or there is a problem with loading, please confirm.**
  网站的 DOM 结构可能更改，并且脚本需要修改。

---

## 贡献者指南

请转到[贡献者指南](CONTRIBUTING.md)。

---

### 许可证

- 程序遵循 [BSD-3-Clause](LICENSE) 许可证。
