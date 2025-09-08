// Calculadora de Financiamento Imobiliário
export class FinancingCalculator {
  /**
   * Calcula financiamento pelo Sistema SAC
   */
  static calculateSAC(propertyValue: number, downPayment: number, interestRate: number, termMonths: number) {
    const financedAmount = propertyValue - downPayment
    const monthlyInterestRate = interestRate / 100 / 12
    const principalPayment = financedAmount / termMonths
    
    const installments = []
    let remainingBalance = financedAmount
    
    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const totalPayment = principalPayment + interestPayment
      remainingBalance -= principalPayment
      
      installments.push({
        month,
        principalPayment: Math.round(principalPayment * 100) / 100,
        interestPayment: Math.round(interestPayment * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        remainingBalance: Math.round(remainingBalance * 100) / 100
      })
    }
    
    const totalPaid = installments.reduce((sum, inst) => sum + inst.totalPayment, 0)
    const totalInterest = totalPaid - financedAmount
    
    return {
      type: 'SAC',
      installments,
      summary: {
        propertyValue,
        downPayment,
        financedAmount,
        firstInstallment: installments[0].totalPayment,
        lastInstallment: installments[installments.length - 1].totalPayment,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        termMonths,
        interestRate
      }
    }
  }

  /**
   * Calcula financiamento pelo Sistema PRICE
   */
  static calculatePRICE(propertyValue: number, downPayment: number, interestRate: number, termMonths: number) {
    const financedAmount = propertyValue - downPayment
    const monthlyInterestRate = interestRate / 100 / 12
    
    // Fórmula PRICE: PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
    const monthlyPayment = financedAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths)) /
      (Math.pow(1 + monthlyInterestRate, termMonths) - 1)
    
    const installments = []
    let remainingBalance = financedAmount
    
    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const principalPayment = monthlyPayment - interestPayment
      remainingBalance -= principalPayment
      
      installments.push({
        month,
        principalPayment: Math.round(principalPayment * 100) / 100,
        interestPayment: Math.round(interestPayment * 100) / 100,
        totalPayment: Math.round(monthlyPayment * 100) / 100,
        remainingBalance: Math.round(Math.max(0, remainingBalance) * 100) / 100
      })
    }
    
    const totalPaid = monthlyPayment * termMonths
    const totalInterest = totalPaid - financedAmount
    
    return {
      type: 'PRICE',
      installments,
      summary: {
        propertyValue,
        downPayment,
        financedAmount,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        termMonths,
        interestRate
      }
    }
  }

  /**
   * Calcula capacidade de financiamento baseado na renda
   */
  static calculateAffordability(grossIncome: number, monthlyExpenses: number, interestRate: number, termMonths: number) {
    const netIncome = grossIncome - monthlyExpenses
    const maxPayment = netIncome * 0.3 // 30% da renda líquida
    
    const monthlyInterestRate = interestRate / 100 / 12
    
    // Valor máximo financiável com base na prestação
    const maxFinanced = maxPayment * 
      (Math.pow(1 + monthlyInterestRate, termMonths) - 1) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths))
    
    return {
      grossIncome,
      netIncome,
      monthlyExpenses,
      maxMonthlyPayment: Math.round(maxPayment * 100) / 100,
      maxFinancedAmount: Math.round(maxFinanced * 100) / 100,
      suggestedDownPayment: Math.round(maxFinanced * 0.2 * 100) / 100, // 20% de entrada
      maxPropertyValue: Math.round(maxFinanced * 1.25 * 100) / 100, // Com 20% de entrada
      interestRate,
      termMonths
    }
  }

  /**
   * Compara diferentes cenários de financiamento
   */
  static compareScenarios(propertyValue: number, scenarios: Array<{
    downPaymentPercent: number
    interestRate: number
    termMonths: number
  }>) {
    return scenarios.map((scenario, index) => {
      const downPayment = propertyValue * (scenario.downPaymentPercent / 100)
      const sac = this.calculateSAC(propertyValue, downPayment, scenario.interestRate, scenario.termMonths)
      const price = this.calculatePRICE(propertyValue, downPayment, scenario.interestRate, scenario.termMonths)
      
      return {
        scenario: index + 1,
        downPaymentPercent: scenario.downPaymentPercent,
        downPayment,
        interestRate: scenario.interestRate,
        termMonths: scenario.termMonths,
        sac: sac.summary,
        price: price.summary
      }
    })
  }
}

