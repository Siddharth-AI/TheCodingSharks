"use client"

import { ToastContainer } from "react-toastify"

export function AppToaster() {
  return (
    <ToastContainer
      position="bottom-right"
      theme="dark"
      newestOnTop
      closeOnClick
      pauseOnHover
      autoClose={2500}
      className="!z-[9999]"
      toastClassName={() =>
        "bg-card text-foreground border border-border rounded-xl shadow-lg"
      }
      progressClassName={() => "bg-primary"}
    />
  )
}
