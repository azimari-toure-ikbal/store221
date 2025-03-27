"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtomValue } from "jotai";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Product types and their specific filter options
// type ProductType = "ALL" | "SHIRTS" | "PANTS" | "SUITS";

// Import atoms from your atoms file
import { Slider } from "@/components/ui/slider";
import { AVAILABLE_SORT, DEFAULT_LIMIT } from "@/config";
import { useShopFilters } from "@/hooks/use-states";
import { currencyAtom } from "@/lib/atoms";
import {
  collarTypes,
  pantFits,
  pantLegs,
  ProductTypes,
  sleevesLengths,
  wristsTypes,
} from "@/lib/db/schema";
import {
  formatCollarType,
  formatPantFit,
  formatPantLeg,
  formatPrice,
  formatSleevesLength,
  formatSortOption,
  formatWristsType,
} from "@/lib/utils";
import { ProductFilter } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { ProductItemResponse } from "@/types";

export default function ProductListingPage() {
  const [{ filter, page }, setFilters] = useShopFilters();

  const currency = useAtomValue(currencyAtom);

  // Filter section collapse state
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({
    productType: false,
    priceRange: false,
    shirtOptions: false,
    pantOptions: false,
    suitOptions: false,
  });

  // Fetch products using tRPC
  const { data: products, isLoading } =
    trpc.products.getPaginatedProducts.useQuery({
      page,
      pageSize: DEFAULT_LIMIT,
      filter,
    });

  // Toggle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle type change
  const handleTypeChange = (type: ProductTypes | "ALL") => {
    setFilters((prev) => {
      const newFilter = {
        ...prev,
        filter: { ...prev.filter, productType: type },
      };

      // Clear irrelevant filters when type changes
      if (
        type !== "AFRICAN_SHIRTS" &&
        type !== "CLASSSIC_SHIRTS" &&
        type !== "MEN_SUITS" &&
        type !== "WOMEN_SUITS"
      ) {
        newFilter.filter.sleevesOptions = [];
        newFilter.filter.wristsOptions = [];
        newFilter.filter.collarOptions = [];
      }

      if (type !== "PANTS" && type !== "MEN_SUITS" && type !== "WOMEN_SUITS") {
        newFilter.filter.pantFitOptions = [];
        newFilter.filter.pantLegOptions = [];
      }

      if (type !== "MEN_SUITS" && type !== "WOMEN_SUITS") {
        newFilter.filter.sleevesOptions = [];
        newFilter.filter.wristsOptions = [];
        newFilter.filter.collarOptions = [];
        newFilter.filter.pantFitOptions = [];
        newFilter.filter.pantLegOptions = [];
      }

      return { ...prev, page: 0, filter: newFilter.filter };
    });
  };

  // Handle filter changes
  const handleFilterChange = (
    category: keyof Omit<ProductFilter, "price" | "productType" | "sort">,
    value: string,
  ) => {
    const isFilterApplied = filter[category].includes(value as never);

    setFilters((prev) => ({
      ...prev,
      page: 0,
      filter: {
        ...prev.filter,
        [category]: isFilterApplied
          ? prev.filter[category].filter((v) => v !== value)
          : [...prev.filter[category], value],
      },
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      page: 0,
      filter: {
        ...prev.filter,
        price: max,
      },
    }));
  };

  // Handle sort change
  const handleSortChange = (value: (typeof AVAILABLE_SORT)[number]) => {
    setFilters((prev) => ({
      ...prev,
      page: 0,
      filter: {
        ...prev.filter,
        sort: value,
      },
    }));
  };

  // Handle pagination
  const goToPage = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const goToPreviousPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(prev.page - 1, 1),
    }));
  };

  const goToNextPage = () => {
    if (products && page < Math.ceil(products.total / DEFAULT_LIMIT)) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(null);
  };

  // Check if a filter is active
  const isFilterActive = (
    category: keyof Omit<ProductFilter, "price">,
    value: string,
  ) => {
    return filter[category].includes(value as never);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters: {
      category: keyof Omit<ProductFilter, "price" | "productType" | "sort">;
      value: string;
    }[] = [];

    Object.entries(filter).forEach(([key, value]: [any, any]) => {
      if (key !== "sort" && key !== "price" && key !== "productType") {
        if (Array.isArray(value)) {
          value.forEach((val) => {
            activeFilters.push({ category: key, value: val });
          });
        }
      }
    });

    return activeFilters;
  };

  // Calculate total pages
  const totalPages = products ? Math.ceil(products.total / DEFAULT_LIMIT) : 0;

  // Render filter section
  const renderFilterSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filtres</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Réinitialiser
        </Button>
      </div>

      {/* Product Type Filter */}
      <div className="space-y-2">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("productType")}
        >
          <h3 className="font-medium">Type</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {collapsedSections.productType ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </Button>
        </div>

        {!collapsedSections.productType && (
          <RadioGroup value={filter.productType || "ALL"} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="all"
                value="ALL"
                onClick={() => handleTypeChange("ALL")}
              />
              <Label htmlFor="all">Tout</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="shirts"
                value="SHIRTS"
                onClick={() => handleTypeChange("CLASSSIC_SHIRTS")}
              />
              <Label htmlFor="shirts">Chemises Classiques</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="shirts"
                value="SHIRTS"
                onClick={() => handleTypeChange("AFRICAN_SHIRTS")}
              />
              <Label htmlFor="shirts">Chemises Africaines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="pants"
                value="PANTS"
                onClick={() => handleTypeChange("PANTS")}
              />
              <Label htmlFor="pants">Pantalons</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="suits"
                value="SUITS"
                onClick={() => handleTypeChange("MEN_SUITS")}
              />
              <Label htmlFor="suits">Costumes Hommes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id="suits"
                value="SUITS"
                onClick={() => handleTypeChange("WOMEN_SUITS")}
              />
              <Label htmlFor="suits">Costumes Femmes</Label>
            </div>
          </RadioGroup>
        )}
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-2">
        <div
          className="flex cursor-pointer items-center justify-between"
          onClick={() => toggleSection("priceRange")}
        >
          <h3 className="font-medium">Tarif</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {collapsedSections.priceRange ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronUp size={16} />
            )}
          </Button>
        </div>

        {!collapsedSections.priceRange && products && (
          <div className="space-y-4 pt-2">
            <div className="text-muted-foreground flex justify-between text-sm">
              <span>
                {formatPrice(products.minPrice, currency.code, currency.rate)}
              </span>
              <span>
                {formatPrice(products.avgPrice, currency.code, currency.rate)}
              </span>
            </div>
            <Slider
              defaultValue={[filter.price || products.minPrice]}
              min={products.minPrice}
              max={products.maxPrice}
              step={500}
              onValueChange={(values) => {
                handlePriceRangeChange(values[0], values[1]);
              }}
              className="my-6"
            />
            <Button
              variant={!filter.price ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  filter: {
                    ...prev.filter,
                    price: 0,
                  },
                }));
              }}
              className="w-full"
            >
              Remise à 0
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Shirt Options - Only show if ALL or SHIRTS is selected */}
      {(!filter.productType || filter.productType !== "PANTS") && (
        <>
          <div className="space-y-2">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => toggleSection("shirtOptions")}
            >
              <h3 className="font-medium">Options de chemise</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {collapsedSections.shirtOptions ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </Button>
            </div>

            {!collapsedSections.shirtOptions && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Longueur des manches</h4>
                  <div className="space-y-1">
                    {sleevesLengths.map((sleeve, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={sleeve}
                          checked={isFilterActive("sleevesOptions", sleeve)}
                          onCheckedChange={() =>
                            handleFilterChange("sleevesOptions", sleeve)
                          }
                        />
                        <Label htmlFor={sleeve}>
                          {formatSleevesLength(sleeve)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Type de col</h4>
                  <div className="space-y-1">
                    {collarTypes.map((col, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={col}
                          checked={isFilterActive("collarOptions", col)}
                          onCheckedChange={() =>
                            handleFilterChange("collarOptions", col)
                          }
                        />
                        <Label htmlFor={col}>{formatCollarType(col)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Type de poignets</h4>
                  <div className="space-y-1">
                    {wristsTypes.map((wrist, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={wrist}
                          checked={isFilterActive("wristsOptions", wrist)}
                          onCheckedChange={() =>
                            handleFilterChange("wristsOptions", wrist)
                          }
                        />
                        <Label htmlFor={wrist}>{formatWristsType(wrist)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />
        </>
      )}

      {/* Pant Options - Only show if ALL or PANTS is selected */}
      {(!filter.productType ||
        ["ALL", "PANTS", "MEN_SUITS", "WOMEN_SUITS"].includes(
          filter.productType,
        )) && (
        <>
          <div className="space-y-2">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => toggleSection("pantOptions")}
            >
              <h3 className="font-medium">Pant Options</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {collapsedSections.pantOptions ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
              </Button>
            </div>

            {!collapsedSections.pantOptions && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Coupe du pantalon</h4>
                  <div className="space-y-1">
                    {pantFits.map((fit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={fit}
                          checked={isFilterActive("pantFitOptions", fit)}
                          onCheckedChange={() =>
                            handleFilterChange("pantFitOptions", fit)
                          }
                        />
                        <Label htmlFor={fit}>{formatPantFit(fit)}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Bas de pantalon</h4>
                  <div className="space-y-1">
                    {pantLegs.map((leg, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={leg}
                          checked={isFilterActive("pantLegOptions", leg)}
                          onCheckedChange={() =>
                            handleFilterChange("pantLegOptions", leg)
                          }
                        />
                        <Label htmlFor={leg}>{formatPantLeg(leg)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />
        </>
      )}

      {/* Suit Options - Only show if ALL or SUITS is selected */}
      {/* {(!filter.productType ||
        filter.productType === "ALL" ||
        filter.productType === "SUITS") && (
        <div className="space-y-2">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => toggleSection("suitOptions")}
          >
            <h3 className="font-medium">Suit Options</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {collapsedSections.suitOptions ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
            </Button>
          </div>

          {!collapsedSections.suitOptions && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Jacket Style</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="single-breasted"
                      checked={isFilterActive("jacketStyle", "Single Breasted")}
                      onCheckedChange={() =>
                        handleFilterChange("jacketStyle", "Single Breasted")
                      }
                    />
                    <Label htmlFor="single-breasted">Single Breasted</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="double-breasted"
                      checked={isFilterActive("jacketStyle", "Double Breasted")}
                      onCheckedChange={() =>
                        handleFilterChange("jacketStyle", "Double Breasted")
                      }
                    />
                    <Label htmlFor="double-breasted">Double Breasted</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Lapel Style</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notch-lapel"
                      checked={isFilterActive("lapelStyle", "Notch Lapel")}
                      onCheckedChange={() =>
                        handleFilterChange("lapelStyle", "Notch Lapel")
                      }
                    />
                    <Label htmlFor="notch-lapel">Notch Lapel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="peak-lapel"
                      checked={isFilterActive("lapelStyle", "Peak Lapel")}
                      onCheckedChange={() =>
                        handleFilterChange("lapelStyle", "Peak Lapel")
                      }
                    />
                    <Label htmlFor="peak-lapel">Peak Lapel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shawl-lapel"
                      checked={isFilterActive("lapelStyle", "Shawl Lapel")}
                      onCheckedChange={() =>
                        handleFilterChange("lapelStyle", "Shawl Lapel")
                      }
                    />
                    <Label htmlFor="shawl-lapel">Shawl Lapel</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )} */}
    </div>
  );

  // Render product skeleton
  const renderProductSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );

  // Render product card
  const renderProductCard = (product: ProductItemResponse) => (
    <Link href={`/shop/${product.id}`} key={product.id} className="group block">
      <div className="space-y-3">
        <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-lg">
          <Image
            src={product.gallery[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div>
          <h3 className="truncate font-medium group-hover:underline">
            {product.name}
          </h3>
          <p className="text-muted-foreground">
            {formatPrice(Number(product.price), currency.code, currency.rate)}
          </p>
        </div>
      </div>
    </Link>
  );

  // Render pagination
  const renderPagination = () => {
    if (!products || products.total === 0) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={page === i ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>,
      );
    }

    return (
      <div className="mt-8 flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToPreviousPage}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => goToPage(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="mx-1">...</span>}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="mx-1">...</span>}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => goToPage(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToNextPage}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>

          <div className="flex items-center space-x-2">
            <Select
              value={filter.sort || "newest"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_SORT.map((sort, index) => (
                  <SelectItem key={index} value={sort}>
                    {formatSortOption(sort)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtres</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                {renderFilterSection()}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Filters - Desktop */}
          <div className="hidden w-[250px] flex-shrink-0 md:block lg:w-[300px]">
            {renderFilterSection()}
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>{products?.items.length || 0} produit(s) trouvé(s)</span>
              </div>

              {Object.keys(filter).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8"
                >
                  <X className="mr-1 h-4 w-4" />
                  Réinitialiser les filtres
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {getActiveFilters().length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {getActiveFilters().map(({ category, value }) => (
                  <div
                    key={`${category}-${value}`}
                    className="bg-muted flex items-center rounded-full px-3 py-1 text-sm"
                  >
                    <span>{value}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-5 w-5 hover:bg-transparent"
                      onClick={() => handleFilterChange(category, value)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
                  <div key={index}>{renderProductSkeleton()}</div>
                ))
              ) : products && products.items.length > 0 ? (
                // Product cards
                products.items.map((product: any) => renderProductCard(product))
              ) : (
                // No products found
                <div className="col-span-full py-12 text-center">
                  <h3 className="mb-2 text-lg font-medium">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez d'ajuster vos filtres pour trouver ce que vous
                    cherchez.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Réinitialiser tous les filtres
                  </Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isLoading && products && products.total > 0 && renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}
