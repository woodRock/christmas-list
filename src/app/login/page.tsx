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
    // Keyed on mode so a ?mode= change resets the form to that tab.
    <LoginClient key={mode ?? 'login'} redirectUrl={redirect} initialMode={mode} />
  );
}
