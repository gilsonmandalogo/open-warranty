import { Loading } from 'components/Loading';
import { useInvoiceAllQuery } from 'generated/graphql';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { BsArrowRepeat } from 'react-icons/bs';
import styles from './list.module.scss';

const List = () => {
  const invoiceQuery = useInvoiceAllQuery();
  const [dataPage, setDataPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);

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
      <td>TBD</td>
      <td width="25%">
        <ProgressBar striped max={1} now={item.progress || 0} variant={(item.progress || 0) >= 1 ? 'danger' : 'primary'}/>
      </td>
    </tr>
  )), [invoiceQuery.data?.invoiceAll.items]);

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
  );
};

export default List;
