import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CreateInvoiceInput = {
  photo: Scalars['String'];
  item: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  purchase?: Maybe<Scalars['DateTime']>;
};


export type Invoice = {
  __typename?: 'Invoice';
  id: Scalars['ID'];
  photo: Scalars['String'];
  item: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  purchase?: Maybe<Scalars['DateTime']>;
};

export type InvoiceAllResult = {
  __typename?: 'InvoiceAllResult';
  id: Scalars['ID'];
  photo: Scalars['String'];
  item: Scalars['String'];
  duration?: Maybe<Scalars['Int']>;
  purchase?: Maybe<Scalars['DateTime']>;
  expDate?: Maybe<Scalars['DateTime']>;
  progress?: Maybe<Scalars['Float']>;
};

export type InvoicePaginated = {
  __typename?: 'InvoicePaginated';
  items: Array<InvoiceAllResult>;
  total: Scalars['Int'];
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createInvoice: Invoice;
  updateInvoice: Invoice;
  deleteInvoice: Scalars['Boolean'];
  upload: Scalars['String'];
};


export type MutationCreateInvoiceArgs = {
  data: CreateInvoiceInput;
};


export type MutationUpdateInvoiceArgs = {
  data: UpdateInvoiceInput;
  id: Scalars['String'];
};


export type MutationDeleteInvoiceArgs = {
  id: Scalars['String'];
};


export type MutationUploadArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  invoice: Invoice;
  invoiceAll: InvoicePaginated;
};


export type QueryInvoiceArgs = {
  id: Scalars['String'];
};


export type QueryInvoiceAllArgs = {
  skip?: Maybe<Scalars['Int']>;
};

export type UpdateInvoiceInput = {
  photo?: Maybe<Scalars['String']>;
  item?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
  purchase?: Maybe<Scalars['DateTime']>;
};


export type CreateInvoiceMutationVariables = Exact<{
  data: CreateInvoiceInput;
}>;


export type CreateInvoiceMutation = (
  { __typename?: 'Mutation' }
  & { createInvoice: (
    { __typename?: 'Invoice' }
    & Pick<Invoice, 'id'>
  ) }
);

export type UploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'upload'>
);

export type DeleteInvoiceMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteInvoiceMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteInvoice'>
);

export type InvoiceAllQueryVariables = Exact<{
  skip?: Maybe<Scalars['Int']>;
}>;


export type InvoiceAllQuery = (
  { __typename?: 'Query' }
  & { invoiceAll: (
    { __typename?: 'InvoicePaginated' }
    & Pick<InvoicePaginated, 'total' | 'hasMore'>
    & { items: Array<(
      { __typename?: 'InvoiceAllResult' }
      & Pick<InvoiceAllResult, 'id' | 'item' | 'expDate' | 'progress'>
    )> }
  ) }
);


export const CreateInvoiceDocument = gql`
    mutation createInvoice($data: CreateInvoiceInput!) {
  createInvoice(data: $data) {
    id
  }
}
    `;
export type CreateInvoiceMutationFn = Apollo.MutationFunction<CreateInvoiceMutation, CreateInvoiceMutationVariables>;

/**
 * __useCreateInvoiceMutation__
 *
 * To run a mutation, you first call `useCreateInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInvoiceMutation, { data, loading, error }] = useCreateInvoiceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, options);
      }
export type CreateInvoiceMutationHookResult = ReturnType<typeof useCreateInvoiceMutation>;
export type CreateInvoiceMutationResult = Apollo.MutationResult<CreateInvoiceMutation>;
export type CreateInvoiceMutationOptions = Apollo.BaseMutationOptions<CreateInvoiceMutation, CreateInvoiceMutationVariables>;
export const UploadDocument = gql`
    mutation upload($file: Upload!) {
  upload(file: $file)
}
    `;
export type UploadMutationFn = Apollo.MutationFunction<UploadMutation, UploadMutationVariables>;

/**
 * __useUploadMutation__
 *
 * To run a mutation, you first call `useUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadMutation, { data, loading, error }] = useUploadMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadMutation(baseOptions?: Apollo.MutationHookOptions<UploadMutation, UploadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadMutation, UploadMutationVariables>(UploadDocument, options);
      }
export type UploadMutationHookResult = ReturnType<typeof useUploadMutation>;
export type UploadMutationResult = Apollo.MutationResult<UploadMutation>;
export type UploadMutationOptions = Apollo.BaseMutationOptions<UploadMutation, UploadMutationVariables>;
export const DeleteInvoiceDocument = gql`
    mutation deleteInvoice($id: String!) {
  deleteInvoice(id: $id)
}
    `;
export type DeleteInvoiceMutationFn = Apollo.MutationFunction<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;

/**
 * __useDeleteInvoiceMutation__
 *
 * To run a mutation, you first call `useDeleteInvoiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteInvoiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteInvoiceMutation, { data, loading, error }] = useDeleteInvoiceMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteInvoiceMutation(baseOptions?: Apollo.MutationHookOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, options);
      }
export type DeleteInvoiceMutationHookResult = ReturnType<typeof useDeleteInvoiceMutation>;
export type DeleteInvoiceMutationResult = Apollo.MutationResult<DeleteInvoiceMutation>;
export type DeleteInvoiceMutationOptions = Apollo.BaseMutationOptions<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>;
export const InvoiceAllDocument = gql`
    query invoiceAll($skip: Int) {
  invoiceAll(skip: $skip) {
    items {
      id
      item
      expDate
      progress
    }
    total
    hasMore
  }
}
    `;

/**
 * __useInvoiceAllQuery__
 *
 * To run a query within a React component, call `useInvoiceAllQuery` and pass it any options that fit your needs.
 * When your component renders, `useInvoiceAllQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useInvoiceAllQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useInvoiceAllQuery(baseOptions?: Apollo.QueryHookOptions<InvoiceAllQuery, InvoiceAllQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<InvoiceAllQuery, InvoiceAllQueryVariables>(InvoiceAllDocument, options);
      }
export function useInvoiceAllLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<InvoiceAllQuery, InvoiceAllQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<InvoiceAllQuery, InvoiceAllQueryVariables>(InvoiceAllDocument, options);
        }
export type InvoiceAllQueryHookResult = ReturnType<typeof useInvoiceAllQuery>;
export type InvoiceAllLazyQueryHookResult = ReturnType<typeof useInvoiceAllLazyQuery>;
export type InvoiceAllQueryResult = Apollo.QueryResult<InvoiceAllQuery, InvoiceAllQueryVariables>;