"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Store,
  Phone,
  Info,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  Download,
  Share,
  FileDown,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { generateReceiptPDF } from "@/lib/pdf";
import { ReceiptData } from "@/types/receipt";

const receiptDataa = {
  data: {
    restaurantName: "Sharetea",
    restaurantLogo:
      "https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png",
    restaurantAddress: "Mal Taman Anggrek",
    emoji: "🧋",
    orderDateTime: "2025-01-10T21:14:53.020+00:00",
    orderNumber: "A01",
    firstName: "Meisy",
    items: [
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
      {
        name: "Matcha Milk Tea",
        quantity: 1,
        price: 26000,
        image:
          "https://www.texanerin.com/content/uploads/2023/05/matcha-with-boba-image-1200.jpg",
        modifiers: [
          {
            name: "Ice Level: Less Ice",
            price: 3000,
          },
          {
            name: "Grass Jelly",
            price: 2500,
          },
          {
            name: "Medium",
            price: 2000,
          },
          {
            name: "Sugar Level: 50%",
            price: 2000,
          },
        ],
      },
    ],
    subtotal: 248500,
    taxesAndFees: 0,
    total: 248500,
    pointsEarned: 1,
    paymentMethod: "QR_CODE",
    phoneNumber: "0215658406",
    pickupInstructions:
      "Please show your number on your device to one of the team members for pickup. Thank you",
    googleMapsUrl:
      "https://www.google.com/maps/place/Sharetea/@-6.221919,106.828125,15z/data=!4m2!3m1!1s0x2e69f199e229c78f:0x2e69f199e229c78f",
  },
};

const MotionCard = motion(Card);

