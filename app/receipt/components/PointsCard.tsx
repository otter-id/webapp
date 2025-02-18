"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";

const MotionCard = motion(Card);

interface PointsCardProps {
  data: ReceiptData["data"];
}

export function PointsCard({ data }: PointsCardProps) {
  return (
    <MotionCard
      variants={cardVariants}
      className="rounded-xl border-pink-100 bg-gradient-to-br from-pink-100 to-purple-100"
    >
      <CardContent className="py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-pink-700">
              Points Earned
            </h3>
            <p className="text-sm text-pink-600">
              Keep collecting for rewards!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-pink-600">
              {data.pointsEarned}
            </span>
            <span className="text-3xl">{data.emoji}</span>
          </div>
        </div>
      </CardContent>
    </MotionCard>
  );
}
