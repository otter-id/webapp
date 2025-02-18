import { useState } from "react";
import { ReceiptData } from "@/types/receipt";

export const useSplitBill = (data: ReceiptData["data"]) => {
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

    const taxRatio = totalAssigned > 0 ? data.taxesAndFees / totalAssigned : 0;

    Object.keys(result).forEach((person) => {
      const personAmount = result[person];
      const personTax = personAmount * taxRatio;
      result[person] = Math.round(personAmount + personTax);
    });

    setSplitBillResult(result);
  };

  return {
    splitBillStep,
    numberOfPeople,
    people,
    itemAssignments,
    splitBillResult,
    duplicateNameError,
    itemAssignmentError,
    handleSplitBill,
    handleCancelSplitBill,
    handleNextStep,
    handlePreviousStep,
    handlePersonNameChange,
    handleItemAssignment,
    setNumberOfPeople,
  };
};
