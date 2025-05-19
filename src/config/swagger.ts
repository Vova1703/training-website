// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Рисей',
        version: '1.0.0',
        description: 'Документація API для Сайту про Рисей',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/rabbits': {
            // GET запит для отримання всіх рисей
            get: {
                summary: 'Отримати всіх рисей',
                responses: {
                    '200': {
                        description: 'Список всіх рисей',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Rabbit' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нової рисі
            post: {
                summary: 'Створити нову рись',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rabbit' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт рисі",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретної рисі за ID
        '/api/rabbits/{id}': {
            // GET запит для отримання рисі за ID
            get: {
                summary: 'Отримати рись за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID рисі',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт рисі",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Рись не знайдено' },
                },
            },

            // PUT запит для повного оновлення рисі за ID
            put: {
                summary: 'Повністю оновити рись',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID рисі',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rabbit' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт рисі",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Рись не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення рисі за ID
            patch: {
                summary: 'Частково оновити рись',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID рисі',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rabbit' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт рисі",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Рись не знайдено' },
                },
            },
            // DELETE запит для видалення даних про рись за ID
            delete: {
                summary: 'Видалити дані про рись',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID рисі',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Рись не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Рись
            Rabbit: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я рисі",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік рисі у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота рисі в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага рисі в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать рисі',
                    },
                    description: {
                        type: 'string',
                        description: "Опис рисі (необов'язкове поле)",
                    },
                },
            },
        },
    },
};
