import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingOverlayProvider } from 'contexts/LoadingOverlay';
import { CreateInvoiceDocument, UploadDocument } from 'generated/graphql';
import React from 'react';
import typePolicies from 'typePolicies';
import Add from './add';

describe('"add" page', () => {
  it('submit the form with all data', async () => {
    const uploadMutationMock = {
      request: {
        query: UploadDocument,
        variables: { file: new File(['(⌐□_□)'], 'example-file.png', { type: 'image/png' }) },
      },
      result: {
        data: {
          upload: '/images/1624317650865.png',
        },
      },
    };

    const createInvoiceMutationMock = {
      request: {
        query: CreateInvoiceDocument,
        variables: {
          data: {
            photo: uploadMutationMock.result.data.upload,
            item: 'Test item',
            duration: 24,
            purchase: '2021-06-22',
          },
        },
      },
      result: jest.fn(() => ({
        data: {
          createInvoice: {
            id: '1',
          },
        },
      })),
    };

    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[createInvoiceMutationMock, uploadMutationMock]} cache={new InMemoryCache({ typePolicies })}>
          <Add/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));

    userEvent.upload(screen.getByTestId('fieldPhoto'), uploadMutationMock.request.variables.file);

    await waitFor(() => screen.getByAltText('Uploaded'));

    expect((screen.getByAltText('Uploaded') as HTMLImageElement).src).toBe(`${window.location.origin}${uploadMutationMock.result.data.upload}`);

    userEvent.type(screen.getByTestId('fieldItemName'), createInvoiceMutationMock.request.variables.data.item);
    userEvent.type(screen.getByTestId('fieldWarrantyDuration'), createInvoiceMutationMock.request.variables.data.duration.toString());
    userEvent.type(screen.getByTestId('fieldPurchaseDate'), createInvoiceMutationMock.request.variables.data.purchase);
    userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => expect(createInvoiceMutationMock.result).toHaveBeenCalledTimes(1));

    unmount();
  });

  it('submit the form with required data', async () => {
    const uploadMutationMock = {
      request: {
        query: UploadDocument,
        variables: { file: new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }) },
      },
      result: {
        data: {
          upload: '/images/1624317650865.png',
        },
      },
    };

    const createInvoiceMutationMock = {
      request: {
        query: CreateInvoiceDocument,
        variables: {
          data: {
            photo: uploadMutationMock.result.data.upload,
            item: 'Test item',
            duration: null,
            purchase: null,
          },
        },
      },
      result: jest.fn(() => ({
        data: {
          createInvoice: {
            id: '1',
          },
        },
      })),
    };

    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[createInvoiceMutationMock, uploadMutationMock]} cache={new InMemoryCache({ typePolicies })}>
          <Add/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));

    userEvent.upload(screen.getByTestId('fieldPhoto'), uploadMutationMock.request.variables.file);

    await waitFor(() => screen.getByAltText('Uploaded'));

    expect((screen.getByAltText('Uploaded') as HTMLImageElement).src).toBe(`${window.location.origin}${uploadMutationMock.result.data.upload}`);

    userEvent.type(screen.getByTestId('fieldItemName'), createInvoiceMutationMock.request.variables.data.item);
    userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => expect(createInvoiceMutationMock.result).toHaveBeenCalledTimes(1));

    unmount();
  });

  it('not submit the form without required data', async () => {
    const { unmount } = render((
      <LoadingOverlayProvider>
        <MockedProvider mocks={[]} cache={new InMemoryCache({ typePolicies })}>
          <Add/>
        </MockedProvider>
      </LoadingOverlayProvider>
    ));

    expect(screen.getByTestId('form')).toBeInvalid();

    unmount();
  });
});
