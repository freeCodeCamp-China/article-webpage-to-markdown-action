const {
  Err_DontGetNewsLink,
  Err_DontGetTrueRoute,
  Err_SameNameFile,
  Err_NoPath,
  Err_DOMWrong,
  options
} = require("../toMarkdownConstant.js");
const {
  gatherInputs,
  inputExistCheck,
  getRouteAddr,
  haveRouterAddrmd,
  HTMLtoMarkdown
} = require("../utilities.js");

// Take an object of key/value pairs and convert it to input environment variables
function buildInput(inputs) {
  let key = "";
  for(key in inputs) {
    process.env[`INPUT_${key.replace(/ /g, '_').toUpperCase()}`] = inputs[key];
  }
}

  // Reset modules and remove input environment variables before each run
  beforeEach(() => {
    jest.resetModules();
    delete process.env.INPUT_NEWSLINK;
    delete process.env.INPUT_markDownFilePath;
  });

describe("1. test gather all conditioned inputs.", () => {
  test("1-1. gather minimal inputs.", () => {
    expect(gatherInputs()).toEqual({
      newsLink: undefined,
      markDownFilePath: "./"
    });
  });

  test("1-2. With parameters.", () => {
    buildInput({
      newsLink: "test.XXXXXXXXXxxxxxxXXXXXXXxxxxx",
      markDownFilePath: "./src/test/"
    });

    expect(gatherInputs()).toEqual({
      newsLink: "test.XXXXXXXXXxxxxxxXXXXXXXxxxxx",
      markDownFilePath: "./src/test/"
    });
  });
});

describe("2. test existence check of input parameters.)", () => {
  test("2-1. exist.", () => {
    return inputExistCheck({
      newsLink: "test.XXXXXXXXXxxxxxxXXXXXXXxxxxx",
      markDownFilePath: "./"
    }).then((data) => {
      expect(data).toBe("test.XXXXXXXXXxxxxxxXXXXXXXxxxxx");
    });
  });

  test("2-2. does not exist.", () => {
    return inputExistCheck({
      newsLink: undefined,
      markDownFilePath: "./"
    }).catch((err) => {
      expect(err).toBe(Err_DontGetNewsLink);
    });
  });
});

