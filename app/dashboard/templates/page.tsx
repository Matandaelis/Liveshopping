'use client';

import { TemplateSelector } from '@/components/templates/TemplateSelector';
import { type ThesisTemplate } from '@/lib/thesis-templates';

export default function TemplatesPage() {
  const handleTemplateSelect = (template: ThesisTemplate) => {
    console.log('[v0] Template selected:', template.id);
    // TODO: Save template selection to database
    // TODO: Apply template formatting to editor
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Thesis Templates</h1>
        <p className="text-muted-foreground mt-2">
          Choose a template matching your university's formatting guidelines
        </p>
      </div>

      <TemplateSelector onTemplateSelect={handleTemplateSelect} />
    </div>
  );
}
