import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vaquita - DeFi Savings Game',
  description: 'Join the Vaquita ecosystem and start earning rewards through DeFi savings',
  openGraph: {
    title: 'Vaquita - DeFi Savings Game',
    description: 'Join the Vaquita ecosystem and start earning rewards through DeFi savings',
    images: ['/vaquita/share.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: "https://miniapp.vaquita.fi/vaquita/og.png",
      button: {
        title: "Play, save, earn rewards",
        action: {
          type: "launch_miniapp",
          url: "/",
          name: "Vaquita",
          splashImageUrl: "/logo_vaquita.png",
          splashBackgroundColor: "#f5f0ec"
        }
      }
    }),
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: "https://miniapp.vaquita.fi/vaquita/og.png",
      button: {
        title: "Play, save, earn rewards",
        action: {
          type: "launch_frame",
          url: "https://miniapp.vaquita.fi/",
          name: "Vaquita",
          splashImageUrl: "https://miniapp.vaquita.fi/logo.png",
          splashBackgroundColor: "#F5A161"
        }
      }
    })
  }
};

export default function SharePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <img 
          src="/logo_vaquita.png" 
          alt="Vaquita Logo" 
          className="w-24 h-24 mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Vaquita
        </h1>
        <p className="text-gray-600 mb-6">
          Join the DeFi savings game and start earning rewards while protecting the environment.
        </p>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🌱 Eco-Friendly</h3>
            <p className="text-sm text-green-700">
              Every deposit helps protect the Vaquita porpoise and marine ecosystems.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">💰 Earn Rewards</h3>
            <p className="text-sm text-blue-700">
              Get competitive APY on your savings with flexible lock periods.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">🎮 Gamified</h3>
            <p className="text-sm text-purple-700">
              Explore different worlds and compete on the leaderboard.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200"
          >
            🐋 Start Your Journey
          </a>
        </div>
      </div>
    </div>
  );
}
