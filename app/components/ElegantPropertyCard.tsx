'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Square, 
  Heart, 
  Share2, 
  Eye,
  ArrowRight,
  Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { formatarMoeda } from '@/lib/utils';

interface PropertyImage {
  imagemUrl: string;
  alt?: string;
}

interface PropertyCardProps {
  id: string;
  titulo: string;
  slug: string;
  preco: number;
  finalidade: 'venda' | 'aluguel';
  bairro?: string;
  cidade?: string;
  dormitorios?: number;
  banheiros?: number;
  vagas?: number;
  areaUtil?: number;
  imagem?: PropertyImage;
  destaque?: boolean;
  className?: string;
}

const ElegantPropertyCard: React.FC<PropertyCardProps> = ({
  id,
  titulo,
  slug,
  preco,
  finalidade,
  bairro,
  cidade,
  dormitorios,
  banheiros,
  vagas,
  areaUtil,
  imagem,
  destaque = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    hover: {
      scale: 1.02,
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.4 } }
  };

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } }
  };

  const badgeVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.05, opacity: 1 }
  };

  const actionButtonVariants = {
    rest: { scale: 1, opacity: 0 },
    hover: { scale: 1, opacity: 1, transition: { delay: 0.1 } }
  };

  return (
    <motion.article
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 ${className}`}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <motion.div variants={imageVariants}>
          <Image
            src={imagem?.imagemUrl || '/images/property-placeholder.jpg'}
            alt={imagem?.alt || titulo}
            fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>

        {/* Image Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
          variants={overlayVariants}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <motion.div 
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              finalidade === 'venda' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-blue-500 text-white'
            }`}
            variants={badgeVariants}
          >
            {finalidade === 'venda' ? 'Venda' : 'Aluguel'}
          </motion.div>
          
          {destaque && (
            <motion.div 
              className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-medium flex items-center gap-1"
              variants={badgeVariants}
            >
              <Star className="w-3 h-3" />
              Destaque
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            variants={actionButtonVariants}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorited(!isFavorited);
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} 
            />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            variants={actionButtonVariants}
            onClick={(e) => e.preventDefault()}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-5 h-5 text-slate-600" />
          </motion.button>
        </div>

        {/* Quick View Button */}
        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          variants={actionButtonVariants}
        >
          <Button 
            size="sm" 
            className="bg-white/90 hover:bg-white text-slate-900 backdrop-blur-sm"
            onClick={(e) => e.preventDefault()}
          >
            <Eye className="w-4 h-4 mr-2" />
            Visita Virtual
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Price & Title */}
        <div className="space-y-2">
          <motion.div 
            className="text-2xl font-bold text-slate-900"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {formatarMoeda(preco)}
          </motion.div>
          
          <h3 className="text-lg font-medium text-slate-800 line-clamp-2 leading-tight">
            {titulo}
          </h3>
          
          <div className="flex items-center text-slate-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {[bairro, cidade].filter(Boolean).join(', ')}
          </div>
        </div>

        {/* Features */}
        <div className="flex justify-between items-center text-sm text-slate-600">
          <div className="flex gap-4">
            {dormitorios && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{dormitorios}</span>
              </div>
            )}
            {banheiros && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{banheiros}</span>
              </div>
            )}
            {vagas && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span>{vagas}</span>
              </div>
            )}
          </div>
          
          {areaUtil && (
            <div className="flex items-center gap-1 text-slate-500">
              <Square className="w-4 h-4" />
              <span>{areaUtil}m²</span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <Link href={`/imovel/${slug}`}>
            <Button 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white group"
              size="lg"
            >
              Ver Detalhes
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {!imageLoaded && (
          <motion.div
            className="absolute inset-0 bg-slate-100 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default ElegantPropertyCard;
