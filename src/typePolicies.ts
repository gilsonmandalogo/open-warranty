import { FieldPolicy, TypePolicies } from "@apollo/client";
import { InvoiceAllQuery } from "generated/graphql";

export default {
  Query: {
    fields: {
      invoiceAll: cacheMergeInvoiceAll(),
    }
  }
} as TypePolicies;

function cacheMergeInvoiceAll(): FieldPolicy {
  return {
    keyArgs: false,
    merge(existing?: InvoiceAllQuery['invoiceAll'], incoming?: InvoiceAllQuery['invoiceAll']) {
      return {
        ...incoming,
        items: [
          ...(existing ? existing.items : []),
          ...(incoming ? incoming.items : []),
        ]
      };
    },
  }
}
