import { compile } from '@fileforge/react-print';

async function Utils(Component: any) {
  await compile(<Component />);
}

export default Utils;
