import {APIGatewayProxyHandler} from "aws-lambda";
import db from './db';
import 'source-map-support/register';
import {addCorsHeaders} from "./utils";


export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
    console.log(`Request event: ${JSON.stringify(_event)} context: ${JSON.stringify(_context)}`);

    const products = await db.getProducts();
    return {
        statusCode: 200,
        headers: addCorsHeaders(),
        body: JSON.stringify(products)
    };
}
