import ResetPasswordForm from '@/app/(service)/reset-password/components/ResetPasswordForm';

type ResetPasswordPageContentProps = {
  token?: string;
};

export default function ResetPasswordPageContent({
  token,
}: ResetPasswordPageContentProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-4 py-10">
      <ResetPasswordForm token={token} />
    </div>
  );
}
