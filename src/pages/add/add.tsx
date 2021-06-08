import { ServerError } from '@apollo/client';
import { Loading } from 'components/Loading';
import { host } from 'config';
import { useLoadingOverlayContext } from 'contexts/LoadingOverlay';
import { useCreateInvoiceMutation, useUploadMutation } from 'generated/graphql';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Toast from 'react-bootstrap/Toast';
import { BsCheck, BsX } from 'react-icons/bs';
import styles from './add.module.scss';

const Add = () => {
  const [createInvoiceMutation, createInvoiceResult] = useCreateInvoiceMutation();
  const [uploadMutation, uploadResult] = useUploadMutation();
  const setIsLoading = useLoadingOverlayContext();
  const [showError, setShowError] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState('');

  React.useEffect(() => {
    setShowError(!!createInvoiceResult.error || !!uploadResult.error);
  }, [createInvoiceResult.error, uploadResult.error]);

  const errorMessage = React.useMemo(() => {
    for (const error of [createInvoiceResult.error, uploadResult.error]) {
      if (error) {
        console.error(error);
        if (error.networkError?.name === 'ServerError') {
          const serverError = error.networkError as ServerError;
          return serverError.result.errors.map((e: Record<string, string>) => e.message).join('\n') as string;
        }
      }
    }

    return null;
  }, [createInvoiceResult.error, uploadResult.error]);

  const imagePreview = React.useMemo(() => {
    if (uploadResult.loading) {
      return <Loading/>
    }
    if (uploadResult.data) {
      return <img alt="Uploaded" src={uploadResult.data.upload} className={styles.image} />
    }
    return null;
  }, [uploadResult.loading, uploadResult.data]);

  React.useEffect(() => {
    setIsLoading(createInvoiceResult.loading);
  }, [createInvoiceResult.loading, setIsLoading]);

  const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as any;
    try {
      await createInvoiceMutation({
        variables: {
          data: {
            photo: photoUrl,
            item: form.elements.name.value,
            duration: form.elements.duration.value.length > 0 ? Number(form.elements.duration.value) : null,
            purchase: form.elements.date.value.length > 0 ? form.elements.date.value : null,
          },
        },
      });
    } catch {}
    await createInvoiceResult.client.clearStore();
  }, [createInvoiceMutation, createInvoiceResult.client, photoUrl]);

  const handlePhotoChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files || event.currentTarget.files.length === 0) {
      return;
    }

    try {
      const { data } = await uploadMutation({
        variables: {
          file: event.currentTarget.files[0],
        },
      });

      if (data) {
        setPhotoUrl(`${host}${data.upload}`);
      }
    } catch {}
  }, [uploadMutation]);

  const handleCloseError = React.useCallback(() => {
    setShowError(false);
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Navbar bg="secondary" variant="dark">
          <Nav className="ml-auto">
            <Button variant="success" type="submit" className="mr-sm-2">
              <BsCheck/>
            </Button>
            <Button variant="danger">
              <BsX/>
            </Button>
            </Nav>
        </Navbar>

        <Container fluid="sm" className="my-sm-4">
          <Form.Group controlId="invoice">
            <Form.File
              label="Invoice photo"
              required
              onChange={handlePhotoChange}
            />
            <div className={styles.imagePreviewWrapper}>
              {imagePreview}
            </div>
          </Form.Group>

          <Form.Group controlId="name">
            <Form.Label>Item name</Form.Label>
            <Form.Control
              type="text"
              maxLength={255}
              placeholder="Item name"
              required
            />
          </Form.Group>

          <Form.Group controlId="duration">
            <Form.Label>Warranty duration</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Warranty duration"
            />
          </Form.Group>

          <Form.Group controlId="date">
            <Form.Label>Purchase date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Purchase date"
            />
          </Form.Group>
        </Container>
      </Form>
      <Toast show={showError} onClose={handleCloseError}>
        <Toast.Header>
          <strong className="mr-auto">{createInvoiceResult.error?.message || uploadResult.error?.message}</strong>
        </Toast.Header>
        <Toast.Body>{errorMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default Add;
