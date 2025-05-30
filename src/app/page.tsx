"use client"

import { useState, useRef, useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/chat");
}
