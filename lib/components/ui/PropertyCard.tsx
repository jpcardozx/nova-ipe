'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Home, Bed, Bath, Car } from 'lucide-react';
import { Card, CardContent } from '@/lib/components/ui/Card';
import { Typography } from '@/lib/components/ui/Typography';
import { Button } from '@/lib/components/ui/Button';

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  area?: number;
  imageUrl: string;
  slug: string;
  purpose: 'sale' | 'rent';
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  parkingSpots,
  area,
  imageUrl,
  slug,
  purpose,
}: PropertyCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card variant="interactive" className="group overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/images/placeholder-property.jpg'}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            {purpose === 'sale' ? 'Venda' : 'Aluguel'}
          </span>
        </div>
      </div>

      <CardContent>
        <div className="mb-3">
          <Typography variant="h4" className="line-clamp-2 mb-2">
            {title}
          </Typography>
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <Typography variant="small">{location}</Typography>
          </div>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 mb-4 text-gray-600">
          {bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{bedrooms}</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{bathrooms}</span>
            </div>
          )}
          {parkingSpots && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span className="text-sm">{parkingSpots}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              <span className="text-sm">{area}m²</span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="text-emerald-600">
            {formatPrice(price)}
          </Typography>
          <Link href={`/imovel/${slug}`}>
            <Button size="sm" variant="outline">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}