describe("3. test getRouteAddr(Check the input parameters, and get the routing address of the article.)", () => {
  test("3-1. there is the correct URL in the parameter.", () => {
    return getRouteAddr("- 原文网址：[Test Example](https://www.freecodecamp.org/news/testexample/)").then((data) => {
      expect(data).toBe("testexample");
    });
  });

  describe("3-2. Wrong URL test", () => {
    test("3-2-1. Without the last forward slash", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](https://www.freecodecamp.org/news/testexample)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-2. http", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](http://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-3. No htts", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-4. No www", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](https://freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-5. No news", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](https://www.freecodecamp.org/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-6. No Route", ()=>{
      return getRouteAddr("- 原文网址：[Test Example](https://www.freecodecamp.org/news/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-8. Without '- 原文网址：'", ()=>{
      return getRouteAddr("[Test Example](https://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-8. With '\\n'", ()=>{
      return getRouteAddr("- 原文网址：[Test\nExample](https://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-8. With '\\f'", ()=>{
      return getRouteAddr("- 原文网址：[Test\fExample](https://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-8. With '\\r'", ()=>{
      return getRouteAddr("- 原文网址：[Test\rExample](https://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });

    test("3-2-8. With '\\t'", ()=>{
      return getRouteAddr("- 原文网址：[Test\tExample](https://www.freecodecamp.org/news/testexample/)").catch((err) => {
        expect(err).toBe(Err_DontGetTrueRoute);
      });
    });
  });
});

describe("4. test haveRouterAddrmd(Check if the ${routerAddr}.md exists.If it exists, an error is reported.)", () => {
  test("4-1. This article does not exist", () => {
    return haveRouterAddrmd("testexample").then((data) => {
      expect(data).toBe("testexample.md");
    });
  });

  test("4-2. This article exists ", () => {
    return haveRouterAddrmd("20-lines-of-python-code-get-notified-by-sms-when-your-favorite-team-scores-a-goal").catch((err) => {
      expect(err).toBe(Err_SameNameFile);
    });
  });
});

describe("5. test HTMLtoMarkdown(Write content to file).", () => {
  describe("5-1. Normal case ",() => {
    test("5-1-1. <img src='/postFullImageURL'>", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <h1>h1</h1>
                    <h2>h2</h2>
                    <h3>h3</h3>
                    <h4>h4</h4>
                    <h5>h5</h5>
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp<a href="link">Link</a></p>
                    <ol>
                      <li>ol one</li>
                      <li>ol two</li>
                      <li>ol three</li>
                    </ol>
                    <ol>
                      <li><a href="#1_a">ol one a</a></li>
                      <li><a href="#2_a">ol two a</a></li>
                      <li><a href="#3_a">ol three a</a></li>
                    </ol>
                    <ul>
                      <li>ul one</li>
                      <li>ul two</li>
                      <li>ul three</li>
                    </ul>
                    <img src="https://www.freecodecamp.org/img.jpeg" alt="img" />
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).then((data) => {
        expect(data).toBe(
`> -  原文地址：[testexample post-full-title](https://www.freecodecamp.org/news/testexample/)
> -  原文作者：[authorName](https://www.freecodecamp.org/news/author/authorURL/)
> -  译者：
> -  校对者：

![postFullImage](https://www.freecodecamp.org/postFullImageURL)

# h1

## h2

### h3

#### h4

##### h5

ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp[Link](link)

1.  ol one
2.  ol two
3.  ol three

1.  [ol one a](#1_a)
2.  [ol two a](#2_a)
3.  [ol three a](#3_a)

-   ul one
-   ul two
-   ul three

![img](https://www.freecodecamp.org/img.jpeg)`);
      });
    });

    test("5-1-2. <img src='https://www.freecodecamp.org/postFullImageURL'>", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="https://www.freecodecamp.org/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).then((data) => {
        expect(data).toBe(
`> -  原文地址：[testexample post-full-title](https://www.freecodecamp.org/news/testexample/)
> -  原文作者：[authorName](https://www.freecodecamp.org/news/author/authorURL/)
> -  译者：
> -  校对者：

![postFullImage](https://www.freecodecamp.org/postFullImageURL)`);
      });
    });

    test("5-1-3. <img src='http://www.freecodecamp.org/postFullImageURL'>", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="http://www.freecodecamp.org/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).then((data) => {
        expect(data).toBe(
`> -  原文地址：[testexample post-full-title](https://www.freecodecamp.org/news/testexample/)
> -  原文作者：[authorName](https://www.freecodecamp.org/news/author/authorURL/)
> -  译者：
> -  校对者：

![postFullImage](http://www.freecodecamp.org/postFullImageURL)`);
      });
    });
  });

  describe("5-2. Abnormal case", () => {
    test("5-2-1. No articleTitle", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title"></h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-2. No articleTitle", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-3. No articleURL", () => {
      options.path = "";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_NoPath);
      });
    });

    test("5-2-4. No authorName", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/"></a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-5. No authorName", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name">authorName</h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-6. No authorName", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-7. No authorName", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-8. No authorURL", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  </picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  <picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-9. No authorURL", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name">authorName</h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-10. No authorURL", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture>
                    <img src="/postFullImageURL" alt="postFullImage" />
                  </picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                    <p>ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp</p>
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a>authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-11. Error in fullImage(<img src='' alt='postFullImage' />).", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>System Design Interview Questions – Concepts You Should Know</title>
        </head>
        <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
          <div class="site-wrapper">
            <main id="site-main" class="site-main outer">
              <div class="inner">
                <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                  <header class="post-full-header">
                    <h1 class="post-full-title">testexample post-full-title</h1>
                  </header>
                  <figure class="post-full-image">
                    <picture>
                      <img src="" alt="postFullImage" />
                    </picture>
                  </figure>
                  <section class="post-full-content">
                    <div class="post-content">
                    </div>
                    <hr />
                    <div class="post-full-author-header">
                      <section class="author-card">
                        <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                        <section class="author-card-content author-card-content-no-bio">
                          <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                        </section>
                      </section>
                    </div>
                    <hr />
                  </section>
                </article>
              </div>
            </main>
          </div>
        </body>
      </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-12. Error in fullImage(<img alt='postFullImage' />).", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <title>System Design Interview Questions – Concepts You Should Know</title>
        </head>
        <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
          <div class="site-wrapper">
            <main id="site-main" class="site-main outer">
              <div class="inner">
                <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                  <header class="post-full-header">
                    <h1 class="post-full-title">testexample post-full-title</h1>
                  </header>
                  <figure class="post-full-image">
                    <picture>
                      <img alt="postFullImage" />
                    </picture>
                  </figure>
                  <section class="post-full-content">
                    <div class="post-content">
                    </div>
                    <hr />
                    <div class="post-full-author-header">
                      <section class="author-card">
                        <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                        <section class="author-card-content author-card-content-no-bio">
                          <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                        </section>
                      </section>
                    </div>
                    <hr />
                  </section>
                </article>
              </div>
            </main>
          </div>
        </body>
      </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });

    test("5-2-13. No postFullImage.", () => {
      options.path = "/news/testexample/";
      return HTMLtoMarkdown(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>System Design Interview Questions – Concepts You Should Know</title>
      </head>
      <body class="post-template tag-interviews tag-systems-engineering tag-coding-interview">
        <div class="site-wrapper">
          <main id="site-main" class="site-main outer">
            <div class="inner">
              <article class="post-full post tag-interviews tag-systems-engineering tag-coding-interview ">
                <header class="post-full-header">
                  <h1 class="post-full-title">testexample post-full-title</h1>
                </header>
                <figure class="post-full-image">
                  <picture></picture>
                </figure>
                <section class="post-full-content">
                  <div class="post-content">
                  </div>
                  <hr />
                  <div class="post-full-author-header">
                    <section class="author-card">
                      <img class="author-profile-image" src="/news/content/images/size/w100/2019/06/WhatsApp-Image-2018-03-22-at-13.36.56.jpeg" alt="Zubin Pratap" />
                      <section class="author-card-content author-card-content-no-bio">
                        <h4 class="author-card-name"><a href="/news/author/authorURL/">authorName</a></h4>
                      </section>
                    </section>
                  </div>
                  <hr />
                </section>
              </article>
            </div>
          </main>
        </div>
      </body>
    </html>`).catch((err) => {
        expect(err).toBe(Err_DOMWrong);
      });
    });
  });

  // test("4-2. This article exists ", () => {
  //   return haveRouterAddrmd("20-lines-of-python-code-get-notified-by-sms-when-your-favorite-team-scores-a-goal").catch((err) => {
  //     expect(err).toBe(Err_SameNameFile);
  //   });
  // });
});
