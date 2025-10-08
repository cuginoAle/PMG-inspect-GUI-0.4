import type { ResponseType } from '@/src/types/api';
import { LoadingToast, Warning } from '@/src/components';
import { sizeType } from '@/src/types';

const MySuspense = <T,>({
  children,
  data,
  loadingMessage = 'Loading...',
  loadingSize = 'small',
  errorTitle,
}: {
  children: React.ReactNode | ((data: T) => React.ReactNode);
  data?: ResponseType<T> | null;
  loadingMessage?: string;
  errorTitle?: string;
  loadingSize?: sizeType;
}) => {
  if (!data) {
    return null;
  }

  const isLoading = data?.status === 'loading';
  const isError = data?.status === 'error';
  const isOk = data?.status === 'ok';

  if (isLoading) {
    return (
      <div className="center">
        <LoadingToast size={loadingSize} message={loadingMessage} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="center">
        <Warning
          title={errorTitle}
          message={`${data.code} - ${data.detail.message}`}
        />
      </div>
    );
  }

  if (isOk) {
    return (
      <>{typeof children === 'function' ? children(data.detail) : children}</>
    );
  }

  return <Warning title="MySuspense" message="Unknown state!" />;
};

export { MySuspense };
