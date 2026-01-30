import { faker } from "@faker-js/faker";

export class UserBuilder {
  withEmail(email) {
    this.email = email ?? faker.internet.email({ provider: "qa.guru" });
    return this;
  }

  withName(name) {
    this.name = name ?? faker.person.fullName(); // 'Allen Brown'
    return this;
  }
  withPassword(length = 10) {
    this.password = faker.internet.password({ length: length });
    return this;
  }
  build() {
    const result = { ...this };
    return result;
  }
}
