import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalBox } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default function Modal(props) {
  const handleBackDropClick = e => {
    if (e.currentTarget === e.target) {
      props.onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [props]);

  const { largeImageURL } = props;

  return createPortal(
    <Overlay onClick={handleBackDropClick}>
      <ModalBox>
        <img src={largeImageURL} alt="" />
      </ModalBox>
    </Overlay>,
    modalRoot
  );
}
