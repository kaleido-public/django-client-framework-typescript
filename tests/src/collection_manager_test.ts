import Axios from "axios"
import * as chai from "chai"
import { assert, expect } from "chai"
import { Ajax, NotFound } from "django-client-framework"

import { Product } from "./models/Product"
Ajax.url_prefix = "http://server:8000"
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)

describe("collection manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test get object none should fail", async () => {
        await expect(Product.objects.get({ id__in: [] })).to.eventually.be.rejectedWith(
            NotFound
        )
    })

    it("test get object one should pass", async () => {
        await Product.objects.create({ barcode: "hello" })
        let product = await Product.objects.get({ barcode: "hello" })
        expect(product.barcode).to.equal("hello")
    })

    it("test get object more than one should fail", async () => {
        await Product.objects.create({ barcode: "hello" })
        await Product.objects.create({ barcode: "hello" })
        try {
            await Product.objects.get({ barcode: "hello" })
        } catch (error: any) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 2."
            )
        }
    })

    it("test get object with array params", async () => {
        await Product.objects.create({ barcode: "osu" })
        await Product.objects.create({ barcode: "goodbye" })
        let product = await Product.objects.get({ barcode__in: ["hello", "goodbye"] })
        expect(product.barcode).to.equal("goodbye")
    })

    it("test get object with params", async () => {
        await Product.objects.create({ barcode: "osu" })
        let product = await Product.objects.get({ barcode__exact: "osu" })
        expect(product.barcode).to.equal("osu")
    })

    it("test page default with products", async () => {
        for (let i = 0; i < 3; i++) {
            await Product.objects.create({ barcode: `product ${i + 1}` })
        }

        let pr = await Product.objects.page({
            page: {
                limit: 1,
                page: 2,
            },
        })
        assert.equal(pr.limit, 1)
        assert.equal(pr.page, 2)
        assert.equal(pr.objects_count, 3)
    })

    it("test page search by null", async () => {
        await Product.objects.create({ barcode: null })
        await Product.objects.create({ barcode: null })
        await Product.objects.create({ barcode: "sup" })
        await Product.objects.create({ barcode: "sup" })
        let result = await Product.objects.page({ query: { barcode: null } })
        assert.equal(result.objects_count, 2)
        assert.equal(result.page, 1)
    })

    it("test page query", async () => {
        for (let i = 0; i < 5; i++) {
            await Product.objects.create({ barcode: `product ${i + 1}` })
        }

        let pr = await Product.objects.page({
            query: { barcode__in: ["product 1", "product 3", "product 5"] },
        })
        assert.equal(pr.page, 1)
        assert.equal(pr.objects_count, 3)
        assert.equal(pr.objects.length, 3)
    })

    it("test page query with empty array params", async () => {
        for (let i = 0; i < 1; i++) {
            await Product.objects.create({ barcode: `product ${i + 1}` })
        }

        let pr = await Product.objects.page({
            query: {
                id__in: [], // this must be encoded to "?id__in[]="
            },
        })
        assert.equal(pr.page, 1)
        assert.equal(pr.objects_count, 0)
    })

    it("test page query order by", async () => {
        for (let i = 0; i < 5; i++) {
            await Product.objects.create({ barcode: `shoe ${i + 1}` })
        }

        let pr = await Product.objects.page({
            query: { barcode__in: ["shoe 1", "shoe 3", "shoe 2"] },
            page: { order_by: "-barcode,-id" },
        })
        assert.equal(pr.page, 1)
        assert.equal(pr.objects_count, 3)
        assert.equal(pr.objects.length, 3)
        expect(pr.objects[0].barcode).to.equal("shoe 3")
        expect(pr.objects[2].barcode).to.equal("shoe 1")
    })

    it("test create object", async () => {
        let product = await Product.objects.create({ barcode: "hello" })
        expect(product.barcode).to.equal("hello")
    })

    it("test create object with null key", async () => {
        let product = await Product.objects.create({ barcode: null })
        assert.isNull(product.barcode)
    })

    it("test get_or_create, using create", async () => {
        let product = await Product.objects.get_or_create({
            query: { barcode: "product 1" },
            defaults: { brand_id: null },
        })
        expect(product.barcode).to.equal("product 1")
    })

    it("test get_or_create, using get", async () => {
        let product = await Product.objects.create({ barcode: "product 2" })
        let exists = await Product.objects.get_or_create({
            query: { barcode: "product 2" },
            defaults: { brand_id: null },
        })
        expect(exists.barcode).to.equal("product 2")
        assert.equal(exists.id, product.id)
    })

    it("test update_or_create, using create", async () => {
        let product = await Product.objects.update_or_create({
            query: { barcode: "product 2" },
            defaults: { barcode: "product 3" },
        })
        expect(product.barcode).to.equal("product 3")
    })

    it("test update_or_create, using update", async () => {
        let product = await Product.objects.create({ barcode: "product 2" })
        let updated = await Product.objects.update_or_create({
            query: { barcode: "product 2" },
            defaults: { barcode: "product 3" },
        })
        expect(updated.barcode).to.equal("product 3")
        assert.equal(updated.id, product.id)
    })
})
