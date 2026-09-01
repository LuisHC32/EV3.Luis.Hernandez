type ProManageBrandProps = {
  compact?: boolean;
};

/** Tamaño del icono en px — cambia estos valores para agrandar o achicar el logo */
const LOGO_ICON_SIZE = {
  desktop: 40,
  mobile: 36,
} as const;

export function ProManageBrand({ compact = false }: ProManageBrandProps) {
  const iconPx = compact ? LOGO_ICON_SIZE.mobile : LOGO_ICON_SIZE.desktop;

  return (
    <div className="flex w-full items-center gap-sm overflow-visible">
      <span
        className="material-symbols-outlined fill shrink-0 leading-none text-secondary"
        style={{
          fontSize: iconPx,
          fontVariationSettings: `"FILL" 1, "wght" 400, "GRAD" 0, "opsz" ${Math.min(iconPx, 48)}`,
        }}
        aria-hidden
      >
        dashboard_customize
      </span>
      <span className="font-title-lg text-title-lg font-black tracking-normal whitespace-nowrap text-secondary">
        ProManage
      </span>
    </div>
  );
}
