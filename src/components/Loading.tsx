import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export const Loading = () => (
  <div className="d-flex justify-content-center align-items-center m-sm-4">
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>
);
