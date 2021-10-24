import { assert, expect } from "chai"
import { CollectionManager, Ajax, AjaxDriverLogger } from "django-client-framework"
import { Product } from "./models/Product"
import { Brand } from "./models/Brand"
import Axios from "axios"
import * as uuid from "uuid"

Ajax.url_prefix = "http://server:8000"

describe("object manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test set/get brand", async () => {
        AjaxDriverLogger.enableAll()
        let brand = await Brand.objects.create({ name: "nike" })
        let id = uuid.v4()
        let product = await Product.objects.create({ id: id, barcode: "zoomfly v1" })
        expect(await product.brand.get()).equals(null)
        await product.brand.set(brand)
        let get_brand = await product.brand.get()
        expect(brand.id, get_brand?.id)
        expect(brand.name, get_brand?.name)
    })
})
