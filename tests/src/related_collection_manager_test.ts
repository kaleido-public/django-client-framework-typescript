import { assert, expect } from "chai"
import {
    ObjectManagerImpl,
    ObjectManager,
    Ajax,
    CollectionManager,
} from "django-client-framework"
import { Product } from "./models/Product"
import { Brand } from "./models/Brand"
import Axios from "axios"

Ajax.url_prefix = "http://server:8000"

describe("related collection manager tests", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test page empty", async () => {
        let brand = await Brand.objects.create({ name: "nike" })
        let products = await brand.products.page({
            query: {
                barcode: "product 1",
            },
        })
        assert.equal(products.limit, 50)
        assert.equal(products.page, 1)
        assert.equal(products.objects_count, 0)
        assert.equal(products.objects.length, 0)
    })

    it("test page", async () => {
        let brand = await Brand.objects.create({ name: "nike" })

        let lst = []
        for (let i = 0; i < 10; i++) {
            let p = await Product.objects.create({ barcode: `product ${i + 1}` })
            lst.push(p)
        }
        await brand.products.add(lst)

        let products = await brand.products.page({
            query: {
                barcode__in: ["product 1", "product 4", "product 6"],
            },
            page: {
                limit: 5,
                page: 1,
                order_by: "barcode",
            },
        })
        assert.equal(products.limit, 5)
        assert.equal(products.page, 1)
        assert.equal(products.pages_count, 1)
        assert.equal(products.objects_count, 3)
        assert.equal(products.objects.length, 3)
        expect(products.objects[0].barcode).to.equal("product 1")
    })

    it("test add", async () => {
        let brand = await Brand.objects.create({ name: "nike" })
        for (let i = 0; i < 3; i++) {
            let product = await Product.objects.create({ barcode: `sneaker ${i + 1}` })
            await brand.products.add([product])
        }

        let product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 3)
    })

    it("test set", async () => {
        let brand = await Brand.objects.create({ name: "nike" })
        let products = []
        for (let i = 0; i < 3; i++) {
            let product = await Product.objects.create({ barcode: `sneaker ${i + 1}` })
            products.push(product)
        }
        await brand.products.set(products)
        let product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 3)
    })

    it("test set to empty", async () => {
        let brand = await Brand.objects.create({ name: "nike" })
        let products = []
        for (let i = 0; i < 3; i++) {
            let product = await Product.objects.create({ barcode: `sneaker ${i + 1}` })
            products.push(product)
        }
        await brand.products.set(products)
        let product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 3)
        await brand.products.set([])
        product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 0)
    })

    it("test remove", async () => {
        let brand = await Brand.objects.create({ name: "nike" })
        let products = []
        for (let i = 0; i < 3; i++) {
            let product = await Product.objects.create({ barcode: `sneaker ${i + 1}` })
            products.push(product)
        }
        await brand.products.set(products)
        let product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 3)
        await brand.products.remove(product_lst.objects)
        product_lst = await brand.products.page({})
        assert.equal(product_lst.objects_count, 0)
    })
})
