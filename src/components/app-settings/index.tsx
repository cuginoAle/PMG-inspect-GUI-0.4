'use client';
import { GearIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import styles from './style.module.css';
import { useModal } from '@/src/app/hooks/useModal';
import { ModalContent } from './modal-content';
import toast from 'react-hot-toast';

const AppSettings = () => {
  const [Modal, modalRef] = useModal();

  const handleCacheCleared = () => {
    modalRef.current?.close();
    toast.success('Cache cleared successfully!');
  };

  return (
    <>
      <IconButton
        variant="soft"
        size="3"
        title="Settings"
        onClick={() => modalRef.current?.showModal()}
        className={styles.root}
      >
        <GearIcon width={24} height={24} />
      </IconButton>
      <Modal>
        <ModalContent
          onClose={() => modalRef.current?.close()}
          onCacheCleared={handleCacheCleared}
        />
      </Modal>
    </>
  );
};

export { AppSettings };
