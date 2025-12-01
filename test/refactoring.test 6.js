import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import {HomePage} from '../src/pages/home.page';
import {MainPage} from '../src/pages/main.page';
import {RegisterPage} from '../src/pages/register.page';

const user = {
    email: faker.internet.email({provider: 'qa.guru' }),
    name: faker.person.fullName(), // 'Allen Brown'
    password: faker.internet.password({ length: 10 }),
    method() {}
}

const url = 'https://realworld.qa.guru/';

test('Пользователь может зарегистрироваться используя email и пароль Page Object', async ({ page }) => {
    const {email, name, password} = user;

    const homePage = new HomePage(page);
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    
    await mainPage.open(url);
    await mainPage.gotoRegister();
    await registerPage.register(name, email, password);
    
    
    await expect(homePage.profileName).toContainText(user.name);
    
    await expect(homePage.getProfileNameLocator()).toContainText(user.name);

});