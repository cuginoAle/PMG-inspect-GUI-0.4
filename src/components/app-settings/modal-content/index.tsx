import { Cross1Icon, GearIcon, TrashIcon } from '@radix-ui/react-icons';
import toast from 'react-hot-toast';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
  TextField,
} from '@radix-ui/themes';
import { Cache } from '@/src/lib/indexeddb';
import styles from './style.module.css';
import { useGlobalState } from '@/src/app/global-state';

const ModalContent = ({
  onClose,
  onCacheCleared,
}: {
  onClose: () => void;
  onCacheCleared: () => void;
}) => {
  const { userName, unit } = useGlobalState((state) => state.userPreferences);
  const setUserPreferences = useGlobalState(
    (state) => state.setUserPreferences,
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Update global state with new preferences
    const newUserName = formData.get('user_name') as string;
    const newUnit = formData.get('unit_of_measure') as 'metric' | 'imperial';

    setUserPreferences({
      userName: newUserName,
      unit: newUnit,
    });

    // Persist preferences to localStorage
    const prefsToStore = {
      userName: newUserName,
      unit: newUnit,
    };
    window.localStorage.setItem(
      'userPreferences',
      JSON.stringify(prefsToStore),
    );

    onClose();
    toast.success('Preferences saved successfully!');
  };

  const handleClearCache = () => {
    Cache.deleteStore('projectDetails');
    onCacheCleared();
  };

  return (
    <form
      className={styles.modalContent}
      method="dialog"
      onSubmit={handleSubmit}
    >
      <IconButton
        onClick={onClose}
        size={'2'}
        variant="soft"
        className={styles.closeButton}
        type="button"
      >
        <Cross1Icon width={16} height={16} color="var(--gray-a12)" />
      </IconButton>
      <Flex align="center" gap="2">
        <GearIcon width={24} height={24} color="var(--gray-11)" />
        <Heading as="h2" size="4" weight="light">
          Settings
        </Heading>
      </Flex>

      <Separator orientation="horizontal" size={'4'} />

      <dl className={styles.settingList}>
        <div className={styles.settingItem}>
          <dt>
            <Text size="2">User name:</Text>
          </dt>
          <dd>
            <TextField.Root
              size="1"
              placeholder="Your name..."
              defaultValue={userName}
              style={{ width: '140px' }}
              name="user_name"
            />
          </dd>
        </div>
        <div className={styles.settingItem}>
          <dt>
            <Text size="2">Unit of measure:</Text>
          </dt>
          <dd>
            <select
              style={{ width: '140px' }}
              name={'unit_of_measure'}
              defaultValue={unit}
              key={unit} // to ensure re-render on change
            >
              <option value="imperial">Imperial</option>
              <option value="metric">Metric</option>
            </select>
          </dd>
        </div>
        <div className={styles.settingItem}>
          <dt>
            <Text size="2">Local cache:</Text>
          </dt>
          <dd>
            <Button
              variant="ghost"
              size="1"
              type="button"
              onClick={handleClearCache}
            >
              <Flex align="center" gap="2">
                <Text size={'1'}>Clear</Text>
                <TrashIcon />
              </Flex>
            </Button>
          </dd>
        </div>
      </dl>

      <Separator orientation="horizontal" size={'4'} />

      <Button variant="soft" color="green" size="2" onClick={onClose}>
        Save Settings
      </Button>
    </form>
  );
};

export { ModalContent };
