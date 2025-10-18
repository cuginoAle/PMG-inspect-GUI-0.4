import { useGlobalState } from '@/src/app/global-state';
import {
  MySuspense,
  NoProjectSelected,
  ProjectTabbedView,
} from '@/src/components';

const ProjectContentViewContainer = () => {
  const analysisResults = useGlobalState((state) => state.analysisResults);
  const processingConfigurations = useGlobalState(
    (state) => state.processingConfigurations,
  );

  return (
    <MySuspense
      loadingMessage="Loading processing configurations..."
      loadingSize="large"
      data={processingConfigurations}
      errorTitle="Processing configurations"
    >
      {(processingData) => {
        return (
          <MySuspense
            data={analysisResults}
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
