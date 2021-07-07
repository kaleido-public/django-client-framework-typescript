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

    afterEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test refresh", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })

        await Axios.patch("http://server:8000/product/1", { barcode: "product 2" })
        expect(om.barcode, "product 1")
        await om.refresh()
        expect(om.barcode, "product 2")
    })

    it("test refresh without updates", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        await om.refresh()
        expect(om.barcode).to.equal("product 1")
    })

    it("test save", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        om.barcode = "osu!"
        var om1 = await cm.get({ barcode: "product 1" })
        expect(om1.barcode).to.equal("product 1")
        await om.save()
        try {
            om1 = await cm.get({ barcode: "product 1" })
            assert.fail("should have failed")
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 0."
            )
        }
        om1 = await cm.get({ barcode: "osu!" })
        assert.equal(om1.id, 1)
    })

    it("test update", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        await om.update({ barcode: "osu!" })
        expect(om.barcode).to.equal("osu!")
        var om1 = await cm.get({ barcode: "osu!" })
        assert.equal(om1.id, 1)
    })

    it("test update to empty", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        await om.update({ barcode: "" })
        expect(om.barcode).to.equal("")
        var om1 = await cm.get({ id: 1 })
        expect(om1.barcode).to.equal("")
    })

    it("test update to null", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        await om.update({ barcode: null })
        assert.isNull(om.barcode)
        var om1 = await cm.get({ id: 1 })
        assert.isNull(om1.barcode)
    })

    it("test delete", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        await om.delete()
        try {
            await cm.get({ barcode: "product 1" })
            assert.fail("should not have got here")
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 0."
            )
        }
    })

    it("test modify using properties to blank and null", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "product 1" })
        om.barcode = ""
        await om.save()
        var find = await cm.get({ id: 1 })
        expect(find.barcode).to.equal("")
        om.barcode = null
        await om.save()
        find = await cm.get({ id: 1 })
        assert.isNull(find.barcode)
    })

    it("test modify properties", async () => {
        var cm = new CollectionManager(Brand)
        var om = await cm.create({ name: "nike" })
        om.name = "adidas"
        await om.save()
        var om1 = await cm.get({ id: 1 })
        expect(om1.name).to.equal("adidas")
    })

    it("test modify foreign key", async () => {
        var pcm = new CollectionManager(Product)
        var pom = await pcm.create({ barcode: "product 1" })

        var bcm = new CollectionManager(Brand)
        var bom = await bcm.create({ name: "nike" })

        pom.brand_id = 1
        await pom.save()

        var pom2 = await pcm.get({ brand_id: 1 })
        expect(pom2.barcode).to.equal("product 1")
    })

    it("test constructor pass in object", async () => {
        var pcm = new CollectionManager(Product)
        for (let i = 0; i < 3; i++) {
            await pcm.create({ barcode: `pen ${i + 1}` })
        }

        var ppr = await pcm.page({ query: { id__in: [1, 2, 3] } })
        var objm = new ObjectManagerImpl<Product>(
            ppr.objects[0]
        ) as ObjectManager<Product>
        expect(objm.barcode).to.equal("pen 1")
        assert.equal(objm.id, 1)
        assert.isNull(objm.brand_id)
    })
})
