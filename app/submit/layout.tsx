import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Idea | IdeaProof',
  description: 'Securely record your ideas on the Solana blockchain',
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 