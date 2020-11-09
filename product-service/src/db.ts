import { Client } from 'pg';

export interface Product {
    id: string;
    title: string;
    description: string
    imageURL: string;
    price: number;
    count: number;
}

const selectProductsQuery = `
    SELECT * 
    FROM products;
`;

const selectProductByIdQuery = `
    SELECT p.id, p.title, p.description, p.price, s.count
    FROM products AS p
    LEFT JOIN stocks AS s
    ON p.id = s.product_id
    WHERE p.id = $1;
`;

class ProductRepository {
    private static getClient() {
        return new Client({
            host: process.env.PG_HOST,
            port: Number(process.env.PG_PORT),
            database: process.env.PG_DATABASE,
            user: process.env.PG_USERNAME,
            password: process.env.PG_PASSWORD,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
        });
    }

    async getProducts() {
        let client;
        try {
            client = ProductRepository.getClient();
            await client.connect();
            const { rows } = await client.query(selectProductsQuery);
            return rows;
        } catch(err) {
            throw new Error(err);
        } finally {
            client.end();
        }
    }

    async getProductById(id: string): Promise<Product> {
        let client;
        try {
            client = ProductRepository.getClient();
            await client.connect();
            const { rows: [product] } = await client.query(selectProductByIdQuery, [id]);

            if (product) {
                return product;
            }
        } catch(err) {
            throw new Error(err);
        } finally {
            client.end();
        }
    }
}

export default new ProductRepository();