"use strict";
//import {auxiliar_function} from '../../../../functionCreateUpdate.ts';  // Omite la extensión `.ts`
Object.defineProperty(exports, "__esModule", { value: true });
const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";
const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;
module.exports = {
    async afterUpdate(event) {
        var _a;
        const { params, result } = event;
        if ((_a = event.state) === null || _a === void 0 ? void 0 : _a.isCalculatedUpdate)
            return;
        if (event.params.data && event.params.data.publishedAt) {
            console.warn("Publish action detected, skipping calculated update in afterUpdate.");
            return;
        }
        console.log("PARAMS ");
        console.log(event);
        const daily = await strapi.documents(API_DAILY).findOne({
            documentId: result.documentId,
            populate: {
                first: true,
                second: true,
                dessert: true,
            },
        });
        if (!daily.first || !daily.second || !daily.dessert) {
            console.warn("Missing dish information in menu, skipping calculated update.");
            return;
        }
        const { SumPrecio, documentId, PriceWithTaxes } = daily;
        const sumPrice = await strapi.service(API_DAILY).priceDailyMenu(daily);
        console.log("Después de update de TotalPriceDishes");
        const currentPrice = SumPrecio !== null && SumPrecio !== void 0 ? SumPrecio : 0;
        const calculatedPrice = sumPrice !== null && sumPrice !== void 0 ? sumPrice : 0;
        console.log("NO PUEDO MAS");
        console.log(currentPrice);
        console.log(calculatedPrice);
        if (currentPrice.toFixed(2) !== calculatedPrice.toFixed(2)) {
            try {
                await strapi.documents(API_DAILY).update({
                    documentId,
                    data: { SumPrecio: sumPrice },
                    state: { isCalculatedUpdate: true },
                });
                console.log("Actualización de TotalPriceDishes completada (afterUpdate)");
            }
            catch (error) {
                console.error("Error updating TotalPriceDishes:", error);
            }
        }
        const price_with_taxes = await strapi.service(API_DAILY).includeTaxes(daily);
        const currentTaxes = typeof PriceWithTaxes === "number" ? PriceWithTaxes : parseFloat(PriceWithTaxes) || 0;
        const calculatedTaxes = typeof price_with_taxes === "number" ? price_with_taxes : parseFloat(price_with_taxes) || 0;
        if (currentTaxes.toFixed(2) !== calculatedTaxes.toFixed(2)) {
            try {
                await strapi.documents(API_DAILY).update({
                    documentId,
                    data: { PriceWithTaxes: price_with_taxes },
                    state: { isCalculatedUpdate: true },
                });
                console.log("Actualización de PriceTaxes completada (afterUpdate)");
            }
            catch (error) {
                console.error("Error updating PriceTaxes:", error);
            }
        }
    },
    async beforeCreate(event) {
        const { params } = event;
        //console.log("event", event);
        //console.log("params", params);
        const validateType = await strapi.service(API_DAILY).validateType(params);
        //console.log("validateType", validateType);
        if (!validateType) {
            throw new ApplicationError("This plate is not in the correct type");
        }
    },
    async beforeUpdate(event) {
        const { params } = event;
        const validateType = await strapi.service(API_DAILY).validateType(params);
        if (!validateType) {
            throw new ApplicationError("This plate is not in the correct type");
        }
    },
    async afterCreate(event) {
        var _a;
        const { params, result } = event;
        if ((_a = event.state) === null || _a === void 0 ? void 0 : _a.isCalculatedUpdate)
            return;
        if (event.params.data && event.params.data.publishedAt) {
            console.warn("Publish action detected, skipping calculated update in afterUpdate.");
            return;
        }
        console.log("PARAMS ");
        console.log(event);
        const daily = await strapi.documents(API_DAILY).findOne({
            documentId: result.documentId,
            populate: {
                first: true,
                second: true,
                dessert: true,
            },
        });
        if (!daily.first || !daily.second || !daily.dessert) {
            console.warn("Missing dish information in menu, skipping calculated update.");
            return;
        }
        const { SumPrecio, documentId, PriceWithTaxes } = daily;
        const sumPrice = await strapi.service(API_DAILY).priceDailyMenu(daily);
        console.log("Después de update de TotalPriceDishes");
        const currentPrice = SumPrecio !== null && SumPrecio !== void 0 ? SumPrecio : 0;
        const calculatedPrice = sumPrice !== null && sumPrice !== void 0 ? sumPrice : 0;
        console.log("NO PUEDO MAS");
        console.log(currentPrice);
        console.log(calculatedPrice);
        if (currentPrice.toFixed(2) !== calculatedPrice.toFixed(2)) {
            try {
                await strapi.documents(API_DAILY).update({
                    documentId,
                    data: { SumPrecio: sumPrice },
                    state: { isCalculatedUpdate: true },
                });
                console.log("Actualización de TotalPriceDishes completada (afterUpdate)");
            }
            catch (error) {
                console.error("Error updating TotalPriceDishes:", error);
            }
        }
        const price_with_taxes = await strapi.service(API_DAILY).includeTaxes(daily);
        const currentTaxes = typeof PriceWithTaxes === "number" ? PriceWithTaxes : parseFloat(PriceWithTaxes) || 0;
        const calculatedTaxes = typeof price_with_taxes === "number" ? price_with_taxes : parseFloat(price_with_taxes) || 0;
        if (currentTaxes.toFixed(2) !== calculatedTaxes.toFixed(2)) {
            try {
                await strapi.documents(API_DAILY).update({
                    documentId,
                    data: { PriceWithTaxes: price_with_taxes },
                    state: { isCalculatedUpdate: true },
                });
                console.log("Actualización de PriceTaxes completada (afterUpdate)");
            }
            catch (error) {
                console.error("Error updating PriceTaxes:", error);
            }
        }
    }
};
