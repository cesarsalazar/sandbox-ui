import type { SVGProps } from "react";

// The few icons sandbox-ui's own components need. Paths from Lucide
// (lucide.dev, ISC licence), the set Sandbox apps use, so they match the
// icons apps pass in. Apps bring their own icons for everything else.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(paths: string[], displayName: string) {
  function Icon({ size = 20, strokeWidth = 1.75, ...props }: IconProps) {
    return (
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export const XIcon = make(["M18 6 6 18", "m6 6 12 12"], "XIcon");
export const ChevronLeftIcon = make(["m15 18-6-6 6-6"], "ChevronLeftIcon");
export const ChevronRightIcon = make(["m9 18 6-6-6-6"], "ChevronRightIcon");
export const ArrowUpRightIcon = make(["M7 7h10v10", "M7 17 17 7"], "ArrowUpRightIcon");
export const ChevronDownIcon = make(["m6 9 6 6 6-6"], "ChevronDownIcon");
export const SearchIcon = make(["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "m21 21-4.3-4.3"], "SearchIcon");
export const CheckIcon = make(["M20 6 9 17l-5-5"], "CheckIcon");
export const CopyIcon = make(
  ["M8 10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2Z", "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"],
  "CopyIcon",
);
export const GlobeIcon = make(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M2 12h20", "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"], "GlobeIcon");
export const PlusIcon = make(["M5 12h14", "M12 5v14"], "PlusIcon");
export const PencilIcon = make(
  ["M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z", "m15 5 4 4"],
  "PencilIcon",
);
// iOS's own share symbol, which the Add to Home Screen steps point at.
export const ShareIcon = make(["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "M16 6l-4-4-4 4", "M12 2v13"], "ShareIcon");
export const PlusSquareIcon = make(["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z", "M8 12h8", "M12 8v8"], "PlusSquareIcon");
export const WifiOffIcon = make(
  ["M12 20h.01", "M8.5 16.43a5 5 0 0 1 7 0", "M2 8.82a15 15 0 0 1 4.17-2.65", "M10.66 5c4.01-.36 8.14.9 11.34 3.76", "M16.85 11.25a10 10 0 0 1 2.22 1.68", "M5 12.86a10 10 0 0 1 5.17-2.69", "m2 2 20 20"],
  "WifiOffIcon",
);
