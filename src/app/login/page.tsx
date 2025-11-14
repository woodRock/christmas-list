import LoginClient from './LoginClient';

interface LoginPageProps {
  searchParams: {
    redirect?: string;
    mode?: 'login' | 'signup';
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, mode } = await searchParams;

  return (
    <LoginClient redirectUrl={redirect} initialMode={mode} />
  );
}
