import Axios from "axios"
import { expect } from "chai"
import { Ajax } from "django-client-framework"
import * as uuid from "uuid"

import { Brand } from "./models/Brand"
import { Product } from "./models/Product"

Ajax.url_prefix = "http://server:8000"

describe("object manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test set/get brand", async () => {
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
