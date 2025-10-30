import { useGlobalState } from '@/src/app/global-state';
import { TransformIcon } from '@radix-ui/react-icons';
import { Flex, IconButton } from '@radix-ui/themes';

const LinkMapAndTableBtn = () => {
  const setLinkMapAndTable = useGlobalState(
    (state) => state.setLinkMapAndTable,
  );
  const linkMapAndTable = useGlobalState((state) => state.linkMapAndTable);

  return (
    <Flex align="center" gap="2">
      <IconButton
        type="button"
        variant={linkMapAndTable ? 'solid' : 'soft'}
        color={linkMapAndTable ? 'amber' : 'gray'}
        onClick={() => {
          setLinkMapAndTable(!linkMapAndTable);
        }}
        title="Link Map and Table content"
      >
        <TransformIcon />
      </IconButton>
    </Flex>
  );
};

export { LinkMapAndTableBtn };
