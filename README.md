# Article Web-page to Markdown action

![GitHub](https://img.shields.io/github/license/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/freeCodeCamp-China/article-webpage-to-markdown-action)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/freeCodeCamp-China/article-webpage-to-markdown-action?include_prereleases&label=release-last)

Language: English | [简体中文](./README-zh-cn.md)

## Introduction

Automatically generate Markdown files based on the Web-pages of articles.

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
   |-utilities.test.ts  // test file
```

### Usage

Add the following step in the `jobs` field of your GitHub action configuration:

```yml
- uses: freeCodeCamp-China/article-webpage-to-markdown-action@v2
  with:
    pageURL: '${{ github.event.issue.Body }}'
    markdownFolder: './articles/'
    githubToken: ${{ github.token }}
```

The following is an extended example with all possible options & outputs available for this Action:

```yml
name: fetch Web pages
on:
  issues:
    types:
      - labeled
jobs:
  fetch-pages:
    if: github.event.label.name == 'Article'
    runs-on: ubuntu-latest
    permissions:
      issues: write
    steps:
      - id: fetch-md
        uses: freeCodeCamp-China/article-webpage-to-markdown-action@v2
        with:
          # A string contains an Original Article URL
          pageURL: '${{ github.event.issue.Body }}'
          # CSS selector of elements which should be ignored
          ignoreSelector: '.ad-wrapper'
          # Path of the generated MarkDown file
          # Relative path relative to current working directory
          markdownFolder: './articles/'
          githubToken: ${{ github.token }}

      - name: comment Outputs
        run: gh issue comment "$NUMBER" --body "$BODY"
        env:
          GH_TOKEN: ${{ github.token }}
          GH_REPO: ${{ github.repository }}
          NUMBER: ${{ github.event.issue.number }}
          BODY: >
            - Original URL: [${{ steps.fetch-md.outputs.title }}](${{ steps.fetch-md.outputs.path }})
            - Original author: [${{ steps.fetch-md.outputs.author || 'anonymous' }}](${{ steps.fetch-md.outputs.authorURL }})
            - Markdown file: [click to edit](${{ steps.fetch-md.outputs.editor_url }})
```

If you do not configure the option `markdownFolder`, the file is generated in the current path by default.

### Run the script by the issue of GitHub

**Issues** >> **New issue** >> Fill in the title and description of the issue >> **Submit new issue**

### Description

```markdown
[Original article](https://example.com/path/to/your/article/)
```

Replace the Link Value with the URL of an Original article, after the issue submitted, the action will run, and a success or failed message will be commented to the issue in the end.

If the script execution **fails**, you need to confirm the problem, solve them, and post a **new issue** according to the previous steps. In the **Action log**, The [_Common Error Messages_](#Common-Error-Messages) will give you some reliable tips.

### Common Error Messages

- **No parameters were found. Please confirm that the description of the issue has been entered.**
  The description of the issue is empty, please fill in the content according to the template.
- **There is one file with the same name exists. Please check if the article has been added.**
  There is a file with the same name under the folder `markdownFolder`.
- **The DOM of the website has been modified, or there is a problem with loading, please confirm.**
  The DOM structure of the website may be changed and the script needs to be modified.

---

## Advanced cases

### Client-side rendering

This action can only handle Static or Server-side rendered pages, for Client-side rendered pages, we recommend https://github.com/TechQuery/Web-fetch#in-github-actions .

---

## Contributing guide

Please go to the [contributing guide](CONTRIBUTING.md).

---

## License

The computer software is licensed under the [BSD-3-Clause](LICENSE) license.
