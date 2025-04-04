"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/dailymenu/:nameAllergen",
            handler: "dailymenu.excludeAllergens",
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/dailymenu/",
            handler: "dailymenu.mostPopular",
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
