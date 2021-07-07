import { assert, expect } from "chai"
import { CollectionManager, Ajax } from "django-client-framework"
import { Product } from "./models/Product"
import { Brand } from "./models/Brand"
import Axios from "axios"

Ajax.url_prefix = "http://server:8000"

describe("object manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    afterEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test set brand", async () => {
        var cm = new CollectionManager(Brand)
        var om = await cm.create({ name: "nike" })
        var pcm = new CollectionManager(Product)
        var pom = await pcm.create({ barcode: "zoomfly v1" })
        try {
            var refreshed = await pcm.get({ brand_id: 1 })
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 0."
            )
        }

        await pom.brand.set(om)

        refreshed = await pcm.get({ brand_id: 1 })
        expect(refreshed.barcode).to.equal("zoomfly v1")
    })

    it("test get brand", async () => {
        var cm = new CollectionManager(Brand)
        var om = await cm.create({ name: "nike" })
        var pcm = new CollectionManager(Product)
        var pom = await pcm.create({ barcode: "zoomfly v1" })
        try {
            var temp = await pom.brand.get()
        } catch (error) {}

        await pom.brand.set(om)
        temp = await pom.brand.get()
        expect("nike", temp!.name)
    })
})
