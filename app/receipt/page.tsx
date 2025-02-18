"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useReceiptData } from "./hooks/useReceiptData";
import { useSplitBill } from "./hooks/useSplitBill";
import { containerVariants } from "./utils/animations";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { ReceiptHeader } from "./components/ReceiptHeader";
import { ReceiptActions } from "./components/ReceiptActions";
import { PickupInfo } from "./components/PickupInfo";
import { OrderDetails } from "./components/OrderDetails";
import { OrderSummary } from "./components/OrderSummary";
import { PointsCard } from "./components/PointsCard";
import { SplitBill } from "./components/SplitBill";
import { Footer } from "./components/Footer";

// Temporary data for development
import { receiptDataa } from "./data";

const ReceiptContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { receiptData, isLoading, error } = useReceiptData(orderId);
  const splitBillState = useSplitBill(receiptDataa.data);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !receiptData) {
    return <ErrorState error={error || "Receipt not found"} />;
  }

  const { data } = receiptDataa; // Replace with receiptData when API is ready

  // If split bill is active, show only the split bill UI
  if (splitBillState.splitBillStep > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <ReceiptHeader data={data} />
          <SplitBill
            data={data}
            onClose={splitBillState.handleCancelSplitBill}
            splitBillState={splitBillState}
          />
          <Footer />
        </motion.div>
      </div>
    );
  }

  // Otherwise show the main receipt content
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <ReceiptHeader data={data} />
        <ReceiptActions data={data} orderId={orderId || ""} />
        <PickupInfo data={data} />
        <OrderDetails data={data} />
        <OrderSummary
          data={data}
          onSplitBill={splitBillState.handleSplitBill}
        />
        <PointsCard data={data} />
        <Footer />
      </motion.div>
    </div>
  );
};

export default function Receipt() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReceiptContent />
    </Suspense>
  );
}
