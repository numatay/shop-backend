import db from './db';
import 'source-map-support/register';

export const getAllProducts = async (_event, _context) => {
    const products = await db.getProducts();
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(products)
    };
}
