import { Layout } from '../Layout';
import { ChargeMoney } from '../ChargeMoney';

export function ChargePage() {
  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ChargeMoney />
      </div>
    </Layout>
  );
}
