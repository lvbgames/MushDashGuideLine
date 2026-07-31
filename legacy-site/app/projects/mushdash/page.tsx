import MushDashDetail from './MushDashDetail';

export async function generateStaticParams() {
  return [
    { },
  ];
}

export default function MushDashPage() {
  return <MushDashDetail />;
}