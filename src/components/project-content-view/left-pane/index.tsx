import { Flex } from '@radix-ui/themes';
import { FileLogoTitle, PresetsTabs, Tab } from '@/src/components';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { PresetsTabsContent } from './presets-tabs-content';

// this should come from global state
const dummyTabs: Tab[] = [
  { id: 'PCI_01', label: 'PCI 1.0', values: [] },
  { id: 'PCI_02', label: 'PCI 2.0', values: [] },
  { id: 'Custom', label: 'Custom', values: [] },
];

const LeftPane = () => {
  const [tabs, setTabs] = React.useState<Tab[]>(dummyTabs);

  const sp = useSearchParams();
  const projectPath = sp.get('path') || '';

  const fileType = useMemo(() => getFileIconType(projectPath), [projectPath]);
  const label = useMemo(() => removeFileExtension(projectPath), [projectPath]);

  const handleOnChange = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;
    if (tab.hasUnsavedChanges) return;

    setTabs((prevTabs) =>
      prevTabs.map((tab) => ({
        ...tab,
        hasUnsavedChanges: tab.id === tabId ? true : tab.hasUnsavedChanges,
      })),
    );
  };

  return (
    <Flex direction={'column'} gap={'6'} height={'100%'}>
      {projectPath && (
        <FileLogoTitle
          as="div"
          fileType={fileType}
          label={label}
          size="medium"
          componentId="project-analysis-dashboard-file-title"
        />
      )}

      <PresetsTabs tabs={tabs} />
      <PresetsTabsContent tabs={tabs} onChange={handleOnChange} />
    </Flex>
  );
};

export { LeftPane };
