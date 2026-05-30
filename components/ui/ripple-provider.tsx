"use client"

import * as React from "react"

const RIPPLE_TARGET = "button, [role='button'], [data-slot='button']"
const RIPPLE_DURATION = 900

function RippleProvider() {
  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const trigger = target.closest<HTMLElement>(RIPPLE_TARGET)

      if (!trigger || trigger.hasAttribute("disabled") || trigger.getAttribute("aria-disabled") === "true") {
        return
      }

      const rect = trigger.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2.1
      const ripple = document.createElement("span")

      ripple.setAttribute("aria-hidden", "true")
      ripple.className = "button-ripple"
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`

      trigger.classList.add("button-ripple-pressed")
      trigger.appendChild(ripple)

      window.setTimeout(() => ripple.remove(), RIPPLE_DURATION)
    }

    function clearPressedState() {
      document
        .querySelectorAll<HTMLElement>(".button-ripple-pressed")
        .forEach((trigger) => trigger.classList.remove("button-ripple-pressed"))
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("pointerup", clearPressedState)
    document.addEventListener("pointercancel", clearPressedState)
    document.addEventListener("pointerleave", clearPressedState)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointerup", clearPressedState)
      document.removeEventListener("pointercancel", clearPressedState)
      document.removeEventListener("pointerleave", clearPressedState)
    }
  }, [])

  return null
}

export { RippleProvider }
