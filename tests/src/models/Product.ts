import { Model, RelatedObjectManager } from "django-client-framework"
import { Brand } from "./Brand"

export class Product extends Model {
    _model_name = "product"
    id: number = 0
    barcode: string | null = null
    brand_id: number | null = null
    get brand() {
        return new RelatedObjectManager(Brand, this, "brand")
    }
}
