import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openModal = (modalContent) => {
    setIsOpen(true);
    setContent(modalContent);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return { isOpen, content, openModal, closeModal };
};

export default useModal;

