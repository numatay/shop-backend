import db from './db';
import 'source-map-support/register';

export const getAllProducts = async (_event, _context) => {
    const products = await db.getProducts();
    return {
        statusCode: 200,
        body: JSON.stringify(products)
    };
}
