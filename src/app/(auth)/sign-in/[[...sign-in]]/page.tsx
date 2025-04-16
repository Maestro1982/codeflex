import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <main className='flex h-screen items-center justify-center w-full'>
      <SignIn />
    </main>
  );
};
export default SignInPage;
