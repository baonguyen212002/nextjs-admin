import { Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PersonalizedBannerProps {
  title: string;
  message: string;
}

export default function PersonalizedBanner({ title, message }: PersonalizedBannerProps) {
  return (
    <Alert className="mb-6 border-accent bg-accent/10 shadow-md">
      <Lightbulb className="h-5 w-5 text-accent" />
      <AlertTitle className="font-semibold text-accent">{title}</AlertTitle>
      <AlertDescription className="text-foreground/80">
        {message}
      </AlertDescription>
    </Alert>
  );
}
