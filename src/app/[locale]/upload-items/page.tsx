import UploadForm from '@/components/upload/upload-form';
// If UploadForm or its children need translations, import useTranslations
// import { useTranslations } from 'next-intl';


export default function UploadItemsPage() {
  // const t = useTranslations('UploadItemsPage'); // If this page itself has translatable static text
  return (
    <div className="container mx-auto py-8">
      {/* If UploadForm contains text that needs translation pass t or use useTranslations inside it */}
      <UploadForm />
    </div>
  );
}
