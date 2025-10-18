import {
  ExclamationTriangleIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';
import { DropdownMenu, Button, Spinner } from '@radix-ui/themes';
import styles from './style.module.css';
import { useGlobalState } from '@/src/app/global-state';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { InferenceTypes } from '@/src/types';

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

const PresetsDropDown = ({
  onSelect,
}: {
  onSelect: (preset: InferenceTypes) => void;
}) => {
  const processingConfigurationsFetchState = useGlobalState(
    (state) => state.processingConfigurations,
  );
  const processingConfigurationsValue = getResponseIfSuccesful(
    processingConfigurationsFetchState,
  );

  if (!processingConfigurationsValue) return null;
  const presets = processingConfigurationsValue.inference_configurations;

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
          {(Object.keys(presets) as InferenceTypes[]).map((key) => (
            <DropdownMenu.Item key={key} onSelect={() => onSelect(key)}>
              {presets[key]?.inference_model_name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
};

export { PresetsDropDown };
