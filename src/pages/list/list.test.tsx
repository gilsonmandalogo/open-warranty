import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingOverlayProvider } from 'contexts/LoadingOverlay';
import { DeleteInvoiceDocument, InvoiceAllDocument } from 'generated/graphql';
import React from 'react';
import typePolicies from 'typePolicies';
import List from './list';

describe('"list" page', () => {
  it('renders with data', async () => {
    const invoiceAllMock = {
      request: {
        query: InvoiceAllDocument,
      },
      result: {
        data: {
          invoiceAll: {
            __typename: 'InvoicePaginated',
            items: [
              { __typename: '"InvoiceAllResult', id: '1', item: 'Test item 1', expDate: '2024-04-21T00:00:00.000Z', progress: 0.054805340769887134, photo: '/images/1622756031280.jpg' },
              { __typename: '"InvoiceAllResult', id: '2', item: 'Test item 2', expDate: null, progress: null, photo: '/images/1622756031280.jpg' },
            ],
            total: 2,
            hasMore: false,
          }
        },
      },
    };
  
    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[invoiceAllMock]} cache={new InMemoryCache({ typePolicies })}>
          <List/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));
  
    const warrantiesCount = invoiceAllMock.result.data.invoiceAll.total;
  
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  
    await waitFor(() => screen.getByTestId('warrantiesCount'));
  
    expect(screen.getByTestId('warrantiesCount')).toHaveTextContent(`${warrantiesCount} warranties`);
    expect(screen.getAllByTestId('tableRow')[0]).toHaveTextContent(invoiceAllMock.result.data.invoiceAll.items[0].item);
    expect(screen.getAllByTestId('tableRow')[1]).toHaveTextContent(invoiceAllMock.result.data.invoiceAll.items[1].item);
    expect(screen.getByTestId('loadMoreButton')).toBeDisabled();

    unmount();
  });

  it('renders with paginated data', async () => {
    const invoiceAllMock = {
      request: {
        query: InvoiceAllDocument,
      },
      result: {
        data: {
          invoiceAll: {
            __typename: 'InvoicePaginated',
            items: [
              { __typename: '"InvoiceAllResult', id: '1', item: 'Test item 1', expDate: '2024-04-21T00:00:00.000Z', progress: 0.054805340769887134, photo: '/images/1622756031280.jpg' },              
            ],
            total: 2,
            hasMore: true,
          }
        },
      },
    };

    const invoiceAllMockMore = {
      request: {
        query: InvoiceAllDocument,
        variables: { skip: 10 },
      },
      result: {
        data: {
          invoiceAll: {
            __typename: 'InvoicePaginated',
            items: [
              { __typename: '"InvoiceAllResult', id: '2', item: 'Test item 2', expDate: null, progress: null, photo: '/images/1622756031280.jpg' },
            ],
            total: 2,
            hasMore: false,
          }
        },
      },
    }
  
    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[invoiceAllMock, invoiceAllMockMore]} cache={new InMemoryCache({ typePolicies })}>
          <List/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));
  
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  
    await waitFor(() => screen.getByTestId('warrantiesCount'));
  
    expect(screen.getAllByTestId('tableRow')[0]).toHaveTextContent(invoiceAllMock.result.data.invoiceAll.items[0].item);
    expect(screen.getAllByTestId('tableRow')[1]).toBeFalsy();
    expect(screen.getByTestId('loadMoreButton')).toBeEnabled();

    userEvent.click(screen.getByTestId('loadMoreButton'));

    await waitFor(() => screen.getAllByTestId('tableRow')[1]);

    expect(screen.getAllByTestId('tableRow')[1]).toHaveTextContent(invoiceAllMockMore.result.data.invoiceAll.items[0].item);
    expect(screen.getByTestId('loadMoreButton')).toBeDisabled();

    unmount();
  });

  it('delete a item', async () => {
    const invoiceAllMock = {
      request: {
        query: InvoiceAllDocument,
      },
      result: {
        data: {
          invoiceAll: {
            __typename: 'InvoicePaginated',
            items: [
              { __typename: '"InvoiceAllResult', id: '1', item: 'Test item 1', expDate: null, progress: null, photo: '/images/1622756031280.jpg' },
            ],
            total: 1,
            hasMore: false,
          }
        },
      },
    };

    const deleteMock = {
      request: {
        query: DeleteInvoiceDocument,
        variables: { id: '1' },
      },
      result: jest.fn(() => ({
        data: {
          deleteInvoice: true,
        },
      })),
    };
  
    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[invoiceAllMock, deleteMock]} cache={new InMemoryCache({ typePolicies })}>
          <List/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));
  
    await waitFor(() => screen.getByTestId('warrantiesCount'));
  
    expect(screen.queryByTestId('modal')).toBeFalsy();
    userEvent.click(screen.getByTestId('delete'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('deleteConfirm'));

    await waitFor(() => expect(deleteMock.result).toBeCalledTimes(1));

    unmount();
  });
});
