import jsPDF from "jspdf";
import { format } from "date-fns";
import { ReceiptData } from "@/types/receipt";

export function generateReceiptPDF(data: ReceiptData["data"]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper function for right-aligned text
  const addRightAlignedText = (text: string, y: number, xOffset = 0) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(text, pageWidth - margin - textWidth - xOffset, y);
  };

  // Helper function for centered text
  const addCenteredText = (text: string, y: number) => {
    const textWidth =
      (doc.getStringUnitWidth(text) * doc.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Add horizontal line
  const addHorizontalLine = (y: number) => {
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
  };

  // Header
  doc.setFontSize(24);
  addCenteredText(data.restaurantName, yPos + 10);
  yPos += 15;

  doc.setFontSize(11);
  addCenteredText(data.restaurantAddress, yPos + 5);
  yPos += 10;

  // Order Info
  doc.setFontSize(12);
  doc.text(`Order #${data.orderNumber}`, margin, yPos + 10);
  doc.text(`Customer: ${data.firstName}`, margin, yPos + 15);
  doc.text(
    `Order Date: ${format(new Date(data.orderDateTime), "PPpp")}`,
    margin,
    yPos + 20
  );
  yPos += 30;

  addHorizontalLine(yPos);
  yPos += 10;

  // Items Header
  doc.setFont("helvetica", "bold");
  doc.text("Item", margin, yPos);
  doc.text("Qty", margin + 100, yPos);
  addRightAlignedText("Price", yPos);
  doc.setFont("helvetica", "normal");
  yPos += 5;

  addHorizontalLine(yPos);
  yPos += 10;

  // Items
  data.items.forEach((item) => {
    doc.setFont("helvetica", "bold");
    doc.text(item.name, margin, yPos);
    doc.text(item.quantity.toString(), margin + 100, yPos);
    addRightAlignedText(`Rp ${item.price.toLocaleString()}`, yPos);
    doc.setFont("helvetica", "normal");
    yPos += 7;

    // Modifiers
    item.modifiers.forEach((mod) => {
      const modText = `• ${mod.name}`;
      doc.setFontSize(10);
      doc.text(modText, margin + 5, yPos);
      if (mod.price > 0) {
        addRightAlignedText(`Rp ${mod.price.toLocaleString()}`, yPos);
      }
      doc.setFontSize(12);
      yPos += 5;
    });
    yPos += 3;
  });

  yPos += 5;
  addHorizontalLine(yPos);
  yPos += 15;

  // Totals
  const totalsX = pageWidth - margin - 80;
  doc.text("Subtotal:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.subtotal.toLocaleString()}`, yPos);
  yPos += 7;

  doc.text("Taxes & Fees:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.taxesAndFees.toLocaleString()}`, yPos);
  yPos += 7;

  addHorizontalLine(yPos);
  yPos += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsX, yPos);
  addRightAlignedText(`Rp ${data.total.toLocaleString()}`, yPos);
  doc.setFont("helvetica", "normal");

  // Footer
  const footerY = doc.internal.pageSize.height - margin;
  doc.setFontSize(9);
  doc.text(`Generated on: ${format(new Date(), "PPpp")}`, margin, footerY);
  addRightAlignedText("Page 1/1", footerY);

  // Save the PDF
  doc.save(`receipt-${data.orderNumber}.pdf`);
}