// Calculadora de Impostos e Taxas
export class PropertyTaxCalculator {
  /**
   * Calcula ITBI (Imposto de Transmissão de Bens Imóveis)
   */
  static calculateITBI(propertyValue: number, city: string = 'São Paulo') {
    // Alíquotas por cidade (simplificado)
    const rates: { [key: string]: number } = {
      'São Paulo': 3.0,
      'Rio de Janeiro': 3.0,
      'Belo Horizonte': 3.0,
      'Brasília': 2.0,
      'Salvador': 3.0,
      'Fortaleza': 2.0,
      'Recife': 3.0,
      'Porto Alegre': 3.0,
      'Curitiba': 2.5,
      'Campinas': 2.0
    }
    
    const rate = rates[city] || 3.0
    const itbiValue = propertyValue * (rate / 100)
    
    return {
      propertyValue,
      city,
      rate,
      itbiValue: Math.round(itbiValue * 100) / 100
    }
  }

  /**
   * Calcula custos totais da compra
   */
  static calculateTotalPurchaseCosts(propertyValue: number, city: string = 'São Paulo', hasFinancing: boolean = true) {
    const itbi = this.calculateITBI(propertyValue, city)
    
    // Custos típicos
    const registrationFee = propertyValue * 0.005 // 0.5%
    const lawyerFee = propertyValue * 0.01 // 1%
    const brokerageFee = propertyValue * 0.03 // 3%
    const appraisalFee = hasFinancing ? 2000 : 0
    const bankFees = hasFinancing ? propertyValue * 0.003 : 0 // 0.3%
    
    const totalCosts = itbi.itbiValue + registrationFee + lawyerFee + 
                      brokerageFee + appraisalFee + bankFees
    
    return {
      propertyValue,
      breakdown: {
        itbi: itbi.itbiValue,
        registration: Math.round(registrationFee * 100) / 100,
        lawyer: Math.round(lawyerFee * 100) / 100,
        brokerage: Math.round(brokerageFee * 100) / 100,
        appraisal: appraisalFee,
        bankFees: Math.round(bankFees * 100) / 100
      },
      totalCosts: Math.round(totalCosts * 100) / 100,
      totalWithProperty: Math.round((propertyValue + totalCosts) * 100) / 100,
      costsPercentage: Math.round((totalCosts / propertyValue) * 100 * 100) / 100
    }
  }

  /**
   * Calcula IPTU anual estimado
   */
  static calculateIPTU(propertyValue: number, city: string = 'São Paulo', propertyType: 'residential' | 'commercial' = 'residential') {
    // Alíquotas aproximadas por cidade e tipo
    const rates: { [key: string]: { residential: number, commercial: number } } = {
      'São Paulo': { residential: 1.0, commercial: 1.5 },
      'Rio de Janeiro': { residential: 1.2, commercial: 1.8 },
      'Belo Horizonte': { residential: 0.8, commercial: 1.2 },
      'Brasília': { residential: 0.6, commercial: 1.0 },
      'Salvador': { residential: 0.8, commercial: 1.2 },
      'Fortaleza': { residential: 0.6, commercial: 1.0 },
      'Recife': { residential: 0.8, commercial: 1.2 },
      'Porto Alegre': { residential: 1.0, commercial: 1.5 },
      'Curitiba': { residential: 0.9, commercial: 1.3 },
      'Campinas': { residential: 0.7, commercial: 1.1 }
    }
    
    const cityRates = rates[city] || rates['São Paulo']
    const rate = cityRates[propertyType]
    const annualIPTU = propertyValue * (rate / 100)
    const monthlyIPTU = annualIPTU / 12
    
    return {
      propertyValue,
      city,
      propertyType,
      rate,
      annualIPTU: Math.round(annualIPTU * 100) / 100,
      monthlyIPTU: Math.round(monthlyIPTU * 100) / 100
    }
  }
}

