// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Зайців',
        version: '1.0.0',
        description: 'Документація API для Сайту про Зайців',
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
            // GET запит для отримання всіх зайців
            get: {
                summary: 'Отримати всіх зайців',
                responses: {
                    '200': {
                        description: 'Список всіх зайців',
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

            // POST запит для створення нового зайця
            post: {
                summary: 'Створити нового зайця',
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
                        description: "Створений об'єкт зайця",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного зайця за ID
        '/api/rabbits/{id}': {
            // GET запит для отримання зайця за ID
            get: {
                summary: 'Отримати зайця за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зайця',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт зайця",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Зайця не знайдено' },
                },
            },

            // PUT запит для повного оновлення зайця за ID
            put: {
                summary: 'Повністю оновити зайця',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зайця',
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
                        description: "Оновлений об'єкт зайця",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Зайця не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення зайця за ID
            patch: {
                summary: 'Частково оновити зайця',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зайця',
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
                        description: "Оновлений об'єкт зайця",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rabbit' },
                            },
                        },
                    },
                    '404': { description: 'Зайця не знайдено' },
                },
            },
            // DELETE запит для видалення даних про зайця за ID
            delete: {
                summary: 'Видалити дані про зайця',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зайця',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Зайця не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Заєць
            Rabbit: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я зайця",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік зайця у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота зайця в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага зайця в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать зайця',
                    },
                    description: {
                        type: 'string',
                        description: "Опис зайця (необов'язкове поле)",
                    },
                },
            },
        },
    },
};
