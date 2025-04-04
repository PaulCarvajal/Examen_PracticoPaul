/**
 * dailymenu service
 */

import { factories } from "@strapi/strapi";

const API_DAILY = "api::dailymenu.dailymenu";

const taxes = 1.21;

export default factories.createCoreService(API_DAILY, () => ({
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

    return total
  },

  includeTaxes: async function (dailymenu) {
    const { Price } = dailymenu;

    const taxe = Price * taxes;
    return taxe.toFixed(2);
  },
}));
