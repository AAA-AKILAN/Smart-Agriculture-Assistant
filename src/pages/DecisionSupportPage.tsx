import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Droplets, Beaker, CheckCircle, Cloud, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHistory } from '@/contexts/HistoryContext';
import { useToast } from '@/hooks/use-toast';
import { simulateCropRecommendation, CropRecommendationResult } from '@/lib/aiSimulation';
import { getWeatherForCurrentLocation, WeatherData } from '@/lib/weatherApi';

interface FormData {
  soilType: string;
  season: string;
  temperature: string;
  rainfall: string;
  weather: string;
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
}

const DecisionSupportPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { addEntry } = useHistory();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [formData, setFormData] = useState<FormData>({
    soilType: '',
    season: '',
    temperature: '28',
    rainfall: '900',
    weather: '',
    ph: '6.5',
    nitrogen: '40',
    phosphorus: '30',
    potassium: '35',
  });

  const fetchWeatherData = async () => {
    setIsFetchingWeather(true);
    try {
      const weatherData: WeatherData = await getWeatherForCurrentLocation();
      
      setFormData((prev) => ({
        ...prev,
        temperature: weatherData.temperature.toString(),
        rainfall: weatherData.rainfall.toString(),
        weather: weatherData.weather,
      }));

      toast({
        title: t('weather.updated'),
        description: `${weatherData.temperature}°C, ${t(`decision.weather.${weatherData.weather}`)}`,
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      toast({
        title: t('weather.location_error'),
        description: error instanceof Error ? error.message : 'Could not fetch weather',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // Auto-fetch weather on mount
  useEffect(() => {
    fetchWeatherData();
  }, []);

  const soilTypes = [
    { value: 'alluvial', label: t('decision.soil_type.alluvial') },
    { value: 'black', label: t('decision.soil_type.black') },
    { value: 'red', label: t('decision.soil_type.red') },
    { value: 'laterite', label: t('decision.soil_type.laterite') },
    { value: 'sandy', label: t('decision.soil_type.sandy') },
    { value: 'clay', label: t('decision.soil_type.clay') },
  ];

  const seasons = [
    { value: 'kharif', label: t('decision.season.kharif') },
    { value: 'rabi', label: t('decision.season.rabi') },
    { value: 'zaid', label: t('decision.season.zaid') },
  ];

  const weatherConditions = [
    { value: 'sunny', label: t('decision.weather.sunny') },
    { value: 'cloudy', label: t('decision.weather.cloudy') },
    { value: 'rainy', label: t('decision.weather.rainy') },
    { value: 'humid', label: t('decision.weather.humid') },
    { value: 'dry', label: t('decision.weather.dry') },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const recommendation = simulateCropRecommendation({
      soilType: formData.soilType,
      season: formData.season,
      temperature: parseFloat(formData.temperature),
      rainfall: parseFloat(formData.rainfall),
      ph: parseFloat(formData.ph),
      nitrogen: parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium: parseFloat(formData.potassium),
    }, language);

    setResult(recommendation);
    
    // Save to history
    addEntry({
      type: 'recommendation',
      input: { ...formData } as Record<string, unknown>,
      result: { ...recommendation } as Record<string, unknown>,
    });

    setIsAnalyzing(false);
  };

  const isFormValid = formData.soilType && formData.season;

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
          {t('decision.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('decision.subtitle')}
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
        {/* Input Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('decision.title')}
            </CardTitle>
            <CardDescription>
              {t('decision.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Soil Type */}
              <div className="space-y-2">
                <Label htmlFor="soilType">{t('decision.soil_type')}</Label>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) => handleInputChange('soilType', value)}
                >
                  <SelectTrigger id="soilType">
                    <SelectValue placeholder={t('decision.soil_type.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil.value} value={soil.value}>
                        {soil.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season */}
              <div className="space-y-2">
                <Label htmlFor="season">{t('decision.season')}</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => handleInputChange('season', value)}
                >
                  <SelectTrigger id="season">
                    <SelectValue placeholder={t('decision.season.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season.value} value={season.value}>
                        {season.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Temperature & Rainfall */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">{t('decision.temperature')}</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    min="0"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">{t('decision.rainfall')}</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    step="0.1"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', e.target.value)}
                    min="0"
                    max="5000"
                  />
                </div>
              </div>

              {/* Current Weather */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="weather" className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-chart-5" />
                    {t('decision.weather')}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchWeatherData}
                    disabled={isFetchingWeather}
                    className="h-7 text-xs"
                  >
                    {isFetchingWeather ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        {t('weather.fetching')}
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-1 h-3 w-3" />
                        {t('weather.fetch_location')}
                      </>
                    )}
                  </Button>
                </div>
                <Select
                  value={formData.weather}
                  onValueChange={(value) => handleInputChange('weather', value)}
                >
                  <SelectTrigger id="weather">
                    <SelectValue placeholder={t('decision.weather.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherConditions.map((weather) => (
                      <SelectItem key={weather.value} value={weather.value}>
                        {weather.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* pH */}
              <div className="space-y-2">
                <Label htmlFor="ph">{t('decision.ph')}</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', e.target.value)}
                  min="0"
                  max="14"
                />
              </div>

              {/* NPK Values */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen">{t('decision.nitrogen')}</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.1"
                    value={formData.nitrogen}
                    onChange={(e) => handleInputChange('nitrogen', e.target.value)}
                    min="0"
                    max="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phosphorus">{t('decision.phosphorus')}</Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    step="0.1"
                    value={formData.phosphorus}
                    onChange={(e) => handleInputChange('phosphorus', e.target.value)}
                    min="0"
                    max="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potassium">{t('decision.potassium')}</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.1"
                    value={formData.potassium}
                    onChange={(e) => handleInputChange('potassium', e.target.value)}
                    min="0"
                    max="200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('decision.analyzing')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('decision.get_recommendation')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card className={`border-border transition-all duration-300 ${result ? 'opacity-100' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              {t('decision.result.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Recommended Crop */}
                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="mb-1 text-sm text-muted-foreground">
                    {t('decision.result.crop')}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.crop}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {result.confidence}% {t('decision.result.confidence')}
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t('decision.result.reason')}
                  </div>
                  <p className="text-muted-foreground">{result.reason}</p>
                </div>

                {/* Irrigation */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Droplets className="h-4 w-4 text-chart-5" />
                    {t('decision.result.irrigation')}
                  </div>
                  <p className="text-muted-foreground">{result.irrigation}</p>
                </div>

                {/* Fertilizer */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Beaker className="h-4 w-4 text-chart-3" />
                    {t('decision.result.fertilizer')}
                  </div>
                  <p className="text-muted-foreground">{result.fertilizer}</p>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-muted-foreground">
                <Sparkles className="mb-4 h-12 w-12 opacity-30" />
                <p>{t('decision.subtitle')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DecisionSupportPage;
