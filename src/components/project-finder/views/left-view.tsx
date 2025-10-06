import { ProjectsTreeViewContainer } from '@/src/containers/projects-tree-view-container';
import styles from './style.module.css';

const Left = () => {
  return (
    <div className={styles.leftView}>
      <ProjectsTreeViewContainer />
    </div>
  );
};

export { Left };
