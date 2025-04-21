import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Moeda ------------------------

export function formatarMoeda(
  valor: number,
  exibirSimbolo = false,
  comDecimais = false
): string {
  const formatado = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: comDecimais ? 2 : 0,
    maximumFractionDigits: comDecimais ? 2 : 0,
  })

  return exibirSimbolo ? formatado : formatado.replace('R$', '').trim()
}

// --- Área -------------------------

export function formatarArea(area: number): string {
  return `${area.toLocaleString('pt-BR')} m²`
}

// --- Quantidade com plural -------

export function formatarQuantidade(valor: number, unidade: string): string {
  return `${valor} ${unidade}${valor === 1 ? '' : 's'}`
}

// --- Características --------------

export function formatarCaracteristicas(lista: string[]): string {
  if (lista.length === 0) return ''
  if (lista.length === 1) return lista[0]
  const ultima = lista[lista.length - 1]
  const inicio = lista.slice(0, -1).join(', ')
  return `${inicio} e ${ultima}`
}

// --- Data de publicação -----------

export function formatarDataPublicacao(dataISO: string): string {
  const data = new Date(dataISO)
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

