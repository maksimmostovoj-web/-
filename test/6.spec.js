import { test, expect } from "@playwright/test";
//import * as allure from "allure-js-commons";
//import { App } from '../src/pages/app.page';
//import { UserBuilder } from '../src/helpers/builders/index';

const url = "https://realworld.qa.guru/";

test("Пользователь создает новую статью", async ({ page }) => {
  const mainPage = new MainPage(page);
  const homePage = new HomePage(page);
  const articlePage = new ArticlePage(page);
  const registerPage = new RegisterPage(page);
  
  const { name, email, password } = user;

  // Регистрация
  await mainPage.open(url);
  await mainPage.gotoRegister();
  await registerPage.register(name, email, password);
  await expect(homePage.profileName).toBeVisible();

  // Создаем статью
  await articlePage.createArticle("test", "test2", "test3", "ghjd");
  
  // Ассерты в тесте
  await expect(articlePage.editArticleLinks.first()).toBeVisible();
});