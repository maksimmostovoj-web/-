export class MainPage {
  constructor(page) {
    this.page = page;
    this.signupLink = page
      .getByRole("link", { name: "Sign up" })
      .describe("Кнопка зарегистрироваться");
  }
  async gotoRegister() {
    this.signupLink.click();
  }
  async open(url) {
    await this.page.goto(url);
  }
}
