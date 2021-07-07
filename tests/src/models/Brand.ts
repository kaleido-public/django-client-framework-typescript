import { Model, RelatedCollectionManager } from "django-client-framework"
import { Product } from "./Product"

export class Brand extends Model {
    _model_name = "brand"
    id: number = 0
    name: string = ""
    get products() {
        return new RelatedCollectionManager(Product, this, "products")
    }
}
