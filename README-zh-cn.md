# Article Web-page to Markdown action

![GitHub](https://img.shields.io/github/license/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/freeCodeCamp-China/article-webpage-to-markdown-action?include_prereleases&label=release-last)

语言: [English](./README.md) | 简体中文

## 简介

根据文章的网页自动生成 Markdown 文件。

### 项目结构

```plain
news-translate
|  action.yml  // 入口文件
│  package.json
│  README.md
│
|-.github
│  |-ISSUE_TEMPLATE
│  │   AutoGenerateMarkdown.md  // 自动生成 Markdown 文件的 issue 模板
│  │
│  |-workflows
│      WebPageToMarkdown.yml  // 用于自动生成 Markdown 文件的 Actions 文件
│
|-dist  // 编译后的静态文件夹
|
|-node_modules
│
|-src
|  |-index.ts  // 脚本的入口文件
|  |-toMarkdownConstant.ts  // 配置文件
|  |-utilities.ts  // 函数库文件
|
|-test
   |-utilities.test.ts  // 测试文件
```

### 用法

在 GitHub action 配置文件的 `jobs` 字段中添加下面的 step：

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v1
  with:
    newsLink: '${{ github.event.issue.Body }}'
    markDownFilePath: './articles/'
    githubToken: ${{ github.token }}
```

下面是一个扩展示例，尽可能包含所有选项：

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v1
  with:
    # 一个包含原文 URL 的字符串
    newsLink: '${{ github.event.issue.Body }}'
    # 需忽略元素的 CSS 选择符
    ignoreSelector: '.ad-wrapper'
    # 生成 MarkDown 文件的路径
    # 相对命令行工作目录的相对路径
    markDownFilePath: './articles/'
    githubToken: ${{ github.token }}
```

如果未配置选项 `markDownFilePath`，则默认情况下会在当前路径中生成文件。

### 通过 GitHub 的 issue 运行脚本

**Issues** >> **New issue** >> 填写 issue 的标题和描述 >> **Submit new issue**

### 描述

```markdown
[原文链接](https://example.com/path/to/your/article/)
```

用原文 URL 替换上文中的 URL，本 action 会在 issue 提交后运行，并将成功或失败消息发到 issue 评论中。

如果脚本执行**失败**，您需要确认问题，解决问题，然后根据前面的步骤发布**新 issue**。 [_常见错误消息_](#常见错误消息) 和 _Actions 的日志_ 将为您提供一些可靠的提示。

### 常见错误消息

- **No parameters were found. Please confirm that the description of the issue has been entered.**
  issue 的描述为空，请根据模板填写内容。
- **There is one file with the same name exists.Please check if the article has been added.**
  在 `markDownFilePath` 文件夹下有一个同名文件。
- **The DOM of the website has been modified, or there is a problem with loading, please confirm.**
  网站的 DOM 结构可能更改，并且脚本需要修改。

---

## 高级用例

### 客户端渲染

本 action 只能处理静态或服务端渲染的网页，对于客户端渲染，我们推荐 https://github.com/TechQuery/Web-fetch#in-github-actions .

---

## 贡献者指南

请转到[贡献者指南](CONTRIBUTING.md)。

---

## 许可证

程序遵循 [BSD-3-Clause](LICENSE) 许可证。
