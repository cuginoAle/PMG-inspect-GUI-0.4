import { NeuralNetworkIcon } from 'src/components';
import styles from './style.module.css';
import { IconButton, Text } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';

type NetworkSelectorProps = {
  availableNetworks: string[];
  selectedNetworks: string[];
  onClose?: () => void;
  onSelect?: (networkName: string) => void;
};

const NetworkSelector = ({
  availableNetworks,
  selectedNetworks,
  onClose,
  onSelect,
}: NetworkSelectorProps) => {
  const itemsToShow = availableNetworks.filter(
    (n) => !selectedNetworks.includes(n),
  );

  return (
    <div className={styles.networkSelector}>
      <div className={styles.header}>
        <NeuralNetworkIcon size={2} />
        <Text size={'5'} weight="light">
          Add a neural network
        </Text>
        <IconButton
          className={styles.closeButton}
          variant="soft"
          onClick={onClose}
        >
          <Cross2Icon />
        </IconButton>
      </div>

      <ul className={styles.networkList}>
        {itemsToShow.map((network) => (
          <li key={network}>
            <button
              className={styles.networkButton}
              onClick={() => onSelect?.(network)}
            >
              {network}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { NetworkSelector };
