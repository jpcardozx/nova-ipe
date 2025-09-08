// Sistema de relatórios para imobiliária
export interface PropertySaleData {
  id: string
  propertyId: string
  salePrice: number
  commission: number
  saleDate: Date
  brokerId: string
  leadSource: string
  daysOnMarket: number
  listingPrice: number
  priceReduction?: number
  propertyType: string
  bedrooms: number
  area: number
  location: string
}

export interface RentalData {
  id: string
  propertyId: string
  monthlyRent: number
  deposit: number
  commissionPercent: number
  leaseStart: Date
  leaseEnd: Date
  tenantId: string
  brokerId: string
  propertyType: string
  location: string
}

export class ReportsManager {
  private salesData: PropertySaleData[] = []
  private rentalsData: RentalData[] = []

  /**
   * Adiciona dados de venda
   */
  addSale(saleData: PropertySaleData): void {
    this.salesData.push(saleData)
  }

  /**
   * Adiciona dados de aluguel
   */
  addRental(rentalData: RentalData): void {
    this.rentalsData.push(rentalData)
  }

  /**
   * Relatório de vendas por período
   */
  getSalesReport(startDate: Date, endDate: Date) {
    const salesInPeriod = this.salesData.filter(sale => 
      sale.saleDate >= startDate && sale.saleDate <= endDate
    )

    const totalSales = salesInPeriod.length
    const totalVolume = salesInPeriod.reduce((sum, sale) => sum + sale.salePrice, 0)
    const totalCommission = salesInPeriod.reduce((sum, sale) => sum + sale.commission, 0)
    const averageSalePrice = totalSales > 0 ? totalVolume / totalSales : 0
    const averageDaysOnMarket = totalSales > 0 
      ? salesInPeriod.reduce((sum, sale) => sum + sale.daysOnMarket, 0) / totalSales 
      : 0

    // Análise por localização
    const salesByLocation = salesInPeriod.reduce((acc, sale) => {
      if (!acc[sale.location]) {
        acc[sale.location] = { count: 0, volume: 0, avgPrice: 0 }
      }
      acc[sale.location].count++
      acc[sale.location].volume += sale.salePrice
      acc[sale.location].avgPrice = acc[sale.location].volume / acc[sale.location].count
      return acc
    }, {} as Record<string, { count: number, volume: number, avgPrice: number }>)

    // Análise por tipo de imóvel
    const salesByType = salesInPeriod.reduce((acc, sale) => {
      if (!acc[sale.propertyType]) {
        acc[sale.propertyType] = { count: 0, volume: 0, avgPrice: 0 }
      }
      acc[sale.propertyType].count++
      acc[sale.propertyType].volume += sale.salePrice
      acc[sale.propertyType].avgPrice = acc[sale.propertyType].volume / acc[sale.propertyType].count
      return acc
    }, {} as Record<string, { count: number, volume: number, avgPrice: number }>)

    // Performance por corretor
    const salesByBroker = salesInPeriod.reduce((acc, sale) => {
      if (!acc[sale.brokerId]) {
        acc[sale.brokerId] = { 
          count: 0, 
          volume: 0, 
          commission: 0, 
          avgPrice: 0,
          avgDaysOnMarket: 0
        }
      }
      acc[sale.brokerId].count++
      acc[sale.brokerId].volume += sale.salePrice
      acc[sale.brokerId].commission += sale.commission
      acc[sale.brokerId].avgPrice = acc[sale.brokerId].volume / acc[sale.brokerId].count
      return acc
    }, {} as Record<string, { count: number, volume: number, commission: number, avgPrice: number, avgDaysOnMarket: number }>)

    // Calcula média de dias no mercado por corretor
    Object.keys(salesByBroker).forEach(brokerId => {
      const brokerSales = salesInPeriod.filter(sale => sale.brokerId === brokerId)
      salesByBroker[brokerId].avgDaysOnMarket = 
        brokerSales.reduce((sum, sale) => sum + sale.daysOnMarket, 0) / brokerSales.length
    })

    return {
      period: { startDate, endDate },
      summary: {
        totalSales,
        totalVolume: Math.round(totalVolume),
        totalCommission: Math.round(totalCommission),
        averageSalePrice: Math.round(averageSalePrice),
        averageDaysOnMarket: Math.round(averageDaysOnMarket * 10) / 10
      },
      salesByLocation,
      salesByType,
      salesByBroker,
      salesData: salesInPeriod
    }
  }

