"use strict";
/**
 * dailymenu service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";
const taxes = 1.21;
exports.default = strapi_1.factories.createCoreService(API_DAILY, () => ({
    priceDailyMenu: async function (dailymenu) {
        const { first, second, dessert } = dailymenu;
        //console.log(first)
        let total = 0;
        if (first != null) {
            total = total + first.Price;
        }
        if (second != null) {
            total = total + second.Price;
        }
        if (dessert != null) {
            total = total + dessert.Price;
        }
        return total;
    },
    includeTaxes: async function (dailymenu) {
        const { Price } = dailymenu;
        const taxe = Price * taxes;
        return taxe.toFixed(2);
    },
    async validateType(params) {
        const checkPlateType = async (plateData, expectedType) => {
            if (plateData &&
                Array.isArray(plateData.connect) &&
                plateData.connect.length > 0) {
                const plate = await strapi.db.query(API_DISH).findOne({
                    where: { id: plateData.connect.map((item) => item.id) },
                });
                return plate.Type === expectedType;
            }
            return true;
        };
        const isValidFirst = await checkPlateType(params.data.first, "First");
        if (!isValidFirst)
            return false;
        const isValidSecond = await checkPlateType(params.data.second, "Second");
        if (!isValidSecond)
            return false;
        const isValidDessert = await checkPlateType(params.data.dessert, "Dessert");
        if (!isValidDessert) {
            return false;
        }
        else {
            return true;
        }
    }
}));
