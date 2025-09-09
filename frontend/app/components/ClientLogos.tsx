"use client";
import React from 'react';
import { motion } from 'framer-motion';

const ClientLogos = () => {
  const logos = [
    { name: 'Apple', logo: '/apple.png' },
    { name: 'DHL', logo: '/DHL.jpg' },
    { name: 'Hermes Supply Chain', logo: '/Hermes.jpg' },
    { name: 'Inland World Logistics', logo: '/Inland.jpg' },
    { name: 'google', logo: '/google.webp' },
    { name: 'nvidia', logo: '/nvidia.png' },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <section >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
        </motion.div>

        {/* Marquee Container */}
        <div className="relative h-[100px] overflow-hidden">
          <div className="absolute inset-0 z-20 w-max">
            <motion.div
              className="flex h-full min-w-max"
              animate={{ x: ['0%', '-100%'] }}
              transition={{
                ease: 'linear',
                duration: 50,
                repeat: Infinity,
              }}
            >
              {[...duplicatedLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-w-[200px] h-25 mx-4"
                >
                  <img 
                    src={logo.logo} 
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