export default function Receipt() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [splitBillStep, setSplitBillStep] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [people, setPeople] = useState<string[]>([]);
  const [itemAssignments, setItemAssignments] = useState<{
    [key: string]: string;
  }>({});
  const [splitBillResult, setSplitBillResult] = useState<{
    [key: string]: number;
  }>({});
  const [duplicateNameError, setDuplicateNameError] = useState<string | null>(
    null
  );
  const [itemAssignmentError, setItemAssignmentError] = useState<string | null>(
    null
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const fetchReceiptData = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/receipt?id=${orderId}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setReceiptData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              `Failed to fetch receipt data: ${err.message}`
          );
          console.error("Axios error details:", {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
          });
        } else {
          setError("An unexpected error occurred");
        }
        console.error("Error fetching receipt data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceiptData();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-pink-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !receiptData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto flex items-center justify-center">
        <Card className="w-full border-pink-100">
          <CardContent className="py-8 text-center space-y-4">
            <div className="text-pink-600 mb-4">
              <Info className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {error || "Receipt not found"}
            </h2>
            <p className="text-gray-500">
              Please check the order ID and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data } = receiptDataa;
  const orderDate = new Date(data.orderDateTime);

  const handleSplitBill = () => {
    setSplitBillStep(1);
    setNumberOfPeople(2);
    setPeople([]);
    setItemAssignments({});
    setSplitBillResult({});
  };

  const handleCancelSplitBill = () => {
    setSplitBillStep(0);
    setNumberOfPeople(2);
    setPeople([]);
    setItemAssignments({});
    setSplitBillResult({});
  };

  const handleNextStep = () => {
    if (splitBillStep === 1) {
      setPeople(Array(numberOfPeople).fill(""));
      setSplitBillStep(2);
    } else if (splitBillStep === 2) {
      if (people.some((name) => name.trim() === "")) {
        setDuplicateNameError("All name fields must be filled out.");
        return;
      }
      if (new Set(people).size !== people.length) {
        setDuplicateNameError("Each person must have a unique name.");
        return;
      }
      setDuplicateNameError(null);
      setSplitBillStep(3);
    } else if (splitBillStep === 3) {
      const totalItems = data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      if (Object.keys(itemAssignments).length !== totalItems) {
        setItemAssignmentError("All items must be assigned to someone.");
        return;
      }
      setItemAssignmentError(null);
      calculateSplitBill();
      setSplitBillStep(4);
    }
  };

  const handlePreviousStep = () => {
    if (splitBillStep === 4) {
      // When going back from the result step, don't reset itemAssignments
      setSplitBillStep(3);
    } else {
      setSplitBillStep(splitBillStep - 1);
    }
  };

  const handlePersonNameChange = (index: number, name: string) => {
    const newPeople = [...people];
    newPeople[index] = name;
    setPeople(newPeople);
    setDuplicateNameError(null);
  };

  const handleItemAssignment = (itemId: string, person: string) => {
    setItemAssignments({ ...itemAssignments, [itemId]: person });
    setItemAssignmentError(null);
  };

  const calculateSplitBill = () => {
    const result: { [key: string]: number } = {};
    people.forEach((person) => (result[person] = 0));

    data.items.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const assignmentKey = `${item.name}-${itemIndex}-${i}`;
        const assignedPerson = itemAssignments[assignmentKey];
        if (assignedPerson) {
          const itemTotal =
            item.price +
            item.modifiers.reduce((sum, mod) => sum + mod.price, 0);
          result[assignedPerson] += itemTotal;
        }
      }
    });

    const totalAssigned = Object.values(result).reduce(
      (sum, value) => sum + value,
      0
    );

    // Calculate tax ratio only if totalAssigned is not 0
    const taxRatio = totalAssigned > 0 ? data.taxesAndFees / totalAssigned : 0;

    // Apply tax ratio to each person's amount
    Object.keys(result).forEach((person) => {
      const personAmount = result[person];
      const personTax = personAmount * taxRatio;
      result[person] = Math.round(personAmount + personTax);
    });

    setSplitBillResult(result);
  };

  const renderSplitBillContent = () => {
    switch (splitBillStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              How many people are splitting the bill?
            </h2>
            <div className="flex items-center space-x-2">
              <Label htmlFor="numberOfPeople" className="text-black">
                Number of People
              </Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-r-none border-pink-200"
                  onClick={() =>
                    setNumberOfPeople((prev) => Math.max(2, prev - 1))
                  }
                >
                  -
                </Button>
                <Input
                  id="numberOfPeople"
                  type="text"
                  inputMode="none"
                  value={numberOfPeople}
                  readOnly
                  className="w-14 h-8 text-center rounded-none border-x-0 border-pink-200 focus:ring-pink-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-l-none border-pink-200"
                  onClick={() => setNumberOfPeople((prev) => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Enter the names of the people splitting the bill
            </h2>
            {Array.from({ length: numberOfPeople }).map((_, index) => (
              <div key={index}>
                <Label htmlFor={`person${index}`} className="text-black">
                  Person {index + 1}
                </Label>
                <Input
                  id={`person${index}`}
                  value={people[index] || ""}
                  onChange={(e) =>
                    handlePersonNameChange(index, e.target.value)
                  }
                  className="border-pink-200 focus:ring-pink-500"
                />
              </div>
            ))}
            {duplicateNameError && (
              <p className="text-red-500 text-sm">{duplicateNameError}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Assign items to each person
            </h2>
            {data.items.flatMap((item, itemIndex) =>
              Array.from({ length: item.quantity }, (_, index) => {
                const uniqueKey = `item-${itemIndex}-${index}`;
                const assignmentKey = `${item.name}-${itemIndex}-${index}`;
                return (
                  <div key={uniqueKey} className="space-y-2">
                    <span className="text-black font-medium">
                      {item.name}
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        {item.modifiers
                          .filter((mod) => mod.price > 0)
                          .map((mod) => mod.name.split(":")[0])
                          .join(", ")}
                        )
                      </span>
                    </span>
                    <Select
                      onValueChange={(value) =>
                        handleItemAssignment(assignmentKey, value)
                      }
                      defaultValue={itemAssignments[assignmentKey]}
                    >
                      <SelectTrigger className="w-full border-pink-200">
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        {people.map((person, idx) => (
                          <SelectItem key={idx} value={person}>
                            {person}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })
            )}
            {itemAssignmentError && (
              <p className="text-red-500 text-sm">{itemAssignmentError}</p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Split Bill Result</h2>
            {Object.entries(splitBillResult).map(([person, amount]) => (
              <div key={person} className="flex justify-between text-black">
                <span>{person}</span>
                <span>Rp {amount.toLocaleString()}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-black">
              <span>Total</span>
              <span>Rp {data.total.toLocaleString()}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const generatePDF = async () => {
    if (!orderId) return;
    await generateReceiptPDF(data, orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-4 px-4 max-w-md mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <MotionCard
          variants={cardVariants}
          className="rounded-xl border-pink-100"
        >
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Image
              src={data.restaurantLogo || "/placeholder.svg"}
              alt={data.restaurantName}
              width={60}
              height={60}
              className="rounded-full"
              draggable={false}
            />
            <div>
              <CardTitle className="text-xl">{data.restaurantName}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.restaurantAddress}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-5xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
                #{data.orderNumber}
              </p>
              <p className="text-2xl font-medium mb-2">{data.firstName}</p>
              <p className="text-sm text-muted-foreground">
                {format(orderDate, "PPpp")}
              </p>
            </div>
          </CardContent>
        </MotionCard>

        {splitBillStep === 0 && (
          <>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-pink-600 hover:bg-pink-700"
                onClick={generatePDF}
              >
                <FileDown className="h-4 w-4 mr-2" />
                <span className="font-semibold">Save as PDF</span>
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

            <MotionCard
              variants={cardVariants}
              className="rounded-xl border-pink-100"
            >
              <CardHeader>
                <CardTitle className="text-lg">Pickup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Store className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-bold">Store Location</p>
                    <p className="text-sm text-muted-foreground">
                      {data.restaurantAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-bold">Store Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {data.phoneNumber}
                    </p>
                  </div>
                </div>
                {data.pickupInstructions && (
                  <div className="flex items-start space-x-3">
                    <Info className="h-8 w-8 text-pink-600" />
                    <div>
                      <p className="font-bold">Pickup Instructions</p>
                      <p className="text-sm text-muted-foreground">
                        {data.pickupInstructions}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => window.open(data.googleMapsUrl, "_blank")}
                >
                  <MapPin className=" h-4 w-4" />
                  <span className="font-semibold">Get Directions</span>
                </Button>
              </CardContent>
            </MotionCard>

            <MotionCard
              variants={cardVariants}
              className="rounded-xl border-pink-100"
            >
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex space-x-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={96}
                        height={80}
                        className="w-24 h-20 object-cover rounded-md flex-shrink-0"
                        draggable={false}
                      />
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-start">
                          <span
                            className="font-medium pr-2 break-words"
                            style={{ maxWidth: "calc(100% - 80px)" }}
                          >
                            {item.name}
                          </span>
                          <span className="whitespace-nowrap">
                            Rp {item.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <div className="space-y-1">
                          {item.modifiers.map((modifier, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-muted-foreground"
                            >
                              <span className="pr-2">{modifier.name}</span>
                              {modifier.price > 0 && (
                                <span className="whitespace-nowrap">
                                  +Rp {modifier.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index < data.items.length - 1 && (
                      <Separator className="bg-pink-100" />
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </MotionCard>

            <MotionCard
              variants={cardVariants}
              className="rounded-xl border-pink-100"
            >
              <CardContent className="space-y-2 py-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {data.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes and Fees</span>
                  <span>Rp {data.taxesAndFees.toLocaleString()}</span>
                </div>
                <Separator className="bg-pink-100" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {data.total.toLocaleString()}</span>
                </div>
                <Button
                  className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={handleSplitBill}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-semibold">Split Bill</span>
                </Button>
              </CardContent>
            </MotionCard>

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
          </>
        )}

        {splitBillStep > 0 && (
          <MotionCard
            variants={cardVariants}
            className="rounded-xl border-pink-100"
          >
            <CardContent className="py-4">
              {renderSplitBillContent()}
              <div className="flex justify-between mt-4">
                {splitBillStep === 1 ? (
                  <Button
                    onClick={handleCancelSplitBill}
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    Cancel
                  </Button>
                ) : splitBillStep > 1 && splitBillStep < 4 ? (
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="border-pink-300 text-pink-700 hover:bg-pink-50"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : null}
                {splitBillStep < 4 && (
                  <Button
                    onClick={handleNextStep}
                    className="bg-pink-600 hover:bg-pink-700 ml-auto"
                    disabled={
                      (splitBillStep === 2 &&
                        (duplicateNameError !== null ||
                          people.some((name) => name.trim() === ""))) ||
                      (splitBillStep === 3 &&
                        Object.keys(itemAssignments).length !==
                          data.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          ))
                    }
                  >
                    {splitBillStep === 3 ? "Calculate" : "Next"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {splitBillStep === 4 && (
                  <Button
                    onClick={() => setSplitBillStep(0)}
                    className="bg-pink-600 hover:bg-pink-700 ml-auto"
                  >
                    Done
                  </Button>
                )}
              </div>
            </CardContent>
          </MotionCard>
        )}

        <motion.div
          variants={cardVariants}
          className="text-center text-sm text-muted-foreground mb-4"
        >
          <span>Powered by</span>
          <Image
            src="/img/Asset 2.svg"
            alt="Otter"
            width={60}
            height={20}
            className="inline-block pl-2"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
