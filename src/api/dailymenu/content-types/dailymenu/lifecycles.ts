module.exports = {
    async afterUpdate(event){
        console.log(event)
        const {params, result, } = event
        const {data} = params

        console.log("DATA: ")
        console.log(data)

        console.log("PARAMS: ")
        console.log(params)

        console.log("RESULT: ")
        console.log(result)

        const API_CONT = 'api::dailymenu.dailymenu'
        const firstPlate = await strapi.db.query(API_CONT).findMany({
            where: {Day: data.Day},
            populate: { first: true },
          });

        console.log("PRIMER PLATOOOO")
        console.log(firstPlate)
        console.log("======================")
    }
}