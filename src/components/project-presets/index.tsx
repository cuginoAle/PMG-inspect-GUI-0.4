import { MixerHorizontalIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Select } from '@radix-ui/themes';

const ProjectPresets = () => {
  return (
    <Flex align="center" gap="2">
      <MixerHorizontalIcon width={20} height={20} color="var(--amber-a9)" />
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

      <IconButton variant="soft" color="amber" size="3" aria-label="Add preset">
        <DotsVerticalIcon />
      </IconButton>
    </Flex>
  );
};

export { ProjectPresets };
