import * as productsList from './mock/products.json';

export interface Product {
    id: string;
    imageURL: string;
    price: string;
}

class DatabaseServiceMock {
    products: Map<string, Product>;

    constructor() {
        this.products = new Map<string, Product>();
        Array.from(productsList.keys()).forEach(productKey => {
            const productItem = productsList[productKey];
            this.products.set(productItem.id, {
                id: productItem.id,
                imageURL: productItem.imageURL,
                price: productItem.price,
            });
        });
    }

    async getProducts() {
        return Array.from(this.products.values());
    }

    async getProductById(id: string) {
        const product = this.products.get(id);
        if (product) {
            return product;
        } else {
            throw new Error(`Product with '${id}' not found`);
        }
    }
}

export default new DatabaseServiceMock();