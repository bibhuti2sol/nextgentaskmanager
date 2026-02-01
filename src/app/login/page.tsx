import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';

export const metadata: Metadata = {
  title: 'Login - NextGenTask Manager',
  description: 'Sign in to NextGenTask Manager to access your AI-powered task management workspace with role-based access control for administrators, managers, and associates.',
};

export default function LoginPage() {
  return <LoginInteractive />;
}