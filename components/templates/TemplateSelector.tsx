'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KENYAN_UNIVERSITIES, type ThesisTemplate } from '@/lib/thesis-templates';
import { Check, FileText } from 'lucide-react';

interface TemplateSelectorProps {
  onTemplateSelect: (template: ThesisTemplate) => void;
  selectedId?: string;
}

export function TemplateSelector({ onTemplateSelect, selectedId }: TemplateSelectorProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedId);

  const handleSelect = (template: ThesisTemplate) => {
    setSelected(template.id);
    onTemplateSelect(template);
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Thesis Templates</h2>
        <p className="text-sm text-muted-foreground">
          Select a template from your university to automatically format your thesis
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {KENYAN_UNIVERSITIES.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${
              selected === template.id
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'hover:border-blue-300'
            }`}
            onClick={() => handleSelect(template)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    {template.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {template.university}
                  </Badge>
                </div>
                {selected === template.id && (
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{template.description}</p>

              <div className="space-y-3 text-xs">
                <div>
                  <p className="font-semibold text-foreground mb-1">Formatting:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Font: {template.fontFamily}</li>
                    <li>• Body: {template.fontSize.body}px, Heading: {template.fontSize.heading}px</li>
                    <li>• Margins: {template.margins.top}″ top, {template.margins.left}″ left</li>
                    <li>• Line height: {template.lineHeight}x</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground mb-1">Requirements:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    {template.requirements.slice(0, 3).map((req, idx) => (
                      <li key={idx}>• {req}</li>
                    ))}
                    {template.requirements.length > 3 && (
                      <li className="text-blue-600 italic">
                        +{template.requirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <Button
                className="w-full"
                variant={selected === template.id ? 'default' : 'outline'}
                onClick={() => handleSelect(template)}
              >
                {selected === template.id ? 'Selected' : 'Select Template'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-sm">Template Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Your thesis will be formatted according to the selected template guidelines. All formatting will be applied automatically as you write.
            </p>
            <p className="text-muted-foreground">
              You can change templates at any time, but it may reformat your existing content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
