"use strict";
/**
 * dailymenu controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";
exports.default = strapi_1.factories.createCoreController(API_DAILY, () => ({
    async excludeAllergens(ctx) {
        const { nameAllergen } = ctx.params;
        const namesArray = nameAllergen.split(",").map((name) => name.trim());
        console.log("NAME ALLERGEN");
        console.log(nameAllergen);
        const dailyMenus = await strapi.documents(API_DAILY).findMany({
            populate: {
                first: {
                    populate: {
                        Allergen: true, // Esto incluye la relación, pero no filtra por nombre
                    },
                },
                second: {
                    populate: {
                        Allergen: true,
                    },
                },
                dessert: {
                    populate: {
                        Allergen: true,
                    },
                },
            },
        });
        const functionAllergen = (dish) => {
            if (!dish || !dish.Allergen || dish.Allergen.length === 0) {
                return false; // Si el plato no tiene alérgenos, lo consideramos seguro
            }
            for (let allergen of dish.Allergen) {
                if (namesArray.includes(allergen.Name)) {
                    return true;
                }
            }
            return false;
        };
        const filteredMenus = dailyMenus.filter((menu) => {
            return (!functionAllergen(menu.first) &&
                !functionAllergen(menu.second) &&
                !functionAllergen(menu.dessert));
        });
        return ctx.send(filteredMenus);
    },
    async mostPopular(ctx) {
        const dailyMenus = await strapi.documents(API_DAILY).findMany({
            populate: {
                first: true,
                second: true,
                dessert: true,
            },
        });
        const countMap = new Map();
        for (let menu of dailyMenus) {
            if (countMap.has(menu.first.Name)) {
                //si la clave existe
                countMap.set(menu.first.Name, countMap.get(menu.first.Name) + 1);
            }
            else {
                countMap.set(menu.first.Name, 1);
            }
            if (countMap.has(menu.second.Name)) {
                //si la clave existe
                countMap.set(menu.second.Name, countMap.get(menu.second.Name) + 1);
            }
            else {
                countMap.set(menu.second.Name, 1);
            }
            if (countMap.has(menu.dessert.Name)) {
                //si la clave existe
                countMap.set(menu.dessert.Name, countMap.get(menu.dessert.Name) + 1);
            }
            else {
                countMap.set(menu.dessert.Name, 1);
            }
        }
        const dishes = await strapi.documents(API_DISH).findMany({});
        const sortedDishes = [...countMap.entries()]
            .sort((a, b) => b[1] - a[1]) // Ordenar de mayor a menor por la cantidad de repeticiones
            .map(([name]) => {
            // Buscar el plato real en dishesFromStrapi por el nombre
            return dishes.find((dish) => dish.Name === name);
        });
        return ctx.send(sortedDishes);
        /*
        const countDish = (dish, menu) => {
            for (let allergen of dish.Allergen) {
                if(countMap.has(dish)){//si la clave existe
                    countMap.set(dish, countMap.get(dish)! + 1)
                } else{
                    countMap.set(dish, 1)
                }
            }
            return menu;
          };
          */
        console.log(countMap);
    },
}));
