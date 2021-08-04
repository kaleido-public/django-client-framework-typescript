import { assert, expect } from "chai"
import { CollectionManager, Ajax } from "django-client-framework"
import Axios from "axios"
import { Product } from "./models/Product"

Ajax.url_prefix = "http://server:8000"

describe("collection manager tests", () => {
    beforeEach(async () => {
        // Axios.defaults = {...Axios.defaults, baseURL: "http://server:8000"}
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test get object none should fail", async () => {
        var cm = new CollectionManager(Product)
        try {
            var om = await cm.get({ id__in: [1] })
            assert.fail("shouldn't have reached here")
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 0."
            )
        }
    })

    it("test get object one should pass", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "hello" })
        var om = await cm.get({ barcode: "hello" })
        expect(om.barcode).to.equal("hello")
        assert.equal(om.id, 1)
    })

    it("test get object more than one should fail", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "hello" })
        await cm.create({ barcode: "hello" })
        try {
            await cm.get({ id__in: [1] })
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 2"
            )
        }
    })

    it("test get object with array params", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "osu" })
        await cm.create({ barcode: "goodbye" })
        var om = await cm.get({ barcode__in: ["hello", "goodbye"] })
        expect(om.barcode).to.equal("goodbye")
        assert.equal(om.id, 2)
    })

    it("test get object with params", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "osu" })
        var om = await cm.get({ barcode__exact: "osu" })
        expect(om.barcode).to.equal("osu")
        assert.equal(om.id, 1)
    })

    it("test page default", async () => {
        var cm = new CollectionManager(Product)
        var pr = await cm.page({})
        assert.equal(pr.limit, 50)
        assert.equal(pr.total, 0)
        assert.equal(pr.page, 1)
    })

    it("test page default with products", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 20; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({
            page: {
                limit: 10,
            },
        })
        assert.equal(pr.limit, 10)
        assert.equal(pr.total, 20)
        assert.equal(pr.page, 1)
    })

    it("test page search by null", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            if (i < 8) await cm.create({ barcode: null })
            else await cm.create({ barcode: "sup" })
        }

        var pr = await cm.page({ query: { barcode: null } })
        assert.equal(pr.limit, 50)
        assert.equal(pr.total, 8)
        assert.equal(pr.page, 1)
        assert.equal(pr.objects[0].id, 1)
    })

    it("test page page 1", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 20; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }
        var pr = await cm.page({
            page: {
                limit: 10,
            },
        })
        assert.equal(pr.limit, 10)
        assert.equal(pr.total, 20)
        assert.equal(pr.page, 1)
        assert.equal(pr.objects.length, 10)
        assert.equal(pr.objects[0].id, 1)
        expect(pr.objects[0].barcode).to.equal("product 1")
        assert.equal(pr.objects[9].id, 10)
        expect(pr.objects[9].barcode).to.equal("product 10")
    })

    it("test page page 2", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 20; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({ page: { page: 2, limit: 10 } })
        assert.equal(pr.limit, 10)
        assert.equal(pr.total, 20)
        assert.equal(pr.page, 2)
        assert.equal(pr.objects.length, 10)
        assert.equal(pr.objects[0].id, 11)
        expect(pr.objects[0].barcode).to.equal("product 11")
    })

    it("test page page and limit", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 15; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({ page: { page: 2, limit: 5 } })
        assert.equal(pr.limit, 5)
        assert.equal(pr.page, 2)
        assert.equal(pr.total, 15)
        assert.equal(pr.objects.length, 5)
        assert.equal(pr.objects[0].id, 6)
        expect(pr.objects[0].barcode).to.equal("product 6")
    })

    it("test page limit no page", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({ page: { limit: 5 } })
        assert.equal(pr.limit, 5)
        assert.equal(pr.page, 1)
        assert.equal(pr.total, 10)
        assert.equal(pr.objects.length, 5)
        assert.equal(pr.objects[0].id, 1)
        assert.equal(pr.objects[0].barcode, "product 1")
    })

    it("test page query", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({
            query: { barcode__in: ["product 1", "product 3", "product 5"] },
        })
        assert.equal(pr.limit, 50)
        assert.equal(pr.page, 1)
        assert.equal(pr.total, 3)
        assert.equal(pr.objects.length, 3)
        assert.equal(pr.objects[1].id, 3)
        expect(pr.objects[1].barcode).to.equal("product 3")
    })

    it("test page query with page", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({
            query: {
                id__in: [3, 5],
                barcode__in: ["product 1", "product 3", "product 5"],
            },
            page: { limit: 1, page: 2 },
        })
        assert.equal(pr.limit, 1)
        assert.equal(pr.page, 2)
        assert.equal(pr.total, 2)
        assert.equal(pr.objects.length, 1)
        assert.equal(pr.objects[0].id, 5)
        expect(pr.objects[0].barcode).to.equal("product 5")
    })

    it("test page query with empty array params", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({
            query: {
                id__in: [], // this must be encoded to "?id__in[]="
            },
        })
        assert.equal(pr.page, 1)
        assert.equal(pr.total, 0)
    })

    it("test page query with page", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        var pr = await cm.page({
            query: {
                id__in: [3, 5],
                barcode__in: ["product 1", "product 3", "product 5"],
            },
            page: { limit: 1, page: 2 },
        })
        assert.equal(pr.limit, 1)
        assert.equal(pr.page, 2)
        assert.equal(pr.total, 2)
        assert.equal(pr.objects.length, 1)
        assert.equal(pr.objects[0].id, 5)
        expect(pr.objects[0].barcode).to.equal("product 5")
    })

    it("test page query order by", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `shoe ${i + 1}` })
        }

        var pr = await cm.page({
            query: { barcode__in: ["shoe 1", "shoe 3", "shoe 5"] },
            page: { order_by: "-barcode" },
        })
        assert.equal(pr.limit, 50)
        assert.equal(pr.page, 1)
        assert.equal(pr.total, 3)
        assert.equal(pr.objects.length, 3)
        assert.equal(pr.objects[0].id, 5)
        expect(pr.objects[0].barcode).to.equal("shoe 5")
        assert.equal(pr.objects[2].id, 1)
        expect(pr.objects[2].barcode).to.equal("shoe 1")
    })

    it("test page query order by ver 2", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }

        await cm.create({ barcode: "product 4" })

        var pr = await cm.page({
            query: { barcode__in: ["product 1", "product 4", "product 5"] },
            page: { order_by: "-barcode,-id" },
        })
        assert.equal(pr.limit, 50)
        assert.equal(pr.page, 1)
        assert.equal(pr.total, 4)
        assert.equal(pr.objects.length, 4)
        assert.equal(pr.objects[0].id, 5)
        expect(pr.objects[0].barcode).to.equal("product 5")
        assert.equal(pr.objects[1].id, 11)
        expect(pr.objects[1].barcode).to.equal("product 4")
        assert.equal(pr.objects[2].id, 4)
        expect(pr.objects[2].barcode).to.equal("product 4")
    })

    it("test page typo", async () => {
        var cm = new CollectionManager(Product)
        for (let i = 0; i < 10; i++) {
            await cm.create({ barcode: `product ${i + 1}` })
        }
        try {
            var pr = await cm.page({
                query: { barcode___in: ["product 1", "product 4", "product 5"] },
                page: { order_by: "-barcode,-id" },
            })
        } catch (error) {
            // expect(error.message).to.equal('Server did not return objects. Response: {"non_field_error": "Unsupported lookup \'_in\' for CharField or join on the field not permitted, perhaps you meant in?"}');
        }
    })

    it("test create object", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: "hello" })
        expect(om.barcode).to.equal("hello")
    })

    it("test create object with null key", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.create({ barcode: null })
        assert.isNull(om.barcode)
        assert.equal(om.id, 1)
    })

    it("test get or create", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.get_or_create({
            query: { barcode: "product 1" },
            defaults: { brand_id: null },
        })
        expect(om.barcode).to.equal("product 1")
        assert.equal(om.id, 1)
    })

    it("test get or create v2", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.get_or_create({ query: { barcode: "product 1" } })
        expect(om.barcode).to.equal("product 1")
        assert.equal(om.id, 1)
    })

    it("test get or create v3", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "product 1" })
        await cm.create({ barcode: "product 2" })
        var om = await cm.get_or_create({
            query: { barcode: "product 2" },
            defaults: { brand_id: null },
        })
        expect(om.barcode).to.equal("product 2")
        assert.equal(om.id, 2)
    })

    it("test update or create", async () => {
        var cm = new CollectionManager(Product)
        var om = await cm.update_or_create({
            query: { barcode: "product 2" },
            defaults: { barcode: "product 3" },
        })
        expect(om.barcode).to.equal("product 3")
        assert.equal(om.id, 1)
    })

    it("test update or create v2", async () => {
        var cm = new CollectionManager(Product)
        await cm.create({ barcode: "product 2" })
        var om = await cm.update_or_create({
            query: { barcode: "product 2" },
            defaults: { barcode: "product 3" },
        })
        expect(om.barcode).to.equal("product 3")
        assert.equal(om.id, 1)
    })
})
