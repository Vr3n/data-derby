import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "~/main";
import { CustomerCreate } from "../types";
import { customerFetchClient, customerKeys, customerQueries } from "../queries";
import { toast } from "sonner";

export const useCreateCustomerMutation = () => {
  return useMutation({
    mutationFn: (data: { body: CustomerCreate }) =>
      customerFetchClient.createCustomer(data.body),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: customerKeys.lists() })
        .then(() => {
          toast.success("Customer Added Successfully!");
        });
    },
    onError: (error, _, __) => {
      toast.error("Failed to add customer, Please try again.");
      console.log("erorr creating customer: ", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

export const useCustomersQuery = () => {
  return useQuery({ ...customerQueries.getCustomers() });
};

export const useDeleteCustomerMutation = () => {
  return useMutation({
    mutationFn: (id: string) => customerFetchClient.deleteCustomer(id),
    onSuccess: (_, deletedId) => {
      // Invalidate Detail customer queries.
      queryClient.removeQueries({ queryKey: customerKeys.detail(deletedId) });

      // Invalidate list queries.
      queryClient.invalidateQueries({ queryKey: customerKeys.all }).then(() => {
        toast.success("Customer Deleted Successfully!");
      });
    },
    onError: (error, _, __) => {
      toast.error("Failed to delete customer. Please try again.");
      console.log("error during fetch: ", error);
    },
    onSettled: () => {
      // Ensure the list is refetched after the mutation.
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};

export const useUpdateCustomerMutation = () => {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CustomerCreate> }) =>
      customerFetchClient.updateCustomer(id, body),
    onSuccess: (updatedCustomer) => {
      // update the specific customer in the cache.
      queryClient.setQueryData(
        customerKeys.detail(updatedCustomer.id),
        updatedCustomer,
      );

      // invalidate the list queries as the might be affected.
      queryClient
        .invalidateQueries({ queryKey: customerKeys.lists() })
        .then(() => {
          toast.success("Customer Updated Successfully!");
        });
    },
    onError(error, _, __) {
      toast.error("Failed to updated customer. Please try again.");
      console.log("Update customer error: ", error);
    },
    onSettled: (_, __, { id }) => {
      // Ensure cache is refreshed.
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
};
