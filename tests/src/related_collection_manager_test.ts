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

    afterEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("test page empty", async () => {
        var cm = new CollectionManager(Brand)
        var om = await cm.create({ name: "nike" })
        var products = await om.products.page({
            query: {
                barcode: "product 1",
            },
        })
        assert.equal(products.limit, 50)
        assert.equal(products.page, 1)
        assert.equal(products.total, 0)
        assert.equal(products.objects.length, 0)
    })

    it("test page with results", async () => {
        var cmb = new CollectionManager(Brand)
        var cmp = new CollectionManager(Product)
        var om = await cmb.create({ name: "nike" })

        var lst = []
        for (let i = 0; i < 10; i++) {
            var p = await cmp.create({ barcode: `product ${i + 1}` })
            lst.push(p)
        }

        await om.products.add(lst)

        var products = await om.products.page({
            query: {
                barcode__in: ["product 1", "product 5", "product 10"],
            },
        })
        assert.equal(products.limit, 50)
        assert.equal(products.page, 1)
        assert.equal(products.total, 3)
        assert.equal(products.objects.length, 3)
        expect(products.objects[0].barcode).to.equal("product 1")
    })

    it("test page with results and pagination", async () => {
        var cmb = new CollectionManager(Brand)
        var cmp = new CollectionManager(Product)
        var om = await cmb.create({ name: "nike" })

        var lst = []
        for (let i = 0; i < 10; i++) {
            var p = await cmp.create({ barcode: `product ${i + 1}` })
            lst.push(p)
        }

        await om.products.add(lst)

        var products = await om.products.page({
            page: {
                limit: 5,
                page: 2,
                order_by: "-barcode",
            },
        })
        assert.equal(products.limit, 5)
        assert.equal(products.page, 2)
        assert.equal(products.total, 10)
        assert.equal(products.objects.length, 5)
        expect(products.objects[0].barcode).to.equal("product 4")
    })

    it("test get with no result", async () => {
        var cmb = new CollectionManager(Brand)
        var om = await cmb.create({ name: "nike" })
        try {
            await om.products.get({})
            assert.fail("shouldn't have got here")
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 0."
            )
        }
    })

    it("test get with one result", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })

        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) {
            await pcm.create({ barcode: `shoe ${i + 1}` })
        }

        // posting objects to relation
        // Uri uri = Uri.http("server:8000", "/brand/1/products");
        // var data = jsonEncode([5]);
        // await http.post(uri, body: data, headers: {'content-type': 'application/json'});
        await Axios.post("http://server:8000/brand/1/products", [5])

        var related_product = await bom.products.get({})
        assert.equal(related_product.id, 5)
        expect(related_product.barcode).to.equal("shoe 5")
    })

    it("test get with multiple results", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })

        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) {
            await pcm.create({ barcode: `shoe ${i + 1}` })
        }

        // posting objects to relation
        // Uri uri = Uri.http("server:8000", "/brand/1/products");
        // var data = jsonEncode([5, 6]);
        // await http.post(uri, body: data, headers: {'content-type': 'application/json'});
        await Axios.post("http://server:8000/brand/1/products", [5, 6])
        try {
            var related_product = await bom.products.get({})
            assert.fail("shouldn't have got here")
        } catch (error) {
            expect(error.message).to.equal(
                ".get() must receive exactly 1 object, but got 2."
            )
        }
    })

    it("test add ids", async () => {
        var pcm = new CollectionManager<Product>(Product)
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        await bom.products.add_ids([2, 4, 6, 8])
        var product_lst = await bom.products.page({})
        assert.equal(product_lst.total, 4)
        assert.equal(product_lst.objects.length, 4)
        expect(product_lst.objects[3].barcode).to.equal("sneaker 8")
    })

    it("test add ids some invalid", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        bom.products.add_ids([10, 15])
        var pr = await bom.products.page({})
        assert.equal(pr.total, 0)
        assert.equal(pr.objects.length, 0)
    })

    it("test set ids", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        await bom.products.add_ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        var pr = await bom.products.page({})
        assert.equal(pr.total, 10)
        assert.equal(pr.objects.length, 10)
        expect(pr.objects[9].barcode).to.equal("sneaker 10")

        await bom.products.set_ids([7])
        var pr1 = await bom.products.page({})
        assert.equal(pr1.total, 1)
        assert.equal(pr1.objects.length, 1)
        expect(pr1.objects[0].barcode).to.equal("sneaker 7")
    })

    it("test set ids to empty", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        await bom.products.add_ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        var pr = await bom.products.page({})
        assert.equal(pr.total, 10)
        assert.equal(pr.objects.length, 10)
        expect(pr.objects[9].barcode).to.equal("sneaker 10")

        await bom.products.set_ids([])
        var pr1 = await bom.products.page({})
        assert.equal(pr1.total, 0)
        assert.equal(pr1.objects.length, 0)
    })

    it("test set ids to invalid", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        await bom.products.add_ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        var pr = await bom.products.page({})
        assert.equal(pr.total, 10)
        assert.equal(pr.objects.length, 10)
        assert.equal(pr.objects[9].barcode, "sneaker 10")

        try {
            await bom.products.set_ids([8, 7, 10, 30])
        } catch (error) {}
        var pr1 = await bom.products.page({})
        assert.equal(pr1.total, 10)
        assert.equal(pr1.objects.length, 10)
    })

    it("test remove ids", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        for (let i = 0; i < 10; i++) await pcm.create({ barcode: `sneaker ${i + 1}` })

        await bom.products.add_ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

        await bom.products.remove_ids([1, 3, 5, 7, 9])
        var pr1 = await bom.products.page({})
        assert.equal(pr1.total, 5)
        assert.equal(pr1.objects.length, 5)
        expect(pr1.objects[0].barcode).to.equal("sneaker 2")
    })

    it("test add objs", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        var lst1 = []
        var lst2 = []
        for (let i = 0; i < 10; i++) {
            var prod = await pcm.create({ barcode: `sneaker ${i + 1}` })
            if (i < 5) {
                lst1.push(prod)
            } else lst2.push(prod)
        }

        await bom.products.add(lst1)
        var related = await bom.products.page({})
        assert.equal(5, related.total)
        expect("sneaker 5").to.equal(related.objects[4].barcode)

        await bom.products.add(lst2)
        related = await bom.products.page({})
        assert.equal(10, related.total)
        expect("sneaker 10").to.equal(related.objects[9].barcode)
    })

    it("test set objs", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        var lst1 = []
        var lst2 = []
        for (let i = 0; i < 10; i++) {
            var prod = await pcm.create({ barcode: `sneaker ${i + 1}` })
            if (i <= 8) {
                lst1.push(prod)
            } else lst2.push(prod)
        }

        await bom.products.set(lst1)
        var related = await bom.products.page({})
        assert.equal(9, related.total)
        expect("sneaker 9").to.equal(related.objects[8].barcode)

        await bom.products.set(lst2)
        related = await bom.products.page({})
        assert.equal(1, related.total)
        expect("sneaker 10").to.equal(related.objects[0].barcode)
    })

    it("test remove objs", async () => {
        var bcm = new CollectionManager<Brand>(Brand)
        var bom = await bcm.create({ name: "nike" })
        var pcm = new CollectionManager<Product>(Product)
        var lst1 = []
        var lst2 = []
        var lst3 = []
        for (let i = 0; i < 10; i++) {
            var prod = await pcm.create({ barcode: `sneaker ${i + 1}` })
            if (i <= 8) {
                lst1.push(prod)
            } else lst2.push(prod)
            lst3.push(prod)
        }

        await bom.products.set(lst3)

        await bom.products.remove(lst2)
        var related = await bom.products.page({})
        assert.equal(9, related.total)
        expect("sneaker 9").to.equal(related.objects[8].barcode)

        await bom.products.remove(lst1)
        related = await bom.products.page({})
        assert.equal(0, related.total)
    })

    // TODO: do something about this test lol
    // it ('test remove ids invalid', async () => {
    //     var bcm = new CollectionManager<Brand>(Brand);
    //     var bom = await bcm.create({ "name": "nike" });
    //     var pcm = new CollectionManager<Product>(Product);
    //     for (let i = 0; i < 10; i++) await pcm.create({ "barcode": `sneaker ${i+1}`});

    //     await bom.products.add_ids([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    //     await bom.products.remove_ids([3, 11]);
    //     var pr1 = await bom.products.page({});
    //     assert.equal(pr1.total, 10);
    //     assert.equal(pr1.objects.length, 10);
    //     expect(pr1.objects[9].barcode).to.equal("sneaker 10");
    // });
})
