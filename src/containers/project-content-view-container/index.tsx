import { useGlobalState } from '@/src/app/global-state';
import { MySuspense, ProjectTabbedView } from '@/src/components';

const ProjectContentViewContainer = () => {
  const { analysisResults, processingConfigurations } = useGlobalState();

  return (
    <MySuspense
      loadingMessage="Loading processing configurations..."
      loadingSize="large"
      data={processingConfigurations.get()}
    >
      {(processingData) => (
        <MySuspense
          data={analysisResults.get()}
          errorTitle="Analysis results"
          loadingMessage="Loading analysis results..."
          loadingSize="large"
        >
          {(analysisData) => (
            <ProjectTabbedView
              processingData={processingData}
              analysisData={analysisData}
            />
          )}
        </MySuspense>
      )}
    </MySuspense>
  );
};

export { ProjectContentViewContainer };
