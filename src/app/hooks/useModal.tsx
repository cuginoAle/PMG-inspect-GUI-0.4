import { ReactNode, RefObject, useRef } from 'react';

type DialogProps = {
  children: ReactNode;
} & React.HTMLProps<HTMLDialogElement>;

type UseDialogReturn = [
  (props: DialogProps) => ReactNode,
  RefObject<HTMLDialogElement | null>,
];

const useModal = (): UseDialogReturn => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const Dialog = ({
    children,
    className,
    ...rest
  }: React.HTMLProps<HTMLDialogElement>): ReactNode => (
    <dialog ref={dialogRef} className={className} {...rest}>
      {children}
    </dialog>
  );

  return [Dialog, dialogRef];
};

export { useModal };
export type { DialogProps, UseDialogReturn };
