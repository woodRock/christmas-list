import LoginClient from './LoginClient';

interface LoginPageProps {
  searchParams: {
    redirect?: string;
    mode?: 'login' | 'signup';
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, mode } = searchParams;

  return (
    <LoginClient redirectUrl={redirect} initialMode={mode} />
  );
}
