"use strict";
const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");
const ProductServiceV2 = require("../services/product.service.xxx");
class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Create product successfully",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    // V2
    new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
