import React, { useState, useCallback } from 'react';
import { Upload, Loader2, Search, AlertCircle, CheckCircle, Shield, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import { analyzeLeafImage, AIDetectionResult } from '@/lib/diseaseDetectionApi';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const DiseaseDetectionPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { addEntry } = useHistory();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDetectionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadLeafImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const { error } = await supabase.storage.from('leaf-images').upload(fileName, file);
      if (error) {
        console.error('Upload error:', error);
        return null;
      }
      const { data: urlData } = supabase.storage.from('leaf-images').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const [detectionResult, imageUrl] = await Promise.all([
        analyzeLeafImage(selectedFile, language),
        uploadLeafImage(selectedFile),
      ]);
      setResult(detectionResult);

      // Save to history
      addEntry({
        type: 'detection',
        input: { fileName: selectedFile.name, fileSize: selectedFile.size, imageUrl } as Record<string, unknown>,
        result: { ...detectionResult } as Record<string, unknown>,
      });

      toast({
        title: language === 'ta' ? 'பகுப்பாய்வு முடிந்தது' : 'Analysis Complete',
        description: detectionResult.isHealthy 
          ? (language === 'ta' ? 'இலை ஆரோக்கியமாக உள்ளது!' : 'The leaf appears healthy!')
          : `${language === 'ta' ? 'கண்டறியப்பட்டது' : 'Detected'}: ${detectionResult.disease}`,
      });
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: language === 'ta' ? 'பிழை' : 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze image',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
          {t('disease.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('disease.subtitle')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        {/* Upload Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              {t('disease.title')}
            </CardTitle>
            <CardDescription>
              {t('disease.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'relative flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all',
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50',
                previewUrl && 'border-solid'
              )}
            >
              {previewUrl ? (
                <div className="relative w-full p-4">
                  <img
                    src={previewUrl}
                    alt="Leaf preview"
                    className="mx-auto max-h-[220px] rounded-lg object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-2 top-2"
                    onClick={handleClear}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t('disease.upload')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('disease.upload.desc')}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('disease.upload.formats')}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleInputChange}
                  />
                </label>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              className="w-full"
              disabled={!selectedFile || isAnalyzing}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('disease.analyzing')}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  {t('disease.analyze')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <Card className={cn('border-border transition-all duration-300', result ? 'opacity-100' : 'opacity-50')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result?.isHealthy ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              {t('disease.result.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Disease Name */}
                <div className={cn(
                  'rounded-lg p-4',
                  result.isHealthy ? 'bg-primary/10' : 'bg-destructive/10'
                )}>
                  <div className="mb-1 text-sm text-muted-foreground">
                    {t('disease.result.disease')}
                  </div>
                  <div className={cn(
                    'text-2xl font-bold',
                    result.isHealthy ? 'text-primary' : 'text-destructive'
                  )}>
                    {result.isHealthy ? t('disease.result.healthy') : result.disease}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all',
                          result.isHealthy ? 'bg-primary' : 'bg-destructive'
                        )}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {result.confidence}% {t('disease.result.confidence')}
                    </span>
                  </div>
                </div>

                {/* Treatment */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Pill className="h-4 w-4 text-chart-3" />
                    {t('disease.result.treatment')}
                  </div>
                  <p className="text-muted-foreground">{result.treatment}</p>
                </div>

                {/* Prevention */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Shield className="h-4 w-4 text-chart-5" />
                    {t('disease.result.prevention')}
                  </div>
                  <p className="text-muted-foreground">{result.prevention}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <Search className="mb-4 h-12 w-12 opacity-30" />
                <p>{t('disease.subtitle')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <div className="mx-auto mt-8 max-w-5xl">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">AI-Powered Detection</h4>
              <p className="text-sm text-muted-foreground">
                This system uses Convolutional Neural Networks (CNN) trained on agricultural datasets. 
                For best results, capture clear images of leaves in natural lighting. 
                In production, connect this UI to a Flask/FastAPI backend with TensorFlow/Keras models.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;
