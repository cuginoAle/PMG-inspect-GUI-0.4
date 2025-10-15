import { useGlobalState } from '@/src/app/global-state';
import {
  MySuspense,
  NoProjectSelected,
  ProjectTabbedView,
} from '@/src/components';

const ProjectContentViewContainer = () => {
  const { analysisResults, processingConfigurations } = useGlobalState();

  return (
    <MySuspense
      loadingMessage="Loading processing configurations..."
      loadingSize="large"
      data={processingConfigurations.get()}
      errorTitle="Processing configurations"
    >
      {(processingData) => {
        return (
          <MySuspense
            data={analysisResults.get()}
            errorTitle="Analysis results"
            loadingMessage="Loading analysis results..."
            loadingSize="large"
            undefinedDataComponent={<NoProjectSelected />}
          >
            {(analysisData) => (
              <ProjectTabbedView
                processingData={processingData}
                analysisData={analysisData}
              />
            )}
          </MySuspense>
        );
      }}
    </MySuspense>
  );
};

export { ProjectContentViewContainer };
