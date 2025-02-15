declare module 'react-to-print' {
  import { ComponentType } from 'react';

  interface ReactToPrintProps {
    trigger: () => JSX.Element;
    content: () => any;
    pageStyle?: string;
    onBeforeGetContent?: () => Promise<void>;
    onAfterPrint?: () => void;
    removeAfterPrint?: boolean;
  }

  const ReactToPrint: ComponentType<ReactToPrintProps>;

  export default ReactToPrint;
}
