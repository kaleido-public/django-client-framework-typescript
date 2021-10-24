import { assert, expect } from "chai"
import {
    ObjectManagerImpl,
    ObjectManager,
    CollectionManager,
    Ajax,
} from "django-client-framework"
import { Product } from "./models/Product"
import { Brand } from "./models/Brand"
import Axios from "axios"

Ajax.url_prefix = "http://server:8000"

describe("object manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test refresh", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        await Axios.patch(`http://server:8000/product/${product.id}`, {
            barcode: "product 2",
        })
        expect(product.barcode, "product 1")
        await product.refresh()
        expect(product.barcode, "product 2")
    })

    it("test save", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        product.barcode = "osu!"
        await product.save()
        assert.equal(product.barcode, "osu!")
        let reloaded = await Product.objects.get({ id: product.id })
        assert.equal(reloaded.barcode, "osu!")
    })

    it("test update", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        await product.update({ barcode: "osu!" })
        assert.equal(product.barcode, "osu!")
        let reloaded = await Product.objects.get({ id: product.id })
        assert.equal(reloaded.barcode, "osu!")
    })

    it("test update to empty", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        await product.update({ barcode: "" })
        expect(product.barcode).to.equal("")
        let product1 = await Product.objects.get({ id: product.id })
        expect(product1.barcode).to.equal("")
    })

    it("test update to null", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        await product.update({ barcode: null })
        assert.isNull(product.barcode)
        let product1 = await Product.objects.get({ id: product.id })
        assert.isNull(product1.barcode)
    })

    it("test delete", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        await product.delete()
        assert.equal((await Product.objects.page({})).objects_count, 0)
    })

    it("test modify using properties to blank and null", async () => {
        let product = await Product.objects.create({ barcode: "product 1" })
        product.barcode = ""
        await product.save()
        let find = await Product.objects.get({ id: product.id })
        expect(find.barcode).to.equal("")
        product.barcode = null
        await product.save()
        find = await Product.objects.get({ id: product.id })
        assert.isNull(find.barcode)
    })
})
