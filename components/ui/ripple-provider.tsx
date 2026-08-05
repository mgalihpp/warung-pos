"use client"

import * as React from "react"

const RIPPLE_TARGET =
  "button, [role='button'], [data-slot='button'], [data-slot='sidebar-menu-button'], [data-slot='sidebar-menu-sub-button'], [data-slot='pagination-link']"
const RIPPLE_DURATION = 900

function isRippleDisabled(trigger: HTMLElement) {
  return (
    trigger.hasAttribute("disabled") ||
    trigger.getAttribute("aria-disabled") === "true" ||
    trigger.hasAttribute("data-disabled")
  )
}

function spawnRipple(trigger: HTMLElement, originX: number, originY: number) {
  const rect = trigger.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.1
  const ripple = document.createElement("span")

  ripple.setAttribute("aria-hidden", "true")
  ripple.className = "button-ripple"
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${originX - rect.left - size / 2}px`
  ripple.style.top = `${originY - rect.top - size / 2}px`

  trigger.classList.add("button-ripple-pressed")
  trigger.appendChild(ripple)

  window.setTimeout(() => ripple.remove(), RIPPLE_DURATION)
}

function RippleProvider() {
  React.useEffect(() => {
    let activeTrigger: HTMLElement | null = null

    function resolveTrigger(target: EventTarget | null) {
      if (!(target instanceof Element)) {
        return null
      }

      const trigger = target.closest<HTMLElement>(RIPPLE_TARGET)

      if (!trigger || isRippleDisabled(trigger)) {
        return null
      }

      // Link teks inline (variant "link") tidak cocok dengan ripple kotak.
      if (trigger.getAttribute("data-variant") === "link") {
        return null
      }

      return trigger
    }

    function clearPressedState() {
      activeTrigger?.classList.remove("button-ripple-pressed")
      activeTrigger = null
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0) {
        return
      }

      const trigger = resolveTrigger(event.target)

      if (!trigger) {
        return
      }

      activeTrigger = trigger
      spawnRipple(trigger, event.clientX, event.clientY)
    }

    function handlePointerMove(event: PointerEvent) {
      // Drag keluar dari tombol yang sedang ditekan -> lepaskan pressed state.
      if (activeTrigger && resolveTrigger(event.target) !== activeTrigger) {
        clearPressedState()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") {
        return
      }

      // Abaikan key-repeat saat tombol ditahan supaya ripple tidak menumpuk.
      if (event.repeat) {
        return
      }

      const trigger = resolveTrigger(event.target)

      if (!trigger) {
        return
      }

      const rect = trigger.getBoundingClientRect()
      activeTrigger = trigger
      spawnRipple(
        trigger,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      )
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", clearPressedState)
    document.addEventListener("pointercancel", clearPressedState)
    document.addEventListener("pointerleave", clearPressedState)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", clearPressedState)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", clearPressedState)
      document.removeEventListener("pointercancel", clearPressedState)
      document.removeEventListener("pointerleave", clearPressedState)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", clearPressedState)
    }
  }, [])

  return null
}

export { RippleProvider }
