import ProductForm from "@/components/forms/product-form";
import React from "react";

type Params = Promise<{ id: string }>;

type ProductUpdatePageProps = {
  params: Params;
};

const ProductUpdatePage: React.FC<ProductUpdatePageProps> = async ({
  params,
}) => {
  const { id } = await params;

  return <ProductForm id={id} />;
};

export default ProductUpdatePage;
