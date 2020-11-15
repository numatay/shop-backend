import { Client } from 'pg';

export interface Product {
    id: string;
    title: string;
    description: string
    imageURL: string;
    price: number;
    count: number;
}

const selectProductsWithStockQuery = `
    SELECT p.id, p.title, p.description, p.price, s.count
    FROM products AS p
    LEFT JOIN stocks AS s
    ON p.id = s.product_id;
`;

const selectProductWithStockByIdQuery = `
    SELECT p.id, p.title, p.description, p.price, s.count
    FROM products AS p
    LEFT JOIN stocks AS s
    ON p.id = s.product_id
    WHERE p.id = $1;
`;

const insertProductQuery = `
    INSERT INTO products (title, description, price) 
    VALUES ($1, $2, $3) RETURNING id;
`;

const insertStockQuery = `
    INSERT INTO stocks (product_id, count)
    VALUES ($1, $2);
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
        let client = null;
        try {
            client = ProductRepository.getClient();
            await client.connect();
            const { rows } = await client.query(selectProductsWithStockQuery);
            return rows;
        } catch(err) {
            throw new Error(err);
        } finally {
            client.end();
        }
    }

    async getProductById(id: string): Promise<Product> {
        let client = null;
        try {
            client = ProductRepository.getClient();
            await client.connect();
            const { rows: [product] } = await client.query(selectProductWithStockByIdQuery, [id]);

            if (product) {
                return product;
            }
        } catch(err) {
            throw new Error(err);
        } finally {
            client.end();
        }
    }

    async createProduct({ title, description, price, count }) {
        let client = null;
        try {
            client = ProductRepository.getClient();
            await client.connect();
            await client.query("BEGIN");
            console.log(title, description, price);
            const { rows: [{id: productId}] } = await client.query(insertProductQuery, [title, description, price]);
            await client.query(insertStockQuery, [productId, count]);
            await client.query('COMMIT')
            return productId;
        } catch(err) {
            await client.query('ROLLBACK')
            console.log(err);
            throw new Error(err);
        } finally {
            client.end();
        }
    }
}

export default new ProductRepository();