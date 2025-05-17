import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Rabbit } from '../src/models/rabbit';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про рисей
describe('API вебдодатку сайту про рисей', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/rabbits-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "rabbits-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію рисей
    beforeEach(async () => {
        await Rabbit.deleteMany({});
    });

    // Тести для створення запису про нову рись (POST-запит)
    describe('POST /api/rabbits', () => {
        it('має створити запис про нову рись', done => {
            // Тестові дані рисі
            const rabbit = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сіра рись',
            };

            // Виконуємо POST-запит для створення запису про рись
            chai.request(app)
                .post('/api/rabbits')
                .send(rabbit)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', rabbit.name);
                    expect(res.body).to.have.property('age', rabbit.age);
                    expect(res.body).to.have.property('height', rabbit.height);
                    expect(res.body).to.have.property('weight', rabbit.weight);
                    expect(res.body).to.have.property('gender', rabbit.gender);
                    expect(res.body).to.have.property('description', rabbit.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів рисей (GET-запит)
    describe('GET /api/rabbits', () => {
        it('має отримати всіх рисей', async () => {
            // Створюємо тестовий запис рисі
            const testRabbit = new Rabbit({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Біла рись',
            });
            await testRabbit.save();

            // Виконуємо GET-запит для отримання всіх записів рисей
            const res = await chai.request(app).get('/api/rabbits');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Біла рись');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретної рисі за ID (GET-запит)
    describe('GET /api/rabbits/:id', () => {
        it('має отримати конкретну рись за id', async () => {
            // Створюємо запис тестової рисі
            const testRabbit = new Rabbit({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричнева рись',
            });
            const savedRabbit = await testRabbit.save();

            // Виконуємо GET-запит для отримання запису рисі за ID
            const res = await chai.request(app).get(`/api/rabbits/${String(savedRabbit._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричнева рись');
        });

        it('має повернути 404 для неіснуючої рисі', async () => {
            // Виконуємо GET-запит для неіснуючого ID рисі
            const res = await chai.request(app).get('/api/rabbits/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про рись (PUT-запит)
    describe('PUT /api/rabbits/:id', () => {
        it('має повністю оновити запис про рись', async () => {
            // Створюємо тестову рись
            const testRabbit = new Rabbit({
                name: 'Оригінальна',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedRabbit = await testRabbit.save();

            // Дані для оновлення рисі
            const updatedData = {
                name: 'Оновлена',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит для повного оновлення запису про рись
            const res = await chai
                .request(app)
                .put(`/api/rabbits/${String(savedRabbit._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлена');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестову рись
            const testRabbit = new Rabbit({
                name: 'Оригінальна',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedRabbit = await testRabbit.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлена',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/rabbits/${String(savedRabbit._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що рись не змінилася
            const unchangedRabbit = await Rabbit.findById(savedRabbit._id);
            expect(unchangedRabbit).to.have.property('name', 'Оригінальна');
            expect(unchangedRabbit).to.have.property('height', 25);
            expect(unchangedRabbit).to.have.property('weight', 1.8);
        });
    });

    // Тести для часткового оновлення запису про рись (PATCH-запит)
    describe('PATCH /api/rabbits/:id', () => {
        it('має частково оновити запис про рись', async () => {
            // Створюємо тестову рись
            const testRabbit = new Rabbit({
                name: 'Оригінальна',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedRabbit = await testRabbit.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлена',
                age: 3,
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/rabbits/${String(savedRabbit._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлена');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестову рись
            const testRabbit = new Rabbit({
                name: 'Оригінальна',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedRabbit = await testRabbit.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлена',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/rabbits/${String(savedRabbit._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлена');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/rabbits', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/rabbits')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису рисі (DELETE-запит)
    describe('DELETE /api/rabbits/:id', () => {
        it('має видалити запис про рись', async () => {
            // Створюємо тестову рись
            const testRabbit = new Rabbit({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорна рись',
            });
            const savedRabbit = await testRabbit.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/rabbits/${String(savedRabbit._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про рись видалено');

            // Перевіряємо, що запис про рись дійсно видалено з бази
            const findRabbit = await Rabbit.findById(savedRabbit._id);
            expect(findRabbit).to.be.null;
        });
    });
});