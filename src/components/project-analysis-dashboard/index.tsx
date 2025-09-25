import { useGlobalState } from '@/src/app/global-state';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Project, ResponseType } from '@/src/types';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { useSearchParams } from 'next/navigation';
import { FileLogoTitle } from '@/src/components/file-logo-title';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useMemo } from 'react';
import { Button, Flex, IconButton, Select } from '@radix-ui/themes';
import { NetworkSettings } from 'components/n-network-settings';
import {
  Cross2Icon,
  DiscIcon,
  DotsVerticalIcon,
  MixerHorizontalIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import styles from './style.module.css';
import React from 'react';
import { Slider } from 'components/slider';

const ProjectAnalysisDashboard = ({ className }: { className?: string }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const sp = useSearchParams();
  const { selectedProject } = useGlobalState();
  const project = getResponseIfSuccesful<Project>(
    selectedProject.get({ noproxy: true }) as unknown as ResponseType<Project>,
  );

  const fileType = useMemo(() => getFileIconType(sp.get('path') || ''), [sp]);
  const label = useMemo(() => removeFileExtension(sp.get('path') || ''), [sp]);

  return project?.project_name ? (
    <div className={className}>
      <Flex direction={'column'} gap={'4'}>
        <Flex align="center" gap="2" justify={'between'}>
          <FileLogoTitle
            as="div"
            fileType={fileType}
            label={label}
            size="medium"
            componentId="project-analysis-dashboard-file-title"
          />

          <Flex align="center" gap="2">
            <MixerHorizontalIcon
              width={20}
              height={20}
              color="var(--amber-a9)"
            />
            <Select.Root size={'3'} defaultValue="setting-01">
              <Select.Trigger color="amber" variant="soft" />

              <Select.Content position="popper" align="start">
                <Select.Group>
                  <Select.Item value="setting-01">Setting 01</Select.Item>
                  <Select.Item value="setting-02">Setting 02</Select.Item>
                  <Select.Item value="setting-03">Setting 03</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>

            <IconButton
              variant="soft"
              color="amber"
              size="3"
              aria-label="Add preset"
            >
              <DotsVerticalIcon />
            </IconButton>
          </Flex>
        </Flex>

        <form
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

          <Flex gap="3" justify={'end'}>
            <div style={{ width: '300px', marginRight: 'auto' }}>
              <Slider
                min={1}
                max={10}
                step={0.5}
                name="sampling-rate"
                title="Sampling rate"
                defaultValue={5}
                valueLabel={(val) => `1 frame / ${val.toFixed(1)}m`}
              />
            </div>
            <Button
              className={styles.runAnalysisButton}
              type="button"
              size={'3'}
              color="blue"
              variant="soft"
            >
              <RocketIcon /> Run analysis
            </Button>
            <div
              style={{
                width: '3px',
                margin: '0 8px',
                backgroundColor: 'var(--gray-a5)',
              }}
            />
            <Button
              type="submit"
              size="3"
              color="green"
              variant="soft"
              disabled={!hasUnsavedChanges}
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
            >
              <Cross2Icon />
              Reset
            </Button>
          </Flex>
        </form>
      </Flex>
    </div>
  ) : null;
};

export { ProjectAnalysisDashboard };