  /**
   * Relatório de aluguéis por período
   */
  getRentalsReport(startDate: Date, endDate: Date) {
    const rentalsInPeriod = this.rentalsData.filter(rental => 
      rental.leaseStart >= startDate && rental.leaseStart <= endDate
    )

    const totalContracts = rentalsInPeriod.length
    const totalMonthlyRent = rentalsInPeriod.reduce((sum, rental) => sum + rental.monthlyRent, 0)
    const totalDeposits = rentalsInPeriod.reduce((sum, rental) => sum + rental.deposit, 0)
    const averageRent = totalContracts > 0 ? totalMonthlyRent / totalContracts : 0

    // Comissões por aluguéis
    const totalRentalCommission = rentalsInPeriod.reduce((sum, rental) => {
      return sum + (rental.monthlyRent * (rental.commissionPercent / 100))
    }, 0)

    // Análise por localização
    const rentalsByLocation = rentalsInPeriod.reduce((acc, rental) => {
      if (!acc[rental.location]) {
        acc[rental.location] = { count: 0, totalRent: 0, avgRent: 0 }
      }
      acc[rental.location].count++
      acc[rental.location].totalRent += rental.monthlyRent
      acc[rental.location].avgRent = acc[rental.location].totalRent / acc[rental.location].count
      return acc
    }, {} as Record<string, { count: number, totalRent: number, avgRent: number }>)

    // Performance por corretor
    const rentalsByBroker = rentalsInPeriod.reduce((acc, rental) => {
      if (!acc[rental.brokerId]) {
        acc[rental.brokerId] = { count: 0, totalRent: 0, commission: 0 }
      }
      acc[rental.brokerId].count++
      acc[rental.brokerId].totalRent += rental.monthlyRent
      acc[rental.brokerId].commission += rental.monthlyRent * (rental.commissionPercent / 100)
      return acc
    }, {} as Record<string, { count: number, totalRent: number, commission: number }>)

    return {
      period: { startDate, endDate },
      summary: {
        totalContracts,
        totalMonthlyRent: Math.round(totalMonthlyRent),
        totalDeposits: Math.round(totalDeposits),
        totalRentalCommission: Math.round(totalRentalCommission),
        averageRent: Math.round(averageRent)
      },
      rentalsByLocation,
      rentalsByBroker,
      rentalsData: rentalsInPeriod
    }
  }

  /**
   * Análise de mercado - preços por m²
   */
  getMarketAnalysis(location?: string, propertyType?: string) {
    let relevantSales = this.salesData

    if (location) {
      relevantSales = relevantSales.filter(sale => sale.location === location)
    }

    if (propertyType) {
      relevantSales = relevantSales.filter(sale => sale.propertyType === propertyType)
    }

    if (relevantSales.length === 0) {
      return {
        message: 'Não há dados suficientes para análise',
        sampleSize: 0
      }
    }

    // Calcula preço por m²
    const pricesPerSqm = relevantSales.map(sale => ({
      ...sale,
      pricePerSqm: sale.salePrice / sale.area
    }))

    const avgPricePerSqm = pricesPerSqm.reduce((sum, sale) => sum + sale.pricePerSqm, 0) / pricesPerSqm.length
    const medianPricePerSqm = this.calculateMedian(pricesPerSqm.map(sale => sale.pricePerSqm))
    
    // Análise de tendências (últimos 6 meses vs 6 meses anteriores)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const recentSales = pricesPerSqm.filter(sale => sale.saleDate >= sixMonthsAgo)
    const olderSales = pricesPerSqm.filter(sale => sale.saleDate < sixMonthsAgo)

    const recentAvgPrice = recentSales.length > 0 
      ? recentSales.reduce((sum, sale) => sum + sale.pricePerSqm, 0) / recentSales.length 
      : 0

    const olderAvgPrice = olderSales.length > 0 
      ? olderSales.reduce((sum, sale) => sum + sale.pricePerSqm, 0) / olderSales.length 
      : 0

    const priceChange = olderAvgPrice > 0 
      ? ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100 
      : 0

    return {
      location: location || 'Todas as regiões',
      propertyType: propertyType || 'Todos os tipos',
      sampleSize: relevantSales.length,
      pricePerSqm: {
        average: Math.round(avgPricePerSqm),
        median: Math.round(medianPricePerSqm),
        min: Math.round(Math.min(...pricesPerSqm.map(s => s.pricePerSqm))),
        max: Math.round(Math.max(...pricesPerSqm.map(s => s.pricePerSqm)))
      },
      trend: {
        recentPeriodAvg: Math.round(recentAvgPrice),
        previousPeriodAvg: Math.round(olderAvgPrice),
        changePercent: Math.round(priceChange * 100) / 100,
        direction: priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'stable'
      },
      salesData: pricesPerSqm
    }
  }

