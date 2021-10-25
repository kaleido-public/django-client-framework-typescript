import {
    CollectionManager,
    Model,
    RelatedCollectionManager,
} from "django-client-framework"

import { Product } from "./Product"

export class Brand extends Model {
    _model_name = "brand"
    id!: string
    name?: string
    get products() {
        return new RelatedCollectionManager(Product, this, "products")
    }
    static get objects() {
        return new CollectionManager(Brand)
    }
}
