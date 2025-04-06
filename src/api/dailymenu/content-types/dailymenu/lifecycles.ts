
const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";

const { errors } = require("@strapi/utils");
const { ApplicationError } = errors;
module.exports = {
  async afterUpdate(event) {
    const { params, result } = event;
    if (event.state?.isCalculatedUpdate) return;

    if (event.params.data && event.params.data.publishedAt) {
      return;
    }
    const daily = await strapi.documents(API_DAILY).findOne({
      documentId: result.documentId,
      populate: {
        first: true,
        second: true,
        dessert: true,
      },
    });
    
    if (!daily.first || !daily.second || !daily.dessert) {
      console.warn(
        "Missing dish information in menu, skipping calculated update."
      );
      return;
    }

    const { SumPrecio, documentId, PriceWithTaxes } = daily;
    const sumPrice = await strapi.service(API_DAILY).priceDailyMenu(daily);

    const currentPrice = SumPrecio ?? 0;
    const calculatedPrice = sumPrice ?? 0;

    if (currentPrice.toFixed(2) !== calculatedPrice.toFixed(2)) {
      try {
        await strapi.documents(API_DAILY).update({
          documentId,
          data: { SumPrecio: sumPrice },
          state: { isCalculatedUpdate: true },
        });
      } catch (error) {console.error("Error updating TotalPriceDishes:", error);
      }
    }

    const price_with_taxes = await strapi.service(API_DAILY).includeTaxes(daily);
    const currentTaxes = typeof PriceWithTaxes === "number" ? PriceWithTaxes : parseFloat(PriceWithTaxes) || 0;
    const calculatedTaxes = typeof price_with_taxes === "number" ? price_with_taxes: parseFloat(price_with_taxes) || 0;

    if (currentTaxes.toFixed(2) !== calculatedTaxes.toFixed(2)) {
      try {
        await strapi.documents(API_DAILY).update({
          documentId,
          data: { PriceWithTaxes: price_with_taxes },
          state: { isCalculatedUpdate: true },
        });
      } catch (error) {
      }
    }


  },
  async beforeCreate(event) {
    const { params } = event;
    const validateType = await strapi.service(API_DAILY).validateType(params);
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
  async afterCreate(event){
    const { params, result } = event;
    if (event.state?.isCalculatedUpdate) return;

    if (event.params.data && event.params.data.publishedAt) {
      return;
    }
    const daily = await strapi.documents(API_DAILY).findOne({
      documentId: result.documentId,
      populate: {
        first: true,
        second: true,
        dessert: true,
      },
    });
    
    if (!daily.first || !daily.second || !daily.dessert) {
      return;
    }

    const { SumPrecio, documentId, PriceWithTaxes } = daily;
    const sumPrice = await strapi.service(API_DAILY).priceDailyMenu(daily);

    const currentPrice = SumPrecio ?? 0;
    const calculatedPrice = sumPrice ?? 0;
    
    if (currentPrice.toFixed(2) !== calculatedPrice.toFixed(2)) {
      try {
        await strapi.documents(API_DAILY).update({
          documentId,
          data: { SumPrecio: sumPrice },
          state: { isCalculatedUpdate: true },
        });

      } catch (error) {console.error("Error updating TotalPriceDishes:", error);
      }
    }

    const price_with_taxes = await strapi.service(API_DAILY).includeTaxes(daily);
    const currentTaxes = typeof PriceWithTaxes === "number" ? PriceWithTaxes : parseFloat(PriceWithTaxes) || 0;
    const calculatedTaxes = typeof price_with_taxes === "number" ? price_with_taxes: parseFloat(price_with_taxes) || 0;

    if (currentTaxes.toFixed(2) !== calculatedTaxes.toFixed(2)) {
      try {
        await strapi.documents(API_DAILY).update({
          documentId,
          data: { PriceWithTaxes: price_with_taxes },
          state: { isCalculatedUpdate: true },
        });
      } catch (error) {
      }
    }
  }
};
