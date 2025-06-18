// Função utilitária para somar horas úteis
function addBusinessHours(start: Date, hoursToAdd: number): Date {
  let date = new Date(start);
  let hoursLeft = hoursToAdd;

  while (hoursLeft > 0) {
    // Se fim de semana, pula para segunda
    if (date.getDay() === 0) date.setDate(date.getDate() + 1); // Domingo
    if (date.getDay() === 6) date.setDate(date.getDate() + 2); // Sábado

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    // Antes do expediente, ajusta para 8:30 mantendo minutos e segundos
    if (hour < 8 || (hour === 8 && minute < 30)) {
      date.setHours(8, 30, second, 0);
      hour = 8;
      minute = 30;
    }
    // Hora do almoço, pula para 13:00 mantendo minutos e segundos
    if ((hour === 12 && minute >= 0) || (hour > 12 && hour < 13)) {
      date.setHours(13, 0, second, 0);
      hour = 13;
      minute = 0;
    }
    // Depois do expediente, pula para o próximo dia útil às 8:30 mantendo minutos e segundos
    if (hour > 17 || (hour === 17 && minute >= 30)) {
      date.setDate(date.getDate() + 1);
      date.setHours(8, 30, second, 0);
      continue;
    }

    // Calcula horas disponíveis no período atual
    let endHour: number, endMinute: number;
    if (hour < 12 || (hour === 12 && minute === 0)) {
      endHour = 12;
      endMinute = 0;
    } else {
      endHour = 17;
      endMinute = 30;
    }

    let available =
      endHour -
      hour +
      (endMinute - minute) / 60 -
      (second > 0 ? second / 3600 : 0);

    let toAdd = Math.min(available, hoursLeft);

    // Adiciona horas, minutos e segundos fracionados corretamente.
    let addHours = Math.floor(toAdd);
    let addMinutes = Math.floor((toAdd - addHours) * 60);
    let addSeconds = Math.round(((toAdd - addHours) * 60 - addMinutes) * 60);

    date.setHours(date.getHours() + addHours);
    date.setMinutes(date.getMinutes() + addMinutes);
    date.setSeconds(date.getSeconds() + addSeconds);

    hoursLeft -= toAdd;

    // Se chegou ao fim do expediente da manhã, pula para 13:00
    if (date.getHours() === 12 && date.getMinutes() === 0)
      date.setHours(13, 0, date.getSeconds(), 0);

    // Se chegou ao fim do expediente da tarde, pula para o próximo dia útil às 8:30
    if (date.getHours() === 17 && date.getMinutes() === 30) {
      date.setDate(date.getDate() + 1);
      date.setHours(8, 30, date.getSeconds(), 0);
    }
  }
  return date;
}

export interface ISLA {
  expiresIn: Date;
  closed_at: Date;
  slaColor: string;
}

const stages = [
  { value: 1, color: "#3F8ECE" },
  {
    value: 2,
    color: "#FF8E00",
  },
  { value: 3, color: "#22B74F" },
  { value: 4, color: "#DC2525" },
];

export function getSLA({
  closed_at,
  limitDays,
  isFinished,
}: {
  closed_at: Date | string;
  limitDays: number;
  isFinished: boolean;
}): ISLA {
  const closeDate =
    typeof closed_at === "string" ? new Date(closed_at) : closed_at;
  const slaHours = limitDays * 8;
  const expiresIn = addBusinessHours(closeDate, slaHours);
  const now = new Date();

  let stageValue: number;

  if (isFinished) {
    stageValue = 3;
  } else if (now > expiresIn) {
    const afterExpire = addBusinessHours(closeDate, 8);

    stageValue = now < afterExpire ? 2 : 4;
  } else {
    const beforeExpire = addBusinessHours(now, 8);
    stageValue = beforeExpire < expiresIn ? 1 : 2;
  }

  const stage = stages.find((s) => s.value === stageValue)!;

  return {
    expiresIn,
    closed_at: closeDate,
    slaColor: stage.color,
  };
}
