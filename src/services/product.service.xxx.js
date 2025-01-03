"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model.js");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
// define factory class to create product
class ProductFactory {
  /**
   * type: 'clothing' | 'electronic'
   * payload
   */
  // create product
  static productRegistry = {}; // key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`);
    }
    return await new productClass(payload).createProduct();
  }
}

// define base class for product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id,
    });
  }
}

// define subclass for different product types (clothing)
class Clothing extends Product {
  async createProduct() {
    // console.log('check payload',this);
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Create new Clothing failed");
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }
    return newProduct;
  }
}

// define subclass for different product types (electronic)
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Create new Electronics failed");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Create new Furnitures failed");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product failed");
    }
    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
// Add new product type here
module.exports = ProductFactory;
