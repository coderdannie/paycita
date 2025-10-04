import * as React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  placement?: 'top' | 'bottom';
}

// Simple CSS-based tooltip (accessible fallback with aria-describedby)
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  delay = 200,
  placement = 'top',
}) => {
  const [visible, setVisible] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const id = React.useId();

  const show = () => {
    timeoutRef.current = window.setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
            {
              "aria-describedby": id,
            }
          )
        : children}
      {visible && (
        <span
          id={id}
          role="tooltip"
          className={[
            'pointer-events-none absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-md animate-fade-in',
            'left-1/2 -translate-x-1/2',
            placement === 'top' && '-top-2 translate-y-[-100%]',
            placement === 'bottom' && '-bottom-2 translate-y-[100%]'
          ].filter(Boolean).join(' ')}
        >
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
