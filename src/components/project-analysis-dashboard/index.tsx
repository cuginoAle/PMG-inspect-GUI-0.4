'use client';
import { useGlobalState } from '@/src/app/global-state';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Project, ResponseType } from '@/src/types';
import { NetworkSettings, PresetsDropDown, Slider } from '@/src/components';
import { Button, Card, Flex } from '@radix-ui/themes';

import { DiscIcon, ResetIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import React from 'react';

const ProjectAnalysisDashboard = ({ className }: { className?: string }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const { selectedProject } = useGlobalState();
  const project = getResponseIfSuccesful<Project>(
    selectedProject.get({ noproxy: true }) as unknown as ResponseType<Project>,
  );

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
              form="project-analysis-dashboard-form" // to trigger form submit
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
              form="project-analysis-dashboard-form" // to trigger form reset
            >
              <ResetIcon />
              Reset
            </Button>
          </Flex>
        </Flex>

        <form
          id="project-analysis-dashboard-form"
          className={styles.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log(
              Object.fromEntries(new FormData(e.currentTarget).entries()),
            );
          }}
          onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
            if (e.target.getAttribute('type') !== 'checkbox') {
              setHasUnsavedChanges(true);
            }
          }}
          onReset={(e: React.FormEvent<HTMLFormElement>) => {
            const form = e.target as HTMLFormElement;

            // the reset event happens before the values are reset, so we need to wait a tick
            setTimeout(() => {
              Array.from(form.elements).forEach((el) => {
                // we need to dispatch the change event so that any React state updates
                // listening to the form elements get triggered
                el.dispatchEvent(new Event('change', { bubbles: true }));
              });
              setHasUnsavedChanges(false);
            }, 10);
          }}
        >
          <div className={styles.networksContainer}>
            <NetworkSettings name="Road" />
            <NetworkSettings name="Distress" />
            <NetworkSettings name="Weathering" />
            <NetworkSettings name="Treatment" />
          </div>

          <Card
            className="card"
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
