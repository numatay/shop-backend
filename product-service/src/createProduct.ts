import {APIGatewayProxyHandler} from "aws-lambda";
import db from "./db";
import {addCorsHeaders} from "./utils";

export const createProduct: APIGatewayProxyHandler  = async (event, _context) => {
    console.log(`Request event: ${JSON.stringify(event)} context: ${JSON.stringify(_context)}`);

    const { title, description, price, count } = JSON.parse(event.body);
    console.log(title, description, price, count);
    try {
        const productId = await db.createProduct({ title, description, price, count });
        return {
            statusCode: 201,
            headers: addCorsHeaders(),
            body: JSON.stringify(productId),
        };
    } catch(err) {
        console.log("err:", err)
        return {
            statusCode: 404,
            body: JSON.stringify({
                errorMessage: err.message
            })
        }
    }
}