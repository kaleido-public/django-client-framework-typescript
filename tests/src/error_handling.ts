import Axios from "axios"
import * as chai from "chai"
import { expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { Ajax, InvalidInput, ProgrammingError } from "django-client-framework"
import { NotFound } from "django-client-framework"

import { Product } from "./models/Product"

chai.use(chaiAsPromised)
Ajax.url_prefix = "http://server:8000"

describe("test error handlings", () => {
    beforeEach(async () => {
        await Axios.get("http://server:8000/subapp/clear")
    })

    it("not found", async () => {
        await expect(
            Product.objects.get({ barcode: "product 1" })
        ).to.be.eventually.rejectedWith(NotFound)
    })

    it("programming error", async () => {
        await expect(
            Product.objects.get({ xxxxx: "product 1" })
        ).to.be.eventually.rejectedWith(ProgrammingError)
    })

    it("invalid input", async () => {
        await expect(
            Product.objects.create({ brand_id: 123 as any }) // a string is expected
        ).to.be.eventually.rejectedWith(InvalidInput)
    })
})
