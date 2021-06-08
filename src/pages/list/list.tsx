import { Loading } from 'components/Loading';
import { useLoadingOverlayContext } from 'contexts/LoadingOverlay';
import { InvoiceAllResult, useDeleteInvoiceMutation, useInvoiceAllQuery } from 'generated/graphql';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import { BsArrowRepeat, BsImage, BsPencilSquare, BsTrash } from 'react-icons/bs';
import styles from './list.module.scss';

type ItemToDelete = Pick<InvoiceAllResult, 'id' | 'item'>;

const List = () => {
  const invoiceQuery = useInvoiceAllQuery();
  const [deleteInvoiceMutation, deleteInvoiceResult] = useDeleteInvoiceMutation();
  const [dataPage, setDataPage] = React.useState(1);
  const [itemToDelete, setItemToDelete] = React.useState<ItemToDelete | null>(null);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const setIsLoading = useLoadingOverlayContext();

  React.useEffect(() => {
    setIsLoading(deleteInvoiceResult.loading);
  }, [deleteInvoiceResult.loading, setIsLoading]);

  const handleLoadMore = React.useCallback(async () => {
    setLoadingMore(true);
    await invoiceQuery.fetchMore({
      variables: {
        skip: dataPage * 10,
      },
    });
    setLoadingMore(false);
    setDataPage(dataPage + 1);
  }, [invoiceQuery, dataPage]);

  const handleDelete = React.useCallback(async (item: ItemToDelete) => {
    await deleteInvoiceMutation({
      variables: {
        id: item.id,
      },
    });
    await invoiceQuery.client.resetStore();
    await invoiceQuery.refetch();
  }, [invoiceQuery, deleteInvoiceMutation]);

  const handleCloseDeleteModal = React.useCallback((item?: ItemToDelete | null) => () => {
    if (item) {
      handleDelete(item);
    }
    setItemToDelete(null);
  }, [handleDelete]);

  const handleOpenDeleteModal = React.useCallback((item: ItemToDelete) => () => {
    setItemToDelete(item);
  }, []);

  const warrantiesCount = React.useMemo(() => {
    if (invoiceQuery.loading) {
      return (
        <div className={styles.loadingWrapper}>
          <Loading/> Loading...
        </div>
      )
    }

    return (
      <p className={styles.countWrapper}>
        {invoiceQuery.data?.invoiceAll.total} warranties
      </p>
    )
  }, [invoiceQuery.loading, invoiceQuery.data?.invoiceAll.total]);

  const items = React.useMemo(() => invoiceQuery.data?.invoiceAll.items.map(item => (
    <tr key={item.id}>
      <td>{item.item}</td>
      <td>{item.expDate}</td>
      <td>
        <BsImage className="mr-sm-2"/>
        <OverlayTrigger overlay={<Tooltip id="tooltip-edit">Edit</Tooltip>}>
          <BsPencilSquare className="mr-sm-2"/>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip id="tooltip-delete">Delete</Tooltip>}>
          <BsTrash onClick={handleOpenDeleteModal(item)}/>
        </OverlayTrigger>
      </td>
      <td width="25%">
        <ProgressBar striped max={1} now={item.progress || 0} variant={(item.progress || 0) >= 1 ? 'danger' : 'primary'}/>
      </td>
    </tr>
  )), [invoiceQuery.data?.invoiceAll.items, handleOpenDeleteModal]);

  const loadMoreButton = React.useMemo(() => {
    const innerButton = loadingMore ? (
        <><Spinner animation="border" role="status" size="sm" className="mr-sm-2"/> Loading more...</>
      ) : (
        <><BsArrowRepeat size={24} className="mr-sm-2"/>Load more</>
      );

      return (
        <Button className="d-flex align-items-center" disabled={!invoiceQuery.data?.invoiceAll.hasMore || loadingMore} onClick={handleLoadMore}>
          {innerButton}
        </Button>
      );
  }, [invoiceQuery.data?.invoiceAll.hasMore, loadingMore, handleLoadMore]);

  return (
    <>
      <Container fluid="sm" className="my-sm-4">
        {warrantiesCount}
        {!invoiceQuery.loading && (
          <div className="d-flex flex-column align-items-center">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Exp date</th>
                  <th>Actions</th>
                  <th>Progress to expire</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </Table>
            {loadMoreButton}
          </div>
        )}
      </Container>
      <Modal show={!!itemToDelete} onHide={handleCloseDeleteModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Delete confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete "{itemToDelete?.item}"?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseDeleteModal(itemToDelete)}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCloseDeleteModal()}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default List;
