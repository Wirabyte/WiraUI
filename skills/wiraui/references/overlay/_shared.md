# Shared rules: overlay

Slots are written v3-style (`<ng-template #footer>`); v1/v2 use `<ng-template wuTemplate="footer">` (`pTemplate` also works). Overlays open in the browser top layer: never set `appendTo` / `z-index` / `baseZIndex` / `autoZIndex` / `transitionOptions` (accepted, no effect).
