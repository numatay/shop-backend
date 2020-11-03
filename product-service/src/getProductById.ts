import db from "./db";

export const getProductById = async (event, _context) => {

    const { pathParameters } = event;
    console.log("Event:", event, pathParameters);
    const { productId } = event.pathParameters;
    try {
        const product = await db.getProductById(productId as string);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(product),
        };
    } catch(err) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                errorMessage: err.message
            })
        }
    }
}