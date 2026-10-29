"use client";
import { useEffect } from "react";
import { remember } from "@/components/Experience";

export default function Remember(props: { id: number; name: string; slug: string; image: string; price: number }) {
  useEffect(() => {
    remember(props);
  }, [props.id]);
  return null;
}
