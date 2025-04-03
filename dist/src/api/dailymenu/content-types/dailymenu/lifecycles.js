const API_DAILY = "api::dailymenu.dailymenu";
const API_DISH = "api::dish.dish";
const { auxiliar_function } = require('../../../../utils/utils.ts');
module.exports = {
    async afterUpdate(event) {
        auxiliar_function(event);
    },
    async afterCreate(event) {
        auxiliar_function(event);
    },
};
