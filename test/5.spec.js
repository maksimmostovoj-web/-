import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HomePage } from "../src/pages/home.page";
import { MainPage } from "../src/pages/main.page";
import { RegisterPage } from "../src/pages/register.page";
import { SettingsPage } from "../src/pages/settings.page";
import { ArticlePage } from "../src/pages/article.page";

// Переменные
const user = {
  email: faker.internet.email({ provider: "qa.guru" }),
  name: faker.person.fullName(),
  password: faker.internet.password({ length: 10 }),
  NewVersionName: faker.person.fullName(),
};
const createArticle = () => ({
  title: faker.lorem.words(3),
  about: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  tags: faker.lorem.word(),
  updatedTitle: faker.lorem.words(4),
  updatedAbout: faker.lorem.sentence(),
});

const url = "https://realworld.qa.guru/";

test("Пользователь может зарегистрироваться используя email и пароль Page Object", async ({
  page,
}) => {
  const { email, name, password } = user;
  const homePage = new HomePage(page);
  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);
  await expect(homePage.profileName).toContainText(user.name);
});

test("Пользователь может изменить свое имя в профиле", async ({ page }) => {
  const { email, name, password, NewVersionName } = user;
  const homePage = new HomePage(page);
  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);
  const settingsPage = new SettingsPage(page);

  // Шаг 1: Регистрация
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);

  // Проверка регистрации
  await expect(homePage.profileName).toContainText(name);

  // Шаг 2: Переход в настройки и изменение имени
  await homePage.goToSettings();
  await settingsPage.updateName(NewVersionName);

  // Ожидание обновления данных после сохранения
  await page.waitForLoadState("networkidle");

  // Шаг 3: Проверка изменения имени в навигации
  await expect(homePage.profileName).toContainText(NewVersionName);

  // Шаг 4: Переход на свой профиль через навигацию
  await homePage.profileName.click();
  // Используем локатор из snapshot для перехода на профиль
  await page.getByRole("link", { name: " Profile" }).click();

  // Шаг 5: Проверка изменения имени на странице профиля
  await expect(
    page.getByRole("heading", { name: NewVersionName }),
  ).toBeVisible();
});

test ("Пользователь создает новую статью", async ({ page }) => {
  const { email, name, password, NewVersionName } = user;
  const article = createArticle(); // <-- ВЫЗВАТЬ ФУНКЦИЮ
  const { title, about, content, tags } = article;

  const homePage = new HomePage(page);
  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);
  const articlePage = new ArticlePage(page);

  // Регистрация
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);

  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания статьи
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  // Шаг 3: Проверка статьи в профиле
  await homePage.goToProfile();

  // Ищем ссылку на статью на странице профиля
  await expect(
    page.getByRole("link", {
      name: new RegExp(`${title}.*${about}.*Read more`, "i"),
    }),
  ).toBeVisible();
});

test ("Пользователь редактирует статью", async ({ page }) => {
  const { email, name, password, NewVersionName } = user;
  const article = createArticle(); // <-- ВЫЗВАТЬ ФУНКЦИЮ
  const { title, about, content, tags, updatedTitle, updatedAbout } = article;

  const homePage = new HomePage(page);
  const mainPage = new MainPage(page);
  const registerPage = new RegisterPage(page);
  const articlePage = new ArticlePage(page);

  // Регистрация
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);

  // Шаг 2: Создание статьи
  await articlePage.createArticle(title, about, content, tags);

  // Проверка создания
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  // Шаг 3: Переход на страницу статьи через профиль
  await homePage.goToProfile();
  await page
    .getByRole("link", {
      name: new RegExp(`${title}.*${about}.*Read more`, "i"),
    })
    .first()
    .click();

  // Шаг 4: Редактирование статьи (первой в списке)
  await articlePage.editArticle(updatedTitle, updatedAbout, 0);

  // Проверка обновления статьи
  await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();

  // Шаг 5: Проверка в профиле
  await homePage.goToProfile();

  await expect(
    page.getByRole("link", {
      name: new RegExp(`${updatedTitle}.*${updatedAbout}.*Read more`, "i"),
    }),
  ).toBeVisible();
});
