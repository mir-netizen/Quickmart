import { mockApi } from "@/services/mock/api";

export const userService = {
  getAddresses: mockApi.addresses.list,
  saveAddress: mockApi.addresses.save,
  deleteAddress: mockApi.addresses.remove,
  getSelectedAddressId: mockApi.addresses.getSelected,
  setSelectedAddressId: mockApi.addresses.setSelected,
  updateProfile: mockApi.users.update,
};
