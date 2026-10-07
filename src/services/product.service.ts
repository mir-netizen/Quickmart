import { mockApi } from "@/services/mock/api";

export const productService = {
  getProducts: mockApi.products.catalog,
  getProductById: mockApi.products.getCatalogById,
  getShopProducts: mockApi.products.shopListings,
  getListing: mockApi.products.getListing,
  getProductAvailability: mockApi.products.getByProductId,
  addProductToShop: mockApi.products.addToShop,
  updateListing: mockApi.products.updateListing,
  getPopularProducts: mockApi.products.popular,
  createCatalogProduct: mockApi.products.createCatalog,
  updateCatalogProduct: mockApi.products.updateCatalog,
};
