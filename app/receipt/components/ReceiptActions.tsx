"use client";

import { Button } from "@/components/ui/button";
import { Share, FileDown } from "lucide-react";
import { ReceiptData } from "@/types/receipt";
import { generateReceiptPDF } from "@/lib/pdf";

interface ReceiptActionsProps {
  data: ReceiptData["data"];
  orderId: string;
}

export function ReceiptActions({ data, orderId }: ReceiptActionsProps) {
  const generatePDF = async () => {
    if (!orderId) return;
    await generateReceiptPDF(data, orderId);
  };

  return (
    <div className="flex gap-2">
      <Button variant="otter" className="flex-1" onClick={generatePDF}>
        <FileDown className="h-4 w-4 mr-2" />
        <span className="font-semibold">Save as PDF</span>
      </Button>
      <Button
        variant="otter"
        className="flex-1"
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: `${data.restaurantName} Receipt`,
              text: `View receipt for ${data.restaurantName} Order #${data.orderNumber}`,
              url: window.location.href,
            });
          }
        }}
      >
        <Share className="h-4 w-4 mr-2" />
        <span className="font-semibold">Share Receipt</span>
      </Button>
    </div>
  );
}
