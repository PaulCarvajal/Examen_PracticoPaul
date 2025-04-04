//import {auxiliar_function} from '../../../../functionCreateUpdate.ts';  // Omite la extensión `.ts`

import { addAbortListener } from "events";
import { before, beforeEach } from "node:test";

const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";

module.exports = {
  async afterUpdate(event) {
    const { params, result } = event;

    //console.log("PARAMS ");
    //console.log(event);

    const daily = await strapi.documents(API_DAILY).findOne({
      documentId: result.documentId,
      populate: {
        first: true,
        second: true,
        dessert: true,
      },
    });

    const { SumPrecio, documentId, PriceWithTaxes} = daily;

    const total = await strapi.service(API_DAILY).priceDailyMenu(daily);
    //console.log("PRECIO TOTAL");
    //console.log(total);

    if (SumPrecio !== total) {
      const change = await strapi.documents(API_DAILY).update({
        documentId: documentId,
        data: {
          SumPrecio: total,
        },
      });
    }

    const newPrice = await strapi.service(API_DAILY).includeTaxes(daily);

    if (newPrice != PriceWithTaxes) {
      const changePrice = await strapi.documents(API_DAILY).update({
        documentId: documentId,
        data: {
          PriceWithTaxes: newPrice,
        },
      });
    }
  },
  async beforeUpdate(event) {
    if (event.state.isCalculatedUpdate) {
      return; // Si es una actualización calculada, no hacemos nada
    }

    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const {params}= event;
    const menu = await strapi.db.query(API_DAILY).findOne({
      where: {
        id: params.where.id,
      },
      populate:{
        first: true,
        second: true,
        dessert: true,
      }
    })
    const {first,second,dessert} = menu;
   
    if (first.id === second.id) {
      throw new ApplicationError("El mismo plato no se puede usar como Primero y MainCourse");
    }
  
    if ( first.id === dessert.id) {
      throw new ApplicationError("El mismo plato no se puede usar como Primero y Postre");
    }
  
    if (second.id === dessert.id) {
      throw new ApplicationError("El mismo plato no se puede usar como MainCourse y Postre");
    }
  },
};
