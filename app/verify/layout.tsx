import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Idea | IdeaProof',
  description: 'Verify the existence and timestamp of ideas on the Solana blockchain',
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 