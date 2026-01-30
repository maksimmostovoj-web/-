export class ArticlePage {
  constructor(page) {
    this.page = page;

    // Локаторы
    this.newArticleLink = page.getByRole("link", { name: " New Article" });
    this.articleTitleInput = page.getByRole("textbox", {
      name: "Article Title",
    });
    this.articleAboutInput = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.articleContentInput = page.getByRole("textbox", {
      name: "Write your article (in",
    });
    this.tagsInput = page.getByRole("textbox", { name: "Enter tags" });
    this.publishButton = page.getByRole("button", { name: "Publish Article" });
    this.updateButton = page.getByRole("button", { name: "Update Article" });
    this.editArticleLinks = page.getByRole("link", { name: " Edit Article" });
    this.deleteArticleButtons = page.getByRole("button", {
      name: " Delete Article",
    });
  }

  async createArticle(title, about, content, tags) {
    await this.newArticleLink.click();
    await this.articleTitleInput.fill(title);
    await this.articleAboutInput.fill(about);
    await this.articleContentInput.fill(content);
    await this.tagsInput.fill(tags);
    await this.publishButton.click();
  }

  async editArticle(title, about, articleIndex = 0) {
    await this.editArticleLinks.nth(articleIndex).click();

    if (title) {
      await this.articleTitleInput.fill(title);
    }
    if (about) {
      await this.articleAboutInput.fill(about);
    }

    await this.updateButton.click();
  }

  async deleteArticle(articleIndex = 0) {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        await dialog.accept();
        resolve(dialog.message());
      });
      this.deleteArticleButtons.nth(articleIndex).click();
    });
  }
}
