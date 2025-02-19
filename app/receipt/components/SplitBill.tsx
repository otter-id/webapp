"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { cardVariants } from "../utils/animations";
import { ReceiptData } from "@/types/receipt";
import { useSplitBill } from "../hooks/useSplitBill";

const MotionCard = motion(Card);

interface SplitBillProps {
  data: ReceiptData["data"];
  onClose: () => void;
  splitBillState: ReturnType<typeof useSplitBill>;
}

export function SplitBill({ data, onClose, splitBillState }: SplitBillProps) {
  const {
    splitBillStep,
    numberOfPeople,
    people,
    itemAssignments,
    splitBillResult,
    duplicateNameError,
    itemAssignmentError,
    handleNextStep,
    handlePreviousStep,
    handlePersonNameChange,
    handleItemAssignment,
    setNumberOfPeople,
  } = splitBillState;

  const renderContent = () => {
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
                  variant="outline-otter"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
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
                  className="w-14 h-8 text-center rounded-none border-x-0 border-yellow-400 focus:ring-yellow-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="outline-otter"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
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
                  variant="otter"
                  id={`person${index}`}
                  value={people[index] || ""}
                  onChange={(e) =>
                    handlePersonNameChange(index, e.target.value)
                  }
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
                      <SelectTrigger className="w-full border-yellow-400">
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

  if (splitBillStep === 0) {
    return null;
  }

  return (
    <MotionCard variants={cardVariants} className="rounded-xl">
      <CardContent className="py-4">
        {renderContent()}
        <div className="flex justify-between mt-4">
          {splitBillStep === 1 ? (
            <Button onClick={onClose} variant="outline-otter">
              Cancel
            </Button>
          ) : splitBillStep > 1 && splitBillStep < 4 ? (
            <Button variant="outline-otter" onClick={handlePreviousStep}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : null}
          {splitBillStep < 4 && (
            <Button
              variant="otter"
              onClick={handleNextStep}
              disabled={
                (splitBillStep === 2 &&
                  (duplicateNameError !== null ||
                    people.some((name) => name.trim() === ""))) ||
                (splitBillStep === 3 &&
                  Object.keys(itemAssignments).length !==
                    data.items.reduce((sum, item) => sum + item.quantity, 0))
              }
            >
              {splitBillStep === 3 ? "Calculate" : "Next"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {splitBillStep === 4 && (
            <Button variant="otter" onClick={onClose} className="ml-auto">
              Done
            </Button>
          )}
        </div>
      </CardContent>
    </MotionCard>
  );
}