  /**
   * Relatório de performance geral da imobiliária
   */
  getOverallPerformance(startDate: Date, endDate: Date) {
    const salesReport = this.getSalesReport(startDate, endDate)
    const rentalsReport = this.getRentalsReport(startDate, endDate)

    const totalRevenue = salesReport.summary.totalCommission + rentalsReport.summary.totalRentalCommission
    const totalTransactions = salesReport.summary.totalSales + rentalsReport.summary.totalContracts

    // Análise de produtividade por corretor
    const brokerPerformance = new Map()
    
    // Adiciona vendas
    Object.entries(salesReport.salesByBroker).forEach(([brokerId, data]: [string, any]) => {
      if (!brokerPerformance.has(brokerId)) {
        brokerPerformance.set(brokerId, {
          sales: 0,
          rentals: 0,
          totalCommission: 0,
          totalTransactions: 0
        })
      }
      const broker = brokerPerformance.get(brokerId)
      broker.sales = data.count
      broker.totalCommission += data.commission
      broker.totalTransactions += data.count
    })

    // Adiciona aluguéis
    Object.entries(rentalsReport.rentalsByBroker).forEach(([brokerId, data]: [string, any]) => {
      if (!brokerPerformance.has(brokerId)) {
        brokerPerformance.set(brokerId, {
          sales: 0,
          rentals: 0,
          totalCommission: 0,
          totalTransactions: 0
        })
      }
      const broker = brokerPerformance.get(brokerId)
      broker.rentals = data.count
      broker.totalCommission += data.commission
      broker.totalTransactions += data.count
    })

    const brokerStats = Object.fromEntries(brokerPerformance)

    return {
      period: { startDate, endDate },
      overview: {
        totalRevenue: Math.round(totalRevenue),
        totalTransactions,
        averageRevenuePerTransaction: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0
      },
      sales: salesReport.summary,
      rentals: rentalsReport.summary,
      brokerPerformance: brokerStats,
      topPerformers: this.getTopPerformers(brokerStats)
    }
  }

  /**
   * Identifica top performers
   */
  private getTopPerformers(brokerStats: Record<string, any>) {
    const brokers = Object.entries(brokerStats).map(([id, stats]) => ({
      brokerId: id,
      ...stats
    }))

    return {
      byRevenue: brokers
        .sort((a, b) => b.totalCommission - a.totalCommission)
        .slice(0, 3),
      byTransactions: brokers
        .sort((a, b) => b.totalTransactions - a.totalTransactions)
        .slice(0, 3)
    }
  }

  /**
   * Calcula mediana
   */
  private calculateMedian(numbers: number[]): number {
    const sorted = numbers.sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    } else {
      return sorted[middle]
    }
  }

  /**
   * Relatório de leads convertidos
   */
  getLeadConversionReport(leads: any[], startDate: Date, endDate: Date) {
    const leadsInPeriod = leads.filter(lead => 
      lead.createdAt >= startDate && lead.createdAt <= endDate
    )

    const totalLeads = leadsInPeriod.length
    const convertedLeads = leadsInPeriod.filter(lead => lead.status === 'closed').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

    // Conversão por fonte
    const conversionBySource = leadsInPeriod.reduce((acc, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = { total: 0, converted: 0, rate: 0 }
      }
      acc[lead.source].total++
      if (lead.status === 'closed') {
        acc[lead.source].converted++
      }
      acc[lead.source].rate = (acc[lead.source].converted / acc[lead.source].total) * 100
      return acc
    }, {} as Record<string, { total: number, converted: number, rate: number }>)

    // Tempo médio de conversão
    const convertedLeadsWithTime = leadsInPeriod
      .filter(lead => lead.status === 'closed')
      .map(lead => {
        const conversionTime = lead.activities
          .find((activity: any) => activity.type === 'closed')?.date || new Date()
        return (conversionTime.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      })

    const averageConversionTime = convertedLeadsWithTime.length > 0
      ? convertedLeadsWithTime.reduce((sum, time) => sum + time, 0) / convertedLeadsWithTime.length
      : 0

    return {
      period: { startDate, endDate },
      summary: {
        totalLeads,
        convertedLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageConversionTimeDays: Math.round(averageConversionTime * 10) / 10
      },
      conversionBySource,
      recommendations: this.getConversionRecommendations(conversionBySource, conversionRate)
    }
  }

  /**
   * Gera recomendações baseado na conversão
   */
  private getConversionRecommendations(conversionBySource: any, overallRate: number) {
    const recommendations = []

    Object.entries(conversionBySource).forEach(([source, data]: [string, any]) => {
      if (data.rate < overallRate * 0.5) {
        recommendations.push({
          type: 'low-conversion',
          source,
          message: `A fonte "${source}" tem conversão muito baixa (${data.rate.toFixed(1)}%). Revisar qualidade dos leads ou processo de atendimento.`
        })
      }

      if (data.rate > overallRate * 1.5 && data.total >= 5) {
        recommendations.push({
          type: 'high-conversion',
          source,
          message: `A fonte "${source}" tem excelente conversão (${data.rate.toFixed(1)}%). Considere investir mais neste canal.`
        })
      }
    })

    if (overallRate < 15) {
      recommendations.push({
        type: 'overall-low',
        message: 'Taxa de conversão geral está baixa. Revisar processo de qualificação e follow-up dos leads.'
      })
    }

    return recommendations
  }
}