// Calculadora de Rentabilidade para Investimento
export class InvestmentCalculator {
  /**
   * Calcula rentabilidade de aluguel
   */
  static calculateRentalYield(propertyValue: number, monthlyRent: number, monthlyExpenses: number = 0) {
    const annualRent = monthlyRent * 12
    const annualExpenses = monthlyExpenses * 12
    const netAnnualRent = annualRent - annualExpenses
    
    const grossYield = (annualRent / propertyValue) * 100
    const netYield = (netAnnualRent / propertyValue) * 100
    
    const paybackYears = propertyValue / netAnnualRent
    
    return {
      propertyValue,
      monthlyRent,
      monthlyExpenses,
      annualRent,
      annualExpenses,
      netAnnualRent,
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      paybackYears: Math.round(paybackYears * 100) / 100,
      monthlyProfit: monthlyRent - monthlyExpenses
    }
  }

  /**
   * Calcula valorização imobiliária
   */
  static calculateAppreciation(initialValue: number, finalValue: number, years: number) {
    const totalReturn = ((finalValue - initialValue) / initialValue) * 100
    const annualReturn = Math.pow(finalValue / initialValue, 1 / years) - 1
    
    return {
      initialValue,
      finalValue,
      years,
      totalReturn: Math.round(totalReturn * 100) / 100,
      annualReturn: Math.round(annualReturn * 100 * 100) / 100,
      absoluteGain: finalValue - initialValue
    }
  }

  /**
   * Análise completa de investimento
   */
  static analyzeInvestment(
    propertyValue: number,
    downPayment: number,
    monthlyRent: number,
    monthlyExpenses: number,
    expectedAppreciationRate: number,
    investmentPeriodYears: number,
    alternativeInvestmentRate: number = 10.5 // CDI/Poupança
  ) {
    const financedAmount = propertyValue - downPayment
    const rentalYield = this.calculateRentalYield(propertyValue, monthlyRent, monthlyExpenses)
    
    // Valor futuro do imóvel
    const futurePropertyValue = propertyValue * Math.pow(1 + expectedAppreciationRate / 100, investmentPeriodYears)
    
    // Retorno total do investimento imobiliário
    const totalRentalIncome = rentalYield.monthlyProfit * 12 * investmentPeriodYears
    const capitalGain = futurePropertyValue - propertyValue
    const totalReturn = totalRentalIncome + capitalGain
    
    // ROI sobre o capital investido (entrada)
    const roi = (totalReturn / downPayment) * 100
    const annualROI = Math.pow(1 + roi / 100, 1 / investmentPeriodYears) - 1
    
    // Comparação com investimento alternativo
    const alternativeReturn = downPayment * Math.pow(1 + alternativeInvestmentRate / 100, investmentPeriodYears)
    const alternativeTotalReturn = alternativeReturn - downPayment
    
    const advantage = totalReturn - alternativeTotalReturn
    
    return {
      investment: {
        propertyValue,
        downPayment,
        financedAmount,
        monthlyRent,
        monthlyExpenses,
        monthlyProfit: rentalYield.monthlyProfit
      },
      projections: {
        investmentPeriodYears,
        futurePropertyValue: Math.round(futurePropertyValue * 100) / 100,
        totalRentalIncome: Math.round(totalRentalIncome * 100) / 100,
        capitalGain: Math.round(capitalGain * 100) / 100,
        totalReturn: Math.round(totalReturn * 100) / 100
      },
      returns: {
        roi: Math.round(roi * 100) / 100,
        annualROI: Math.round(annualROI * 100 * 100) / 100,
        rentalYield: rentalYield.netYield
      },
      comparison: {
        alternativeInvestmentRate,
        alternativeReturn: Math.round(alternativeReturn * 100) / 100,
        alternativeTotalReturn: Math.round(alternativeTotalReturn * 100) / 100,
        advantage: Math.round(advantage * 100) / 100,
        isRealEstateBetter: advantage > 0
      }
    }
  }
}
