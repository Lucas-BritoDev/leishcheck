import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { User, ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnimatedPage from '@/components/AnimatedPage';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
];

export default function UserDataPage() {
  const navigate = useNavigate();
  const { userData, setUserData, audioEnabled } = useLeishCheckStore();
  const [age, setAge] = useState(userData.age?.toString() || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [city, setCity] = useState(userData.city || '');
  const [state, setState] = useState(userData.state || '');

  useEffect(() => {
    if (audioEnabled) {
      speakText('Informe seus dados básicos. Todos os campos são opcionais. Toque em Continuar quando estiver pronto.');
    }
  }, [audioEnabled]);

  const handleContinue = () => {
    setUserData({
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      city: city || undefined,
      state: state || undefined,
    });
    navigate('/questionario');
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step}
              </div>
              {step < 4 && <div className="h-0.5 w-6 bg-border rounded-full" />}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 hover-lift"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Dados Básicos</h1>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="icon-circle h-16 w-16">
            <User className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Todos os campos são opcionais</p>
        </div>

        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Idade
            </Label>
            <Input
              id="age"
              type="number"
              placeholder="Ex: 35"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="h-12 rounded-xl text-base focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Gênero
            </Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
                <SelectItem value="prefiro-nao-dizer">Prefiro não dizer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Cidade
            </Label>
            <Input
              id="city"
              placeholder="Ex: Manaus"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 rounded-xl text-base focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Estado
            </Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS.map((uf) => (
                  <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold"
        >
          Continuar
        </button>
      </div>
    </AnimatedPage>
  );
}
