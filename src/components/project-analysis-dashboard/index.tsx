'use client';
import { useGlobalState } from '@/src/app/global-state';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { InferenceTypes, Project, ResponseType } from '@/src/types';
import {
  NetworkSettings,
  PresetsDropDown,
  Slider,
  Tab,
} from '@/src/components';
import { Button, Card, Flex } from '@radix-ui/themes';

import { DiscIcon, ResetIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import React from 'react';

type ProjectAnalysisDashboardProps = {
  setting: Tab;
  className?: string;
  hasUnsavedChanges?: boolean;
  onChange?: (id: string) => void;
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
  const { selectedProject, inferenceModelDictionary } = useGlobalState();
  const project = getResponseIfSuccesful<Project>(
    selectedProject.get({ noproxy: true }) as unknown as ResponseType<Project>,
  );

  const formId = `project-analysis-dashboard-form-${setting.id}`;

  return project?.project_name ? (
    <div className={className}>
      <Flex direction={'column'} gap={'4'}>
        <Flex align="center" justify={'between'}>
          <PresetsDropDown />

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
          onChange={() => {
            onChange?.(setting.id);
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
              onReset?.(setting.id);
            }, 10);
          }}
        >
          <div className={styles.networksContainer}>
            {Object.keys(setting.inferences).map((inferenceId) => (
              <NetworkSettings
                key={inferenceId}
                name={inferenceId}
                inference={
                  setting.inferences[
                    inferenceId as keyof typeof setting.inferences
                  ]
                }
                models={[
                  ...(inferenceModelDictionary.get()?.[
                    inferenceId as InferenceTypes
                  ] || []),
                ]}
                // isDefaultEnabled={
                //   setting.inferences[
                //     inferenceId as keyof typeof setting.inferences
                //   ].is_enabled
                // }
              />
            ))}
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
