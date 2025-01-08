import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import CreateContractModal from './CreateContractModal';

const Contracts = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>

      <CreateContractModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default Contracts;
