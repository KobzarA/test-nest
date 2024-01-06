Для Restowaves

Для отримання данних з гугл таблиць я вирішив використати, нативне гугл апі.
Для цього треба було створити АПІ ключ та додаток в Гугл клауд.

При вирішенні задачі по перевірці чи були зміни в вихідній таблиці не знайшов методів отримання цієї інформації з googleSheet, навіть пробував інші бібліотеки, скачував файл та дивився властивості, але цієї інформації там нажаль не було.

Тому для вирішенні цієї задачі пришлось отримувати всі товари з бази даниї, але поки це писав бачу, що можна це також оптимізувати і отримати лише ті моделі які представленні в завантажені таблиці, так можна зменшити об'єм даних для перевірки якщо гугл таблиця буде не одна, або якщо модель застаріла чи її вже нема в наявності і цей лист моделі видалено з таблиці.

Саме для перевірки я використав цикли та хеш-таблицю та звичайно умови.
Наскільки це можливо намагався зменшити складність перевірки.
Якщо у товару є зміни, то товар з таблиці додав до массиву товари для оновлення. Після цього товар видаляєсться з хеш-таблиці.
В разі якщо товар не завнавав змін він також видається з хеш-таблиці.
Після цього в хеш-таблиці залишаються лише товари яких немає в базі даних, переносю ці дані в масив товари для додавання.

Для роботи з PostgreSQL в цьому проекті використовую такі пакети, @nest/sequelize, sequelize, sequelize-typescript, pg.
Це дозволяє викоритсовувати sequlize згідно правил фреймворку, та додає зручності та типізацію. Особливо подобається використання декораторів, код стає більш читабельним.

Під час парсингу для запису даних використав тразакцію, щоб записувалися або всі дані або нічого. Конкретно в цій ситуації можливо можна було б обійтися і без цього.
Також створий окремий ендпоінт для ручного запуску оновлення.

Для щогодинного оновлення використав пакет nest/schedule, використав CronJob, оновлення автоматично буде відбуватися кожної години в 0 хв.

Спочатку хотів створити декілька моделей(таблиць) з використанням один-до-багатьох, багато-до-багатьох асоціаціями, але щоб сильно не ускладнювати поки виришів залишити одну модель Продукти. Знову ж таки для спрощення розробки та оновлення в базі даних розміри помістив в вбудований тип масив. В залежності від об'єму даних це можна замінити відношенням багато до багатьох з нормалізацією даних, але на мою думку поки в цьому немає необхідності, тим паче це може значно збільшити кількість запитів до бази даних при оновленні.

Для властивостей Продукту "бренд", "категорії", "субкатегорії" в подальшому можна буде використовувати асоціації з окремими таблицями для цих властивостей.

Сторив такі ентдпоінти для робити з продуктами:

- отримати всі - також є можливість отримати перілік товарів декількох категорій, підкатегорій, брендів, розмірів.
- отримати 1 по айді.
- оновити будь-яку властивість товару.
- також є ендпоінти створити та видалити продукти

Для цього проекту також застосовуються валідація та трансформація вхідних даних, змінні оточення, Docker, AWS EC2.

PS. частину закоментованого коду навмистно не прибрав, хочу попрактикуватися з ассоціаціями та оновленням данних.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
