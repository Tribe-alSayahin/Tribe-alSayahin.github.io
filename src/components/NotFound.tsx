'use client';

import React from 'react';
import { Compass, Home, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface NotFoundProps {
  onBackToHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onBackToHome }) => {
  const handleGoHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      data-app-ready="true"
      className="min-h-screen bg-ink text-sand flex flex-col justify-between relative overflow-hidden select-none"
      role="main"
      aria-label="صفحة الخطأ 404 - الصفحة غير موجودة"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '88px 52px' }} />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-radial from-brass/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-radial from-olive-2/5 to-transparent blur-3xl pointer-events-none" />

      {/* Sadu Top Accent */}
      <div className="sadu-band w-full opacity-60 h-[26px]" aria-hidden="true" />

      {/* Centered Main Content Card */}
      <div className="max-w-2xl mx-auto px-6 py-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Animated Heritage Compass Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-40 h-40 flex items-center justify-center mb-8"
        >
          {/* Outer brass ring with degree markings */}
          <div className="absolute inset-0 rounded-full border border-brass/35 animate-[spin_120s_linear_infinite]" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] h-2 bg-brass/40"
                style={{ transform: `rotate(${i * 30}deg) translateY(-100%)`, left: '50%' }}
              />
            ))}
          </div>

          {/* Inner ambient glowing circles */}
          <div className="absolute w-32 h-32 rounded-full bg-brass/5 border border-brass/20 flex items-center justify-center shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]">
            {/* Center pointer needle */}
            <Compass className="w-16 h-16 text-brass-lt animate-pulse" />
          </div>

          {/* Glowing stardust effect */}
          <div className="absolute -inset-4 bg-radial from-brass/10 to-transparent blur-xl rounded-full pointer-events-none" />
        </motion.div>

        {/* 404 Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Badge variant="brass" showDot={true} className="text-xs px-4 py-1.5 font-kufi">
            رمز الخطأ ٤٠٤ • طريق مجهول
          </Badge>
        </motion.div>

        {/* Poetic & Elegant Heading in Aref Ruqaa font */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-sand leading-tight">
            تِهْتَ في فَيَافي الصَّحْرَاء...
          </h1>
          <p className="font-kufi text-brass-lt text-base md:text-lg font-medium leading-relaxed max-w-lg mx-auto">
            عذراً، هذه الديار التي تبحث عنها لم يطأها أثرٌ في سجلاتنا
          </p>
        </motion.div>

        {/* Beautiful Sadu Divider in Between Text */}
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-[15px] bg-repeat mb-6"
          style={{ backgroundImage: 'var(--sadu)', backgroundSize: '30px 15px' }}
          aria-hidden="true"
        />

        {/* Secondary description text in Cairo font */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sand-dim text-sm md:text-base leading-relaxed max-w-md mb-10 font-sans"
        >
          ربما كتبت عنوان الصفحة بشكل غير دقيق، أو أن الروابط القديمة قد اندثرت مع الرياح كأثر الرمال في الصحراء الخالية.
        </motion.p>

        {/* Back to Home Button using standard Button UI */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleGoHome}
            className="group px-8"
            aria-label="العودة إلى ديار قبيلة السياحين الرئيسية"
          >
            <Home className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
            <span>العودة للديار الرئيسية</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.history.back()}
            className="px-6"
            aria-label="الرجوع إلى الصفحة السابقة"
          >
            <ChevronLeft className="w-4 h-4 ml-1" />
            <span>رجوع</span>
          </Button>
        </motion.div>

      </div>

      {/* Sadu Bottom Accent & Footer */}
      <div className="flex flex-col items-center w-full z-10 relative">
        <div className="text-[10px] font-kufi text-brass-lt/50 mb-3 tracking-widest uppercase">
          الموقع الرسمي لقبيلة السياحين
        </div>
        <div className="sadu-band w-full opacity-60 h-[26px]" aria-hidden="true" />
      </div>
    </div>
  );
};
