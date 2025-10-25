'use client';
import { useGlobalState } from '@/src/app/global-state';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import {
  DummyAnalysisResult,
  InferenceTypes,
  Project,
  ResponseType,
} from '@/src/types';
import {
  AddNetworkButton,
  NetworkSelector,
  NetworkSettings,
  PresetsDropDown,
  Slider,
} from '@/src/components';
import { Button, Card, Flex } from '@radix-ui/themes';

import { DiscIcon, ResetIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import React from 'react';
import { useModal } from '@/src/app/hooks/useModal';

type ProjectAnalysisDashboardProps = {
  setting: DummyAnalysisResult;
  className?: string;
  hasUnsavedChanges?: boolean;
  onChange?: (data: FormData) => void;
  onSave?: (data: FormData) => void;
  onReset?: (id: string) => void;
};

const ProjectAnalysisDashboard = ({
  setting,
  className,
  hasUnsavedChanges,
  onChange,
  onReset,
  onSave,
}: ProjectAnalysisDashboardProps) => {
  const selectedProjectData = useGlobalState((state) => state.selectedProject);
  const inferenceModelDictionary = useGlobalState(
    (state) => state.inferenceModelDictionary,
  );
  const processingConfigurationsData = useGlobalState(
    (state) => state.processingConfigurations,
  );

  const processingConfigurationsValue = getResponseIfSuccesful(
    processingConfigurationsData,
  );
  const project = getResponseIfSuccesful<Project>(
    selectedProjectData as unknown as ResponseType<Project>,
  );
  const [networks, setNetworks] = React.useState<
    DummyAnalysisResult['setting_details']
  >(setting?.setting_details || []);

  const [Dialog, dialogRef] = useModal();

  const inferenceModelDictionaryValue = inferenceModelDictionary;

  const formId = `project-analysis-dashboard-form-${setting.setting_id}`;

  const onAddNetwork = () => {
    dialogRef.current?.showModal();
  };

  return project?.project_name ? (
    <div className={className}>
      <Flex direction={'column'} gap={'4'}>
        <Flex align="center" justify={'between'}>
          <PresetsDropDown
            onSelect={(preset) => {
              const baseNetwork =
                processingConfigurationsValue!.processing_configurations[
                  preset
                ];

              setNetworks(
                Object.keys(baseNetwork.inferences).map((key) => ({
                  network_name: key,
                  inference_model_id:
                    baseNetwork.inferences[key]!.inference_model_id,
                  inference_model_parameters:
                    baseNetwork.inferences[key]!.inference_model_parameters,
                })),
              );
              const data = new FormData();
              data.append('setting_id', setting.setting_id);
              data.append('setting_label', baseNetwork.label);

              onChange?.(data);
              // onReset?.(setting.setting_id);
              console.log('Networks:', networks);
            }}
          />

          <Dialog>
            <NetworkSelector
              onClose={() => dialogRef.current?.close()}
              availableNetworks={Object.keys(
                inferenceModelDictionaryValue || {},
              )}
              selectedNetworks={networks.map((n) => n.network_name)}
              onSelect={(networkName) => {
                const networkConfig =
                  processingConfigurationsValue?.processing_configurations?.[
                    networkName as InferenceTypes
                  ];

                setNetworks((prev) => [
                  ...prev,
                  {
                    network_name: networkName,
                    // default to the first model if available
                    inference_model_id:
                      inferenceModelDictionaryValue?.[
                        networkName as InferenceTypes
                      ]?.[0] || '',
                    // default parameters
                    inference_model_parameters: {
                      confidence: 0.5,
                      iou: 0.5,
                    },
                    ...networkConfig,
                  },
                ]);
                dialogRef.current?.close();
              }}
            />
          </Dialog>

          <Flex gap="3">
            <Button
              type="submit"
              size="3"
              color="green"
              variant="soft"
              disabled={!hasUnsavedChanges}
              form={formId} // to trigger form submit
            >
              <DiscIcon />
              Save
            </Button>

            <Button
              type="reset"
              size="3"
              variant="soft"
              color="orange"
              disabled={!hasUnsavedChanges}
              form={formId} // to trigger form reset
            >
              <ResetIcon />
              Reset
            </Button>
          </Flex>
        </Flex>

        <form
          id={formId}
          className={styles.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            onSave?.(new FormData(e.currentTarget));
          }}
          onChange={(e: React.FormEvent<HTMLFormElement>) => {
            onChange?.(new FormData(e.currentTarget));
          }}
          onReset={(e: React.FormEvent<HTMLFormElement>) => {
            const form = e.target as HTMLFormElement;

            // the reset event happens before the values are reset, so we need to wait a tick
            setTimeout(() => {
              Array.from(form.elements).forEach((el) => {
                // we need to dispatch the change event so that any React state updates
                // listening to the form elements get triggered
                if (
                  el.tagName === 'INPUT' &&
                  el.getAttribute('type') === 'checkbox'
                ) {
                  // for checkboxes, we need to dispatch a click event to toggle the checked state 🤬
                  el.dispatchEvent(new Event('click', { bubbles: true }));
                } else {
                  el.dispatchEvent(new Event('change', { bubbles: true }));
                }
              });
              onReset?.(setting.setting_id);
            }, 10);
          }}
        >
          <input type="hidden" name="setting_id" value={setting.setting_id} />
          <div className={styles.networksContainer}>
            {networks.map((network) => (
              <NetworkSettings
                key={network.network_name}
                name={network.network_name}
                inference={{
                  inference_model_id: network.inference_model_id,
                  inference_model_parameters: {
                    confidence: network.inference_model_parameters.confidence,
                    iou: network.inference_model_parameters.iou,
                  },
                }}
                models={[
                  ...(inferenceModelDictionaryValue?.[
                    network.network_name as InferenceTypes
                  ] || []),
                ]}
              />
            ))}
            {networks.length !==
              Object.keys(inferenceModelDictionaryValue || {}).length && (
              <AddNetworkButton onClick={onAddNetwork} />
            )}
          </div>

          <Card
            className="card-bg"
            style={{ width: 'clamp(200px, calc(50% - var(--space-2)), 50%)' }}
          >
            <Slider
              min={1}
              max={10}
              step={0.5}
              name="sampling-rate"
              title="Sampling rate"
              defaultValue={5}
              valueLabel={(val) => `1 frame / ${val.toFixed(1)}m`}
            />
          </Card>
        </form>
      </Flex>
    </div>
  ) : null;
};

export { ProjectAnalysisDashboard };
