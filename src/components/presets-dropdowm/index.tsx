import {
  ExclamationTriangleIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';
import { DropdownMenu, Button, Spinner } from '@radix-ui/themes';
import styles from './style.module.css';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';

const LabelStateMap = {
  ok: (
    <Button variant="soft" size={'3'}>
      <MixerHorizontalIcon width={20} height={20} />
      Load a preset
    </Button>
  ),
  error: (
    <Button variant="soft" size={'3'} disabled>
      <ExclamationTriangleIcon color="orange" />
      Error loading presets
    </Button>
  ),
  loading: (
    <Button variant="soft" size={'3'} disabled>
      <Spinner size={'2'} />
      Loading...
    </Button>
  ),
};

const PresetsDropDown = () => {
  const { processingConfigurations } = useGlobalState();
  const processingConfigurationsFetchState = processingConfigurations.get();
  const processingConfigurationsValue = getResponseIfSuccesful(
    processingConfigurationsFetchState,
  );

  const presets =
    processingConfigurationsValue?.processing_configurations || {};

  return (
    <div className={styles.root}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          disabled={processingConfigurationsFetchState?.status !== 'ok'}
        >
          {
            LabelStateMap[
              processingConfigurationsFetchState?.status || 'loading'
            ]
          }
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {Object.keys(presets).map((key) => (
            <DropdownMenu.Item key={key}>
              {presets[key]?.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export { PresetsDropDown };
