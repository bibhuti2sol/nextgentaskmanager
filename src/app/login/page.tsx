import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';

export const metadata: Metadata = {
  title: 'Login - NextGenTask Manager',
  description: 'Sign in to NextGenTask Manager to access your task management workspace with role-based access control for administrators, managers, and associates.',
};

export default function LoginPage() {
  return (
    <>
      <LoginInteractive />
      <footer className="w-full bg-gray-100 text-center py-4 mt-8">
        <p className="text-sm text-gray-600">&copy; 2023 Quantum Vertex Solutions. All rights reserved.</p>
      </footer>
    </>
  );
}