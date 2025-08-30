import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-green-50 border-gray-200">
      {/* Left side - Title */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-gray-800">Tsender</h1>
      </div>

      {/* Right side - GitHub link and ConnectButton */}
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/vincycode7/ts-tsender-ui-cu"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaGithub size={24} />
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}
