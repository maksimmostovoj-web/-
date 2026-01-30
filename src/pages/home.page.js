export class HomePage {
  constructor(page) {
    this.page = page;
    this.profileName = page.locator(".dropdown-toggle");
    this.profileLink = page.getByRole("link", { name: " Profile" });
    this.settingsLink = page.getByRole("link", { name: " Settings" });
    this.logoutButton = page.getByRole("button", {
      name: "Or click here to logout.",
    });
  }

  async goToSettings() {
    await this.profileName.click();
    await this.settingsLink.click();
  }

  async goToProfile() {
    await this.profileName.click();
    await this.profileLink.click();
  }

  async logout() {
    await this.profileName.click();
    await this.profileLink.click();
    await this.logoutButton.click();
  }
}
