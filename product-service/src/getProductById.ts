import {APIGatewayProxyHandler} from "aws-lambda";
import db from "./db";
import {addCorsHeaders} from "./utils";

export const getProductById: APIGatewayProxyHandler  = async (event, _context) => {
    const { productId } = event.pathParameters;
    try {
        const product = await db.getProductById(productId as string);
        return {
            statusCode: 200,
            headers: addCorsHeaders(),
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