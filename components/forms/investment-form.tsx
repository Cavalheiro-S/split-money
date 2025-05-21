import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvestmentService } from '@/services/investment.service';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const investmentSchema = z.object({
  ticker: z.string()
    .min(1, 'O ticker é obrigatório')
    .max(10, 'O ticker deve ter no máximo 10 caracteres'),
  quantity: z.number({
    required_error: 'A quantidade é obrigatória',
    invalid_type_error: 'Digite um número válido',
  }).positive('A quantidade deve ser maior que zero'),
  purchasePrice: z.number({
    required_error: 'O preço de compra é obrigatório',
    invalid_type_error: 'Digite um número válido',
  }).positive('O preço deve ser maior que zero'),
  purchaseDate: z.string()
    .min(1, 'A data de compra é obrigatória')
    .refine((val) => !isNaN(Date.parse(val)), 'Data inválida'),
  currency: z.enum(['BRL', 'USD'], {
    required_error: 'Selecione uma moeda',
    invalid_type_error: 'Moeda inválida',
  }),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  onSuccess: () => void;
  open: boolean;
}

export function InvestmentForm({ onSuccess, open }: InvestmentFormProps) {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      ticker: '',
      quantity: 0,
      purchasePrice: 0,
      purchaseDate: '',
      currency: undefined,
    }
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: InvestmentFormData) => {
    setIsSubmitting(true);
    try {
      await InvestmentService.create(data);
      toast({
        title: 'Sucesso',
        description: 'Investimento cadastrado com sucesso',
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o investimento',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Investimento</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="ticker">Ticker</Label>
          <Controller
            name="ticker"
            control={control}
            render={({ field }) => (
              <Input
                id="ticker"
                placeholder="Ex: PETR4.SA"
                {...field}
              />
            )}
          />
          {errors.ticker && (
            <span className="text-sm text-red-500">{errors.ticker.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="quantity">Quantidade</Label>
          <Controller
            name="quantity"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <Input
                id="quantity"
                type="number"
                step="0.01"
                onChange={(e) => onChange(Number(e.target.value))}
                {...field}
              />
            )}
          />
          {errors.quantity && (
            <span className="text-sm text-red-500">{errors.quantity.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="purchasePrice">Preço de Compra</Label>
          <Controller
            name="purchasePrice"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                onChange={(e) => onChange(Number(e.target.value))}
                {...field}
              />
            )}
          />
          {errors.purchasePrice && (
            <span className="text-sm text-red-500">{errors.purchasePrice.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="purchaseDate">Data da Compra</Label>
          <Controller
            name="purchaseDate"
            control={control}
            render={({ field }) => (
              <Input
                id="purchaseDate"
                type="date"
                {...field}
              />
            )}
          />
          {errors.purchaseDate && (
            <span className="text-sm text-red-500">{errors.purchaseDate.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="currency">Moeda</Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL (Ações B3)</SelectItem>
                  <SelectItem value="USD">USD (ETFs US)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <span className="text-sm text-red-500">{errors.currency.message}</span>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </form>
    </DialogContent>
  );
}
