
import React, { useCallback } from 'react'
import { StringInputProps, set, unset, useFormValue } from 'sanity'
import { Button, Card, Flex, Stack, Text, TextInput } from '@sanity/ui'

// Helper function to get the abbreviation for the property type
const getTipoAbreviacao = (tipoImovel: string | undefined) => {
  if (!tipoImovel) return 'IMO'
  return tipoImovel.substring(0, 3).toUpperCase()
}

// Helper function to get the abbreviation for the purpose
const getFinalidadeAbreviacao = (finalidade: string | undefined) => {
  if (!finalidade) return 'V'
  return finalidade.substring(0, 1).toUpperCase()
}

export default function GenerateInternalCode(props: StringInputProps) {
  const { onChange, value, elementProps } = props

  // Get values from other fields in the document
  const tipoImovel = useFormValue(['tipoImovel']) as string | undefined
  const finalidade = useFormValue(['finalidade']) as string | undefined

  const generateCode = useCallback(() => {
    const tipo = getTipoAbreviacao(tipoImovel)
    const finalidadeAbrev = getFinalidadeAbreviacao(finalidade)
    const ano = new Date().getFullYear().toString().slice(-2)
    const sequencial = Math.floor(1000 + Math.random() * 9000).toString() // 4-digit random number

    const newCode = `${tipo}${finalidadeAbrev}${ano}${sequencial}`
    onChange(set(newCode))
  }, [tipoImovel, finalidade, onChange])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  return (
    <Card padding={0} shadow={0} radius={2} border>
      <Flex>
        <Flex align="center" justify="center" style={{ flex: 1 }}>
          <TextInput
            {...elementProps}
            style={{ width: '100%', border: 'none', boxShadow: 'none' }}
            value={value}
            onChange={handleChange}
            placeholder="Clique em Gerar ou insira o código manualmente"
          />
        </Flex>
        <Button
          text="Gerar Código"
          mode="ghost"
          onClick={generateCode}
          style={{ borderLeft: '1px solid var(--card-border-color)' }}
        />
      </Flex>
    </Card>
  )
}
