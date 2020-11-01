// import {APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import * as products from './products.json';
import 'source-map-support/register';

export const getAllProducts = async (_event, _context) => {
    return {
        statusCode: 200,
        body: JSON.stringify(products)
    };
}
