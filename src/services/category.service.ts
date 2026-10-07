import { mockApi } from "@/services/mock/api";

export const categoryService = {
  getCategories: mockApi.categories.list,
  getCategoryById: mockApi.categories.getById,
  createCategory: mockApi.categories.create,
};
