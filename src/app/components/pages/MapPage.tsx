import { Layout } from '../Layout';
import { SeoulMap } from '../SeoulMap';

export function MapPage() {
  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">서울 지도</h1>
        <SeoulMap />
      </div>
    </Layout>
  );
}
