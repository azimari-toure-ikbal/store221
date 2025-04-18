// hooks/useCart.ts

import {
  CartItem,
  PANTS_WEIGHT,
  SHIRT_WEIGHT,
  SUITS_WEIGHT,
  SUR_MESURE_PRICE,
} from "@/config";
import {
  cartAtom,
  currencyAtom,
  deliveryAreaAtom,
  paymentGatewayAtom,
} from "@/lib/atoms";
import { generateUUIDv4, inStock } from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAtom, useAtomValue } from "jotai";
import isEqual from "lodash/isEqual";
import React, { useMemo } from "react";
import { toast } from "sonner";

// export const inStock = (product: CartItem, quantity: number): boolean => {
//   return product.quantity >= quantity;
// };

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const currency = useAtomValue(currencyAtom);
  const paymentGateway = useAtomValue(paymentGatewayAtom);
  const deliveryArea = useAtomValue(deliveryAreaAtom);

  const { user } = useKindeBrowserClient();
  // const [sessionId, setSessionId] = useAtom(sessionAtom);
  const [sessionId, setSessionId] = React.useState("");

  // const { mutate: syncCart } = trpc.carts.syncCart.useMutation({
  //   onError: (error) => {
  //     console.error(error);
  //     toast.error(error.message);
  //   },
  // });

  React.useEffect(() => {
    if (!sessionId || sessionId === "") {
      // console.info("Nous ne pouvons pas trouver votre session");
      // TODO: Crypter la session
      setSessionId(generateUUIDv4());
    }
  }, [sessionId, user, cart]);

  const { data } = trpc.carts.getCart.useQuery(
    { sessionId },
    {
      enabled: sessionId !== "",
    },
  );

  const { data: dbUser } = trpc.users.getCurrentUser.useQuery();

  React.useEffect(() => {
    if (data) {
      setCart({
        id: data.id,
        items: data.items.map((item) => {
          return {
            ...item,
          };
        }),
        sessionId,
        // userId: data.userId,
      });
    }
  }, [data]);

  const utils = trpc.useUtils();
  //
  // CREATE CART
  //
  const { mutate: createCart, isPending: creatingCart } =
    trpc.carts.createCart.useMutation({
      onMutate: async (input) => {
        // Cancel any outgoing refetches.
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        // Optimistically set the cart.
        setCart((prev) => {
          if (!prev) return prev;

          return {
            id: input.id,
            items: input.cartItems.map((item) => ({
              name: item.name,
              productId: item.id,
              image: item.image,
              productType: item.productType,
              quantity: item.quantity,
              price: item.price,
              stock: item.stock,
              options: item.options,
              rate: item.rate,
              currency: item.currency,
            })),
            sessionId: input.sessionId,
          };
        });
        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) {
          setCart(context.previousCart);
        }
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  //
  // ADD PRODUCT
  //
  const { mutate: addProduct, isPending: addingProduct } =
    trpc.carts.addProductToCart.useMutation({
      onMutate: async (input) => {
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        setCart((prev) =>
          prev
            ? {
                ...prev,
                items: [
                  ...prev.items,
                  {
                    name: input.item.name,
                    productId: input.item.id,
                    image: input.item.image,
                    productType: input.item.productType,
                    quantity: input.item.quantity,
                    price: input.item.price,
                    stock: input.item.stock,
                    options: input.item.options,
                    rate: input.item.rate,
                    currency: input.item.currency,
                  },
                ],
              }
            : prev,
        );

        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) {
          setCart(context.previousCart);
        }
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  //
  // UPDATE ITEM QUANTITY (generic)
  //
  const { mutate: updateQuantity, isPending: updatingQuantity } =
    trpc.carts.updateItemQuantity.useMutation({
      onMutate: async (input) => {
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        setCart((prev) => {
          if (!prev) return prev;
          const itemIndex = prev.items.findIndex(
            (item) => item.productId === input.productId,
          );
          if (itemIndex > -1) {
            const updatedItems = [...prev.items];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + input.quantity,
            };
            return { ...prev, items: updatedItems };
          }
          return prev;
        });
        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) setCart(context.previousCart);
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  //
  // INCREMENT QUANTITY
  //
  const { mutate: incrementQuantity, isPending: incrementing } =
    trpc.carts.incrementQuantity.useMutation({
      onMutate: async (input) => {
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        setCart((prev) => {
          if (!prev) return prev;
          const itemIndex = prev.items.findIndex(
            (item) => item.productId === input.productId,
          );
          if (itemIndex > -1) {
            const updatedItems = [...prev.items];
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + input.quantity,
            };
            return { ...prev, items: updatedItems };
          }
          return prev;
        });
        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) setCart(context.previousCart);
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  //
  // DECREMENT QUANTITY
  //
  const { mutate: decrementQuantity, isPending: decrementing } =
    trpc.carts.decrementQuantity.useMutation({
      onMutate: async (input) => {
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        setCart((prev) => {
          if (!prev) return prev;
          const itemIndex = prev.items.findIndex(
            (item) => item.productId === input.productId,
          );
          if (itemIndex > -1) {
            const updatedItems = [...prev.items];
            const newQuantity =
              updatedItems[itemIndex].quantity - input.quantity;
            if (newQuantity <= 0) {
              // Remove the item if quantity goes to 0 or below.
              updatedItems.splice(itemIndex, 1);
            } else {
              updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity: newQuantity,
              };
            }
            return { ...prev, items: updatedItems };
          }
          return prev;
        });
        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) setCart(context.previousCart);
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  //
  // REMOVE PRODUCT
  //
  const { mutate: removeProduct, isPending: removing } =
    trpc.carts.removeProductFromCart.useMutation({
      onMutate: async (input) => {
        await utils.carts.getCart.cancel({ sessionId });
        const previousCart = utils.carts.getCart.getData({ sessionId });
        setCart((prev) => {
          if (!prev) return prev;
          const updatedItems = prev.items.filter(
            (item) => item.productId !== input.productId,
          );
          // If no items remain, you may want to clear the cart entirely.
          if (updatedItems.length === 0) {
            dropCart(); // Implement dropCart() to clear the cart state.
            return { ...prev, items: [] };
          }
          return { ...prev, items: updatedItems };
        });
        return { previousCart };
      },
      onError: (error, input, context) => {
        toast.error(error.message);
        if (context?.previousCart) setCart(context.previousCart);
      },
      onSettled: () => {
        utils.carts.getCart.invalidate({ sessionId });
      },
    });

  const { mutate: drop, isPending: droppingCart } =
    trpc.carts.dropCart.useMutation({
      onSuccess: () => {
        setCart(undefined);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const getCart = () => {
    return cart;
  };

  const addProductToCart = async (product: CartItem, quantity: number = 1) => {
    // console.log("addProductToCart quantity is in use-cart: ", quantity);

    // No cart found, checking for user authentication...
    if (!cart) {
      if (!inStock(product, quantity)) {
        return toast.warning(
          "Action impossible. Vous tenter d'ajouter plus de produits que disponible dans le stock",
        );
      }

      const newCart = {
        id: generateUUIDv4(),
        items: [product],
        sessionId,
        userId: null,
      };

      // No user authenticated, creating an anonymous cart...
      if (!user) {
        console.log(
          "No cart found, no user authenticated, creating an anonymous cart...",
        );
        createCart({
          ...newCart,
          cartItems: [
            {
              name: product.name,
              id: product.productId,
              image: product.image,
              productType: product.productType,
              quantity,
              price: product.price,
              stock: product.stock,
              options: product.options,
              rate: currency.rate,
              currency: currency.code,
            },
          ],
        });

        return;
      }

      // User authenticated, creating a cart for the user...
      console.log(
        "No cart found, user is authenticated, syncing cart with the user",
      );

      if (!dbUser) return;

      createCart({
        ...newCart,
        cartItems: [
          {
            ...product,
            name: product.name,
            id: product.productId,
            image: product.image,
            quantity,
            productType: product.productType,
            price: product.price,
            stock: product.stock,
            options: product.options,
            rate: currency.rate,
            currency: currency.code,
          },
        ],
      });
    }

    if (cart) {
      const existingItemIndex = cart.items.findIndex((item) => {
        const itemOptions = Object.fromEntries(
          Object.entries(item.options).filter(
            ([_, value]) => value !== undefined,
          ),
        );

        return (
          item.productId === product.productId &&
          isEqual(itemOptions, product.options)
        );
      });

      if (existingItemIndex > -1) {
        // Product with the same options is already in the cart
        const existingItem = cart.items[existingItemIndex];

        if (!inStock(existingItem, existingItem.quantity + quantity)) {
          return toast.warning(
            "Action impossible. Vous tenter d'ajouter plus de produits que disponible dans le stock",
          );
        }

        updateQuantity({
          cartId: cart.id,
          productId: existingItem.productId,
          quantity: quantity,
          options: existingItem.options,
        });

        return;
      }

      const existingItemWithoutOptions = cart.items.find((item) => {
        return item.productId === product.productId;
      });

      if (existingItemWithoutOptions) {
        // Product with the same options is already in the cart

        if (
          !inStock(
            existingItemWithoutOptions,
            existingItemWithoutOptions.quantity + quantity,
          )
        ) {
          return toast.warning(
            "Action impossible. Vous tenter d'ajouter plus de produits que disponible dans le stock",
          );
        }
      } else {
        // Product not in cart
        if (!inStock(product, quantity)) {
          return toast.warning(
            "Action impossible. Vous tenter d'ajouter plus de produits que disponible dans le stock",
          );
        }
      }

      // Product not in cart
      addProduct({
        cartId: cart.id,
        item: {
          name: product.name,
          id: product.productId,
          productType: product.productType,
          image: product.image,
          quantity,
          price: product.price,
          stock: product.stock,
          options: product.options,
          rate: currency.rate,
          currency: currency.code,
          ...product.options,
        },
      });

      // setCart((prev) => {
      //   if (!prev) return;

      //   const existingItemIndex = prev.items.findIndex(
      //     (item) => item.productId === product.productId,
      //   );

      //   // Optimistic update
      //   if (existingItemIndex > -1) {
      //     // Product already in cart
      //     const existingItem = prev.items[existingItemIndex];

      //     if (!inStock(product, existingItem.quantity + quantity)) {
      //       toast.warning("Il n'y a plus assez de stock pour ce produit");
      //       return prev;
      //     }

      //     updateQuantity({
      //       cartId: cart.id,
      //       productId: existingItem.productId,
      //       quantity: quantity,
      //     })

      //     const newItems = [...prev.items];
      //     newItems[existingItemIndex] = {
      //       ...existingItem,
      //       quantity: existingItem.quantity + quantity,
      //     };

      //     return { ...prev, items: newItems };
      //   }

      //   // Product not in cart
      //   return { ...prev, sessionId };
      // });
    }
  };

  const incrementProductQuantity = async (
    product: CartItem,
    quantity: number,
  ) => {
    if (!cart) {
      return;
    }
    const newQuantity = product.quantity + quantity;

    if (!inStock(product, newQuantity)) {
      return toast.warning(
        "Action impossible. Vous tenter d'ajouter plus de produits que disponible dans le stock",
      );
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId === product.productId &&
        isEqual(item.options, product.options),
    );

    if (existingItemIndex === -1) {
      toast.warning("Ce produit n'est pas dans votre panier");
      return;
    }

    incrementQuantity({
      cartId: cart.id,
      productId: product.productId,
      quantity,
      options: product.options,
    });
  };

  const decrementProductQuantity = async (
    product: CartItem,
    quantity: number,
  ) => {
    if (!cart) {
      return;
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId === product.productId &&
        isEqual(item.options, product.options),
    );

    if (existingItemIndex === -1) {
      toast.warning("Ce produit n'est pas dans votre panier");
      return;
    }

    if (product.quantity - quantity === 0) {
      removeProductFromCart(product);
      return;
    }

    decrementQuantity({
      cartId: cart.id,
      productId: product.productId,
      quantity,
      options: product.options,
    });
  };

  const removeProductFromCart = async (product: CartItem) => {
    if (!cart) {
      return;
    }

    const newCart = cart.items.filter(
      (item) => item.productId !== product.productId,
    );

    if (newCart.length === 0) {
      removeProduct({
        cartId: cart.id,
        productId: product.productId,
        options: product.options,
      });
      dropCart();
      return;
    }

    setCart({ ...cart, items: newCart });

    removeProduct({
      cartId: cart.id,
      productId: product.productId,
      options: product.options,
    });
  };

  const dropCart = async () => {
    if (cart) {
      drop({ cartId: cart.id });
    }
  };

  const cartItemsLength = useMemo(() => {
    if (!cart) return 0;

    if (cart.items.length === 0) return 0;

    return cart.items
      .map((item) => item.quantity)
      .reduce((acc, cur) => acc + cur);
  }, [cart]);

  const surMesureTotal = useMemo(() => {
    if (!cart) return 0;

    let total = 0;
    for (const item of cart.items) {
      if (item.options.size === "sur-mesure") {
        total += SUR_MESURE_PRICE * item.quantity;
      }
    }
    return total;
  }, [cart]);

  const subTotal = useMemo(() => {
    if (!cart) return 0;

    const sub = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    );

    return sub + surMesureTotal;
  }, [cart]);

  const totalWeight = useMemo(() => {
    if (!cart) return 0;

    let weight = 0;

    // Calculate the approximate weight of the cart items
    // Shirt is 0.25kg
    // Pant is 0.3kg
    for (const item of cart.items) {
      if (
        item.productType === "CLASSIC_SHIRTS" ||
        item.productType === "AFRICAN_SHIRTS"
      ) {
        weight += SHIRT_WEIGHT * item.quantity;
      } else if (item.productType === "PANTS") {
        weight += PANTS_WEIGHT * item.quantity;
      } else if (
        item.productType === "MEN_SUITS" ||
        item.productType === "WOMEN_SUITS"
      ) {
        weight += SUITS_WEIGHT * item.quantity;
      } else {
        console.error("Unknown product type");
      }
    }

    return weight;
  }, [cart, deliveryArea]);

  const deliveryPrice = useMemo(() => {
    if (!cart) return 0;

    if (deliveryArea === "Afrique") {
      return 0;
    }

    if (totalWeight <= 2.5) {
      if (deliveryArea === "Europe") {
        return 18500;
      } else {
        return 21000;
      }
    } else if (totalWeight > 2.5 && totalWeight <= 5) {
      if (deliveryArea === "Europe") {
        return 37000;
      } else {
        return 42000;
      }
    } else if (totalWeight > 5 && totalWeight <= 7.5) {
      if (deliveryArea === "Europe") {
        return 55500;
      } else {
        return 63000;
      }
    } else if (totalWeight > 7.5 && totalWeight <= 10) {
      if (deliveryArea === "Europe") {
        return 74000;
      } else {
        return 84000;
      }
    }

    return 0;
  }, [cart, deliveryArea, totalWeight]);

  const total = useMemo(() => {
    if (!cart) return 0;

    if (deliveryPrice === 0) return subTotal;

    return subTotal + deliveryPrice;
  }, [cart, deliveryPrice]);

  return {
    cart,
    getCart,
    addProductToCart,
    creatingCart,
    updatingQuantity,
    addingProduct,
    dropCart,
    droppingCart,
    removeProductFromCart,
    removing,
    subTotal,
    incrementProductQuantity,
    incrementing,
    decrementProductQuantity,
    decrementing,
    total,
    totalWeight,
    surMesureTotal,
    deliveryPrice,
    paymentGateway,
    cartItemsLength,
  };
};
