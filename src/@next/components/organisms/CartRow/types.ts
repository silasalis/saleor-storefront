import { IImage } from "@types";
import React from "react";

export interface IProps {
  /**
   * Price for single unit
   */
  unitPrice: React.ReactNode;
  /**
   * Price of single unit mupltiplied by quantity
   */
  totalPrice: React.ReactNode;
  /**
   * Name of the product
   */
  name: string;
  /**
   * Stock keeping unit
   */
  sku?: string;
  /**
   * Quantity of particular item
   */
  quantity: number;
  /**
   * Method run when removing item from cart
   */
  onRemove: () => void;
  /**
   * Method run while chaning product quantity
   */
  onQuantityChange: (value: number) => void;
  /**
   * Product thumbnail image
   */
  thumbnail?: IImage;
  /**
   * Variant attributes
   */
  attributes?: Array<{
    attribute: { name: string };
    values: Array<{ name: string }>;
  }>;
}
