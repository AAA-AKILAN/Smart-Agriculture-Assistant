import React, { useState } from 'react';
import { History, Sparkles, Search, Trash2, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory, HistoryEntry } from '@/contexts/HistoryContext';
import { cn } from '@/lib/utils';

const HistoryPage: React.FC = () => {
  const { t } = useLanguage();
  const { history, clearHistory } = useHistory();
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredHistory = history.filter((entry) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'recommendations') return entry.type === 'recommendation';
    if (selectedTab === 'detections') return entry.type === 'detection';
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const renderHistoryCard = (entry: HistoryEntry) => {
    const isRecommendation = entry.type === 'recommendation';
    const result = entry.result as Record<string, unknown>;
    const input = entry.input as Record<string, unknown>;
    const imageUrl = input?.imageUrl as string | undefined;
    
    return (
      <Card
        key={entry.id}
        className="border-border transition-all duration-200 hover:shadow-md"
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Show leaf image for detections, icon for recommendations */}
              {!isRecommendation && imageUrl ? (
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border">
                  <img
                    src={imageUrl}
                    alt="Leaf"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    isRecommendation ? 'bg-primary/10' : 'bg-chart-3/20'
                  )}
                >
                  {isRecommendation ? (
                    <Sparkles className="h-5 w-5 text-primary" />
                  ) : (
                    <Search className="h-5 w-5 text-chart-3" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Tag className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    {isRecommendation
                      ? t('history.tab.recommendations')
                      : t('history.tab.detections')}
                  </span>
                </div>
                <h3 className="mt-1 font-semibold text-foreground">
                  {isRecommendation
                    ? (result.crop as string)
                    : (result.disease as string)}
                </h3>
                <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(entry.timestamp)}
                  </span>
                  <span className="flex items-center gap-1">
                    {result.confidence as number}% {t('decision.result.confidence')}
                  </span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Details */}
          <div className="mt-4 rounded-lg bg-secondary/50 p-3">
            {isRecommendation ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-foreground">{t('decision.result.reason')}: </span>
                  <span className="text-muted-foreground">
                    {(result.reason as string)?.substring(0, 150)}...
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Input: </span>
                  <span className="text-muted-foreground">
                    {(entry.input as Record<string, string>).soilType} soil, {(entry.input as Record<string, string>).season} season
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-foreground">{t('disease.result.treatment')}: </span>
                  <span className="text-muted-foreground">
                    {(result.treatment as string)?.substring(0, 150)}...
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
          {t('history.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('history.subtitle')}
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <Card className="border-border">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                {t('history.title')}
              </CardTitle>
              <CardDescription>
                {filteredHistory.length} {t('history.result').toLowerCase()}s
              </CardDescription>
            </div>
            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('history.clear')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('history.clear')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('history.clear.confirm')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearHistory}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('common.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  {t('history.tab.all')}
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex-1 sm:flex-none">
                  {t('history.tab.recommendations')}
                </TabsTrigger>
                <TabsTrigger value="detections" className="flex-1 sm:flex-none">
                  {t('history.tab.detections')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-0">
                {filteredHistory.length > 0 ? (
                  <div className="space-y-4">
                    {filteredHistory.map(renderHistoryCard)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                      <History className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-foreground">
                      {t('history.empty')}
                    </h3>
                    <p className="max-w-sm text-muted-foreground">
                      {t('history.empty.desc')}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
