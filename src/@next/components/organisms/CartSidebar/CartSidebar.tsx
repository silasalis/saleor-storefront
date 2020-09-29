import React from "react";
import { FormattedMessage } from "react-intl";
import ReactSVG from "react-svg";

import { Button, Loader } from "@components/atoms";
import { CardHeader, CartSummaryCosts } from "@components/molecules";
import { TaxedMoney } from "@components/containers";
import { useHandlerWhenClickedOutside, useNetworkStatus } from "@hooks";
import { ITaxedMoney } from "@types";

import { IItems } from "@saleor/sdk/lib/api/Cart/types";

import cartImg from "images/cart.svg";
import { CartRow, Overlay } from "..";
import * as S from "./styles";

const generateCart = (
  items: IItems,
  removeItem: (variantId: string) => any,
  updateItem: (variantId: string, quantity: number) => any
) => {
  return items?.map(({ id, variant, quantity, totalPrice }, index) => (
    <CartRow
      type="condense"
      key={id ? `id-${id}` : `idx-${index}`}
      index={index}
      id={variant?.product?.id || ""}
      name={variant?.product?.name || ""}
      maxQuantity={variant.quantityAvailable || quantity}
      quantity={quantity}
      onRemove={() => removeItem(variant.id)}
      onQuantityChange={quantity => updateItem(variant.id, quantity)}
      thumbnail={{
        ...variant?.product?.thumbnail,
        alt: variant?.product?.thumbnail?.alt || "",
      }}
      totalPrice={<TaxedMoney taxedMoney={totalPrice} />}
      unitPrice={<TaxedMoney taxedMoney={variant?.pricing?.price} />}
      sku={variant.sku}
      attributes={variant.attributes?.map(attribute => {
        return {
          attribute: {
            id: attribute.attribute.id,
            name: attribute.attribute.name || "",
          },
          values: attribute.values.map(value => {
            return {
              id: value?.id,
              name: value?.name || "",
              value: value?.value,
            };
          }),
        };
      })}
    />
  ));
};

const prepareCartFooter = (
  totalPrice?: ITaxedMoney | null,
  shippingTaxedPrice?: ITaxedMoney | null,
  promoTaxedPrice?: ITaxedMoney | null,
  subtotalPrice?: ITaxedMoney | null
) => (
  <CartSummaryCosts
    subtotalPrice={
      <TaxedMoney data-test="subtotalPrice" taxedMoney={subtotalPrice} />
    }
    totalPrice={<TaxedMoney data-test="totalPrice" taxedMoney={totalPrice} />}
    shippingPrice={
      shippingTaxedPrice &&
      shippingTaxedPrice.gross.amount !== 0 && (
        <TaxedMoney data-test="shippingPrice" taxedMoney={shippingTaxedPrice} />
      )
    }
    discountPrice={
      promoTaxedPrice &&
      promoTaxedPrice.gross.amount !== 0 && (
        <TaxedMoney data-test="discountPrice" taxedMoney={promoTaxedPrice} />
      )
    }
  />
);

export interface ICartSidebar {
  items: IItems;
  removeItem: (variantId: string) => any;
  updateItem: (variantId: string, quantity: number) => any;
  totalPrice?: ITaxedMoney | null;
  shippingTaxedPrice?: ITaxedMoney | null;
  promoTaxedPrice?: ITaxedMoney | null;
  subtotalPrice?: ITaxedMoney | null;
  hide: () => void;
  show: boolean;
  target?: HTMLElement | null;
  continueShopping: () => void;
  goToCart: () => void;
  proceedToCheckout: () => void;
}

const CartSidebar: React.FC<ICartSidebar> = ({
  items,
  removeItem,
  updateItem,
  totalPrice,
  shippingTaxedPrice,
  promoTaxedPrice,
  subtotalPrice,
  hide,
  show,
  target,
  continueShopping,
  goToCart,
  proceedToCheckout,
}: ICartSidebar) => {
  const { online } = useNetworkStatus();

  const { setElementRef } = useHandlerWhenClickedOutside(() => {
    hide();
  });

  const missingVariants = () => {
    return items?.find(item => !item.variant || !item.totalPrice);
  };

  return (
    <Overlay
      position="right"
      duration={0}
      show={show}
      hide={hide}
      target={target}
      testingContext="cartOverlay"
    >
      <S.Wrapper ref={setElementRef()}>
        <CardHeader
          divider
          onHide={hide}
          prefixIcon={<ReactSVG path={cartImg} />}
        >
          <span>
            <FormattedMessage defaultMessage="My Cart" />
          </span>
        </CardHeader>
        <S.Content>
          {!online ? (
            // eslint-disable-next-line react/jsx-curly-brace-presence
            <S.EmptyCart>{"OFFLINE :("}</S.EmptyCart>
          ) : items?.length ? (
            missingVariants() ? (
              <Loader />
            ) : (
              <S.Cart>{generateCart(items, removeItem, updateItem)}</S.Cart>
            )
          ) : (
            <S.EmptyCart>
              <S.EmptyCartTitle>
                <FormattedMessage
                  defaultMessage="Your cart is empty"
                  description="cart sidebar title"
                />
              </S.EmptyCartTitle>
              <S.EmptyCartDescription>
                <FormattedMessage
                  defaultMessage="You haven’t added anything to your bag. We’re sure you’ll find something in our store"
                  description="cart sidebar description"
                />
              </S.EmptyCartDescription>
              <Button
                testingContext="emptyCartHideOverlayButton"
                color="secondary"
                fullWidth
                onClick={continueShopping}
              >
                <FormattedMessage
                  defaultMessage="Continue shopping"
                  description="button"
                />
              </Button>
            </S.EmptyCart>
          )}
        </S.Content>
        {online && !!items?.length && (
          <S.Footer>
            {prepareCartFooter(
              totalPrice,
              shippingTaxedPrice,
              promoTaxedPrice,
              subtotalPrice
            )}
            <Button
              testingContext="gotoBagViewButton"
              color="secondary"
              fullWidth
              onClick={goToCart}
            >
              <FormattedMessage
                defaultMessage="Go to my cart"
                description="button"
              />
            </Button>
            <Button
              testingContext="gotoCheckoutButton"
              color="primary"
              fullWidth
              onClick={proceedToCheckout}
            >
              <FormattedMessage
                defaultMessage="Proceed to Checkout"
                description="button"
              />
            </Button>
          </S.Footer>
        )}
      </S.Wrapper>
    </Overlay>
  );
};

export { CartSidebar };
