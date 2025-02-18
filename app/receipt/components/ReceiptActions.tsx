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
      <Button
        className="flex-1 bg-pink-600 hover:bg-pink-700"
        onClick={generatePDF}
      >
        <FileDown className="h-4 w-4 mr-2" />
        <span className="font-semibold">Save as PDFFF</span>
      </Button>
      <Button
        className="flex-1 bg-pink-600 hover:bg-pink-700"
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
