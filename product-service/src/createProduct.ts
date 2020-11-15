import {APIGatewayProxyHandler} from "aws-lambda";
import db from "./db";
import {addCorsHeaders} from "./utils";
import {ProductWithStockSchema} from "./utils/schema/ProductWithStockSchema";

export const createProduct: APIGatewayProxyHandler  = async (event, _context) => {
    console.log(`Request event: ${JSON.stringify(event)} context: ${JSON.stringify(_context)}`);

    const values = JSON.parse(event.body);

    try {
        await ProductWithStockSchema.validate(values);
    } catch(err) {
        return {
            statusCode: 400,
            headers: addCorsHeaders(),
            body: JSON.stringify(err.errors),
        };
    }

    try {
        const productId = await db.createProduct(values);
        return {
            statusCode: 201,
            headers: addCorsHeaders(),
            body: JSON.stringify(productId),
        };
    } catch(err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                errorMessage: err.message
            })
        }
    }
}