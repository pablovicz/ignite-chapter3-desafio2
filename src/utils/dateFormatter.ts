import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function DateFormatter(date: string, updatedDate: boolean=false){

  const formattedDate = format(new Date(date), 'dd MMM yyyy', { locale: ptBR, });

  if (updatedDate) {

    const hour = format(new Date(date), 'HH:mm', { locale: ptBR, });

    return `${formattedDate}, às ${hour}`

  }
  
  return formattedDate
};